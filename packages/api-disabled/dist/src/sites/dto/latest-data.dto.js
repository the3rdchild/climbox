"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SofarLatestDataDto = void 0;
const openapi = require("@nestjs/swagger");
class SofarLatestDataDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { latestData: { required: false, type: () => [require("../../time-series/latest-data.entity").LatestData] } };
    }
}
exports.SofarLatestDataDto = SofarLatestDataDto;
