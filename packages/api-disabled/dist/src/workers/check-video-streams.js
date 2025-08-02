"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVideoStreams = exports.getErrorMessage = exports.fetchVideoDetails = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const typeorm_1 = require("typeorm");
const sites_entity_1 = require("../sites/sites.entity");
const slack_utils_1 = require("../utils/slack.utils");
const urls_1 = require("../utils/urls");
const logger = new common_1.Logger('CheckVideoStreams');
const getSiteFrontEndURL = (siteId, frontUrl) => new URL(`sites/${siteId}`, frontUrl).href;
const fetchVideoDetails = (youTubeIds, apiKey, playlist = false) => {
    return (0, axios_1.default)({
        url: `https://www.googleapis.com/youtube/v3/${playlist ? 'playlists' : 'videos'}`,
        method: 'get',
        params: {
            key: apiKey,
            id: youTubeIds.join(),
            part: `status${playlist ? '' : ',liveStreamingDetails'}`,
        },
    });
};
exports.fetchVideoDetails = fetchVideoDetails;
const getErrorMessage = (item, isPlaylist) => {
    const { uploadStatus, privacyStatus, embeddable } = item.status;
    if (privacyStatus === 'private') {
        return 'Video is not public';
    }
    if (!isPlaylist &&
        uploadStatus !== 'uploaded' &&
        uploadStatus !== 'processed') {
        return 'Video is no longer available';
    }
    if (!isPlaylist && !embeddable) {
        return 'Video is not embeddable';
    }
    if (item.liveStreamingDetails) {
        if (item.liveStreamingDetails.actualEndTime) {
            return 'The live stream has ended';
        }
        if (!item.liveStreamingDetails.actualStartTime) {
            return 'The live stream has not started yet';
        }
    }
    return '';
};
exports.getErrorMessage = getErrorMessage;
const getYTErrors = (sites, isPlaylist, apiKey, frontUrl) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract the youTube id from the URLs
    const siteIdToVideoStreamDetails = sites.reduce((mapping, site) => {
        const id = (0, urls_1.getYouTubeVideoId)(site.videoStream, isPlaylist);
        return Object.assign(Object.assign({}, mapping), { [site.id]: {
                id,
                name: site.name,
                siteId: site.id,
                url: site.videoStream,
                // If no id exists, then url is invalid
                error: id ? '' : 'Video stream URL is invalid',
            } });
    }, {});
    const youTubeIds = Object.values(siteIdToVideoStreamDetails)
        .map((videoStreamDetails) => videoStreamDetails.id)
        .filter((id) => id);
    // Fetch the youTube video information for each id
    const axiosResponse = yield (0, exports.fetchVideoDetails)(youTubeIds, apiKey, isPlaylist);
    // Validate that the streams are valid
    // For ids with no errors an empty string is returned
    const youTubeIdToError = checkVideoOptions(axiosResponse.data.items, isPlaylist);
    const blocks = Object.values(siteIdToVideoStreamDetails).reduce((msgs, { id, siteId, url, name, error }) => {
        const reportedError = error ||
            (!(id in youTubeIdToError) && 'Video does not exist') ||
            youTubeIdToError[id];
        if (!reportedError) {
            return msgs;
        }
        const template = {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*Site*: ${name} - ${getSiteFrontEndURL(siteId, frontUrl)}\n` +
                    `*Video*: ${url}\n` +
                    `*Error*: ${reportedError}`,
            },
        };
        return [...msgs, template];
    }, []);
    return blocks;
});
const checkVideoOptions = (youTubeVideoItems, isPlaylist) => youTubeVideoItems.reduce((mapping, item) => {
    return Object.assign(Object.assign({}, mapping), { [item.id]: (0, exports.getErrorMessage)(item, isPlaylist) });
}, {});
const checkVideoStreams = (dataSource, projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = process.env.FIREBASE_API_KEY;
    const slackToken = process.env.SLACK_BOT_TOKEN;
    const slackChannel = process.env.SLACK_BOT_CHANNEL;
    const frontUrl = process.env.FRONT_END_BASE_URL;
    // Check that the all necessary environment variables are set
    if (!apiKey) {
        logger.error('No google api key was defined');
        return;
    }
    if (!slackToken) {
        logger.error('No slack bot token was defined');
        return;
    }
    if (!slackChannel) {
        logger.error('No slack target channel was defined');
        return;
    }
    if (!frontUrl) {
        logger.error('No front url was defined');
        return;
    }
    // Fetch sites with streams
    const sitesWithStream = yield dataSource.getRepository(sites_entity_1.Site).find({
        where: { videoStream: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) },
    });
    const playlists = sitesWithStream.filter((x) => { var _a; return (_a = x.videoStream) === null || _a === void 0 ? void 0 : _a.includes('videoseries'); });
    const videos = sitesWithStream.filter((x) => { var _a; return !((_a = x.videoStream) === null || _a === void 0 ? void 0 : _a.includes('videoseries')); });
    const [playlistsBlock, videoBlocks] = yield Promise.all([
        getYTErrors(playlists, true, apiKey, frontUrl),
        getYTErrors(videos, false, apiKey, frontUrl),
    ]);
    const blocks = [...playlistsBlock, ...videoBlocks];
    // No irregular video streams were found
    // So skip sending an alert on slack
    if (!blocks.length) {
        return;
    }
    // Create a simple alert template for slack
    const messageTemplate = {
        // The channel id is fetched by requesting the list on GET https://slack.com/api/conversations.list
        // (the auth token should be included in the auth headers)
        channel: slackChannel,
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `Scheduled check of video streams in *${projectId}* instance`,
                },
            },
            {
                type: 'divider',
            },
            ...blocks,
        ],
    };
    // Log message in stdout
    logger.log(messageTemplate);
    // Send an alert containing all irregular video stream along with the reason
    yield (0, slack_utils_1.sendSlackMessage)(messageTemplate, slackToken);
});
exports.checkVideoStreams = checkVideoStreams;
