"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const common_1 = require("@nestjs/common");
const firebase_auth_guard_1 = require("./firebase-auth.guard");
const levels_guard_1 = require("./levels.guard");
const Auth = (...levels) => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('levels', levels), (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, levels_guard_1.LevelsGuard));
};
exports.Auth = Auth;
