"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiNestUnauthorizedResponse = exports.ApiNestBadRequestResponse = exports.ApiNestNotFoundResponse = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const error_dto_1 = require("./error.dto");
const ApiNestNotFoundResponse = (description) => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiNotFoundResponse)({
        schema: (0, error_dto_1.errorSchema)(common_1.HttpStatus.NOT_FOUND),
        description,
    }));
};
exports.ApiNestNotFoundResponse = ApiNestNotFoundResponse;
const ApiNestBadRequestResponse = (description) => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBadRequestResponse)({
        schema: (0, error_dto_1.errorSchema)(common_1.HttpStatus.BAD_REQUEST),
        description,
    }));
};
exports.ApiNestBadRequestResponse = ApiNestBadRequestResponse;
const ApiNestUnauthorizedResponse = (description) => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiUnauthorizedResponse)({
        schema: (0, error_dto_1.errorSchema)(common_1.HttpStatus.UNAUTHORIZED),
        description,
    }));
};
exports.ApiNestUnauthorizedResponse = ApiNestUnauthorizedResponse;
