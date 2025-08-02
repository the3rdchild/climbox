"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sensorDataSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
const source_type_enum_1 = require("../sites/schemas/source-type.enum");
const time_series_point_dto_1 = require("../time-series/dto/time-series-point.dto");
exports.sensorDataSchema = {
    type: 'object',
    properties: {
        [source_type_enum_1.SourceType.SPOTTER]: {
            type: 'object',
            properties: {
                bottomTemperature: {
                    $ref: (0, swagger_1.getSchemaPath)(time_series_point_dto_1.TimeSeriesPoint),
                },
                topTemperature: {
                    $ref: (0, swagger_1.getSchemaPath)(time_series_point_dto_1.TimeSeriesPoint),
                },
            },
        },
        [source_type_enum_1.SourceType.HOBO]: {
            type: 'object',
            properties: {
                bottomTemperature: {
                    $ref: (0, swagger_1.getSchemaPath)(time_series_point_dto_1.TimeSeriesPoint),
                },
            },
        },
        [source_type_enum_1.SourceType.NOAA]: {
            type: 'object',
            properties: {
                satelliteTemperature: {
                    $ref: (0, swagger_1.getSchemaPath)(time_series_point_dto_1.TimeSeriesPoint),
                },
            },
        },
    },
};
