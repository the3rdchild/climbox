"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotterDataDto = void 0;
const openapi = require("@nestjs/swagger");
class SpotterDataDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { topTemperature: { required: true, type: () => [require("../../time-series/dto/time-series-value.dto").TimeSeriesValueDto] }, bottomTemperature: { required: true, type: () => [require("../../time-series/dto/time-series-value.dto").TimeSeriesValueDto] } };
    }
}
exports.SpotterDataDto = SpotterDataDto;
