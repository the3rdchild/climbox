"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYouTubeVideoId = exports.isValidId = exports.idFromHash = exports.hashId = void 0;
// Use require because of TS issues...
// https://github.com/niieani/hashids.js/issues/210
const Hashids = require('hashids/cjs');
const hasher = new Hashids(process.env.URL_SALT || process.env.APP_SECRET, 10);
const hashId = (id) => hasher.encode(id);
exports.hashId = hashId;
const idFromHash = (hash) => hasher.decode(hash)[0];
exports.idFromHash = idFromHash;
// Check to see if an id is valid - basically it must be an integer string with no extra characters
const isValidId = (id) => id.match(/^[0-9]+$/);
exports.isValidId = isValidId;
// Get YouTube ID from various YouTube URL
// Same as function `getYouTubeVideoId` in `packages/website/src/helpers/video.ts`
// Works for the following url format:
// - https://www.youtube.com/embed/videoID/?someArgs
const getYouTubeVideoId = (url, isPlaylist) => {
    var _a;
    if (isPlaylist) {
        return url.split('=')[1];
    }
    const urlParts = (_a = url === null || url === void 0 ? void 0 : url.split('?')[0]) === null || _a === void 0 ? void 0 : _a.split('/embed/');
    // For an expected video url format we expect the url to be split in 2 parts
    // E.g. ["https://www.youtube.com", "videoID/"]
    if (urlParts.length !== 2) {
        return undefined;
    }
    // Remove any trailing forward slash '/'
    return urlParts[1].replace('/', '');
};
exports.getYouTubeVideoId = getYouTubeVideoId;
