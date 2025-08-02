"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSurveyMediaFileFromURL = exports.GoogleCloudDir = void 0;
const common_1 = require("@nestjs/common");
const { GCS_BUCKET } = process.env;
var GoogleCloudDir;
(function (GoogleCloudDir) {
    GoogleCloudDir["SURVEYS"] = "surveys";
    GoogleCloudDir["DATA_UPLOADS"] = "data_uploads";
})(GoogleCloudDir = exports.GoogleCloudDir || (exports.GoogleCloudDir = {}));
const getSurveyMediaFileFromURL = (url) => {
    if (!GCS_BUCKET) {
        throw new common_1.InternalServerErrorException('GCS_BUCKET variable is not set');
    }
    return url.split(`${GCS_BUCKET}/`)[1];
};
exports.getSurveyMediaFileFromURL = getSurveyMediaFileFromURL;
