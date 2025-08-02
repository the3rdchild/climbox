"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorSchema = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
class ErrorResponse {
    static _OPENAPI_METADATA_FACTORY() {
        return { statusCode: { required: true, type: () => Number }, message: { required: true, type: () => String }, error: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 400 }),
    __metadata("design:type", Number)
], ErrorResponse.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Validation failed' }),
    __metadata("design:type", String)
], ErrorResponse.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bad Request' }),
    __metadata("design:type", String)
], ErrorResponse.prototype, "error", void 0);
const errorTemplates = {
    [common_1.HttpStatus.BAD_REQUEST]: {
        statusCode: common_1.HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        error: 'Bad Request',
    },
    [common_1.HttpStatus.UNAUTHORIZED]: {
        statusCode: common_1.HttpStatus.UNAUTHORIZED,
        message: 'Not authorized',
        error: 'Unauthorized',
    },
    [common_1.HttpStatus.NOT_FOUND]: {
        statusCode: common_1.HttpStatus.NOT_FOUND,
        message: 'Resource not found',
        error: 'Not Found',
    },
};
const errorSchema = (errorCode) => {
    const errorResponse = errorTemplates[errorCode];
    return {
        type: 'object',
        properties: {
            statusCode: {
                type: 'number',
                example: errorResponse.statusCode,
            },
            message: {
                type: 'string',
                example: errorResponse.message,
            },
            error: {
                type: 'string',
                example: errorResponse.error,
            },
        },
    };
};
exports.errorSchema = errorSchema;
