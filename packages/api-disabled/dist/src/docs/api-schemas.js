"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointSchema = void 0;
exports.PointSchema = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            // Since type can only be 'Point' for now, we declare it as a enum with a single value
            // This is the only way to declare a constant value on a property
            // Reference: https://swagger.io/docs/specification/describing-parameters/#constant
            enum: ['Point'],
        },
        coordinates: {
            type: 'array',
            description: 'Longitude and latitude',
            items: {
                type: 'number',
            },
            example: [15.24012, -10.05412],
        },
    },
};
