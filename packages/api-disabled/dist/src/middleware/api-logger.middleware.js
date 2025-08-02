"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiLoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const apiLoggerMiddleware = (req, res, next) => {
    const logger = new common_1.Logger('ApiLogger');
    const start = new Date().getTime();
    res.on('close', () => {
        const end = new Date().getTime();
        logger.warn(`${req.method} ${req.url} - ${res.statusCode} ${end - start}ms`);
    });
    next();
};
exports.apiLoggerMiddleware = apiLoggerMiddleware;
