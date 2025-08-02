"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorDataDto = void 0;
const openapi = require("@nestjs/swagger");
const source_type_enum_1 = require("../../sites/schemas/source-type.enum");
class SensorDataDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.SensorDataDto = SensorDataDto;
source_type_enum_1.SourceType.SPOTTER, source_type_enum_1.SourceType.HOBO, source_type_enum_1.SourceType.NOAA;
