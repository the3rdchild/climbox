"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UnauthorizedExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let UnauthorizedExceptionFilter = UnauthorizedExceptionFilter_1 = class UnauthorizedExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(UnauthorizedExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        this.logger.error(`An error has occurred: ${exception.message}`, exception.stack);
        response.status(status).json({
            statusCode: status,
            message: 'You are not allowed to execute this operation.',
        });
    }
};
UnauthorizedExceptionFilter = UnauthorizedExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.UnauthorizedException)
], UnauthorizedExceptionFilter);
exports.UnauthorizedExceptionFilter = UnauthorizedExceptionFilter;
