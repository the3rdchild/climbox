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
exports.GoogleCloudController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/auth.decorator");
const users_entity_1 = require("../users/users.entity");
const google_cloud_service_1 = require("./google-cloud.service");
let GoogleCloudController = class GoogleCloudController {
    constructor(googleCloudService) {
        this.googleCloudService = googleCloudService;
    }
    findDanglingFiles() {
        return this.googleCloudService.findDanglingFiles();
    }
    DeleteDanglingFiles() {
        return this.googleCloudService.deleteDanglingFiles();
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOkResponse)({
        description: 'An array of all dangling files',
        schema: {
            type: 'array',
            items: {
                type: 'string',
                example: 'https://storage.googleapis.com/storage/reef-image-a5b5f5c5d5da5d5e.jpg',
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Returns all files stored that are not used' }),
    (0, common_1.Get)('dangling'),
    openapi.ApiResponse({ status: 200, type: [String] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GoogleCloudController.prototype, "findDanglingFiles", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Deletes all unused files stored' }),
    (0, common_1.Delete)('dangling'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GoogleCloudController.prototype, "DeleteDanglingFiles", null);
GoogleCloudController = __decorate([
    (0, swagger_1.ApiTags)('Google Cloud Storage'),
    (0, auth_decorator_1.Auth)(users_entity_1.AdminLevel.SuperAdmin),
    (0, common_1.Controller)('google-cloud'),
    __metadata("design:paramtypes", [google_cloud_service_1.GoogleCloudService])
], GoogleCloudController);
exports.GoogleCloudController = GoogleCloudController;
