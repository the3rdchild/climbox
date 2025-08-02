"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiTimeSeriesRangeResponse = exports.ApiTimeSeriesResponse = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const source_type_enum_1 = require("../sites/schemas/source-type.enum");
const metrics_enum_1 = require("../time-series/metrics.enum");
const reduceArrayToObject = (previousValue, currentValue) => {
    return Object.assign(Object.assign({}, currentValue), previousValue);
};
const ApiTimeSeriesResponse = () => {
    const sources = Object.values(source_type_enum_1.SourceType)
        .map((source) => {
        const metrics = Object.values(metrics_enum_1.Metric)
            .map((metric) => {
            return {
                [metric]: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            timestamp: {
                                type: 'string',
                                format: 'date-time',
                            },
                            value: {
                                type: 'number',
                                example: '12.32',
                            },
                        },
                    },
                },
            };
        })
            .reduce(reduceArrayToObject, {});
        return {
            [source]: {
                type: 'object',
                properties: metrics,
            },
        };
    })
        .reduce(reduceArrayToObject, {});
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOkResponse)({
        schema: {
            type: 'object',
            properties: sources,
        },
    }));
};
exports.ApiTimeSeriesResponse = ApiTimeSeriesResponse;
const ApiTimeSeriesRangeResponse = () => {
    const sources = Object.values(source_type_enum_1.SourceType)
        .map((source) => {
        const metrics = Object.values(metrics_enum_1.Metric)
            .map((metric) => {
            return {
                [metric]: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            maxDate: {
                                type: 'string',
                                format: 'date-time',
                            },
                            minDate: {
                                type: 'string',
                                format: 'date-time',
                            },
                        },
                    },
                },
            };
        })
            .reduce(reduceArrayToObject, {});
        return {
            [source]: {
                type: 'object',
                properties: metrics,
            },
        };
    })
        .reduce(reduceArrayToObject, {});
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOkResponse)({
        schema: {
            type: 'object',
            properties: sources,
        },
    }));
};
exports.ApiTimeSeriesRangeResponse = ApiTimeSeriesRangeResponse;
