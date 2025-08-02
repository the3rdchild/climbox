"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Public = void 0;
const common_1 = require("@nestjs/common");
const Public = () => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('isPublic', true));
};
exports.Public = Public;
