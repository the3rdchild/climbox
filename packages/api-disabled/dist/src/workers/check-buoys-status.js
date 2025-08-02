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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBuoysStatus = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const luxon_1 = require("luxon");
const sites_entity_1 = require("../sites/sites.entity");
const source_type_enum_1 = require("../sites/schemas/source-type.enum");
const latest_data_entity_1 = require("../time-series/latest-data.entity");
const slack_utils_1 = require("../utils/slack.utils");
const logger = new common_1.Logger('checkBuoysStatus');
function checkBuoysStatus(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        const slackToken = process.env.SLACK_BOT_TOKEN;
        const slackChannel = process.env.SLACK_BOT_CHANNEL;
        const sitesDeployedBuoy = yield connection.getRepository(sites_entity_1.Site).find({
            where: { status: sites_entity_1.SiteStatus.Deployed },
            select: ['id', 'sensorId', 'spotterApiToken', 'name'],
        });
        const siteIds = sitesDeployedBuoy.map((x) => x.id);
        if (!(siteIds.length > 0)) {
            logger.log('No site with deployed buoys found.');
            return;
        }
        const latestData = yield connection.getRepository(latest_data_entity_1.LatestData).find({
            where: {
                source: source_type_enum_1.SourceType.SPOTTER,
                site: { id: (0, typeorm_1.In)(siteIds) },
                timestamp: (0, typeorm_1.MoreThan)(luxon_1.DateTime.now().minus({ days: 2 }).startOf('day').toJSDate()),
            },
        });
        const sitesWithDeployedSpotters = [
            ...new Map(latestData.map((x) => [x.siteId, x])).values(),
        ].map((x) => x.siteId);
        const diff = (0, lodash_1.difference)(siteIds, sitesWithDeployedSpotters);
        if (diff.length === 0) {
            logger.log("No problems with spotters' status");
            return;
        }
        const diffSites = sitesDeployedBuoy.filter((x) => diff.includes(x.id));
        // Create a simple alert template for slack
        const messageTemplate = {
            // The channel id is fetched by requesting the list on GET https://slack.com/api/conversations.list
            // (the auth token should be included in the auth headers)
            channel: slackChannel || '',
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `The following spotters have not sent data for more than 2 days!\n${diffSites
                            .map((x) => `${x.sensorId} for <https://aqualink.org/sites/${x.id}|site ${x.id} ${x.name}> ${x.spotterApiToken ? '(using private token)' : ''}\n`)
                            .join('')}`,
                    },
                },
            ],
        };
        // Log message in stdout
        logger.warn(messageTemplate);
        if (!slackToken) {
            logger.error('No slack bot token was defined.');
            return;
        }
        if (!slackChannel) {
            logger.error('No slack target channel was defined.');
            return;
        }
        // Send an alert containing all irregular video stream along with the reason
        yield (0, slack_utils_1.sendSlackMessage)(messageTemplate, slackToken);
    });
}
exports.checkBuoysStatus = checkBuoysStatus;
