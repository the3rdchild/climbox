"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverrideLevelAccess = void 0;
const common_1 = require("@nestjs/common");
const OverrideLevelAccess = (...levels) => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('levels', levels));
};
exports.OverrideLevelAccess = OverrideLevelAccess;
