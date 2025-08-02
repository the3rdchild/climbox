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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataUploadsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/auth.decorator");
const is_site_admin_guard_1 = require("../auth/is-site-admin.guard");
const site_data_range_dto_1 = require("../time-series/dto/site-data-range.dto");
const users_entity_1 = require("../users/users.entity");
const data_uploads_service_1 = require("./data-uploads.service");
const data_uploads_delete_dto_1 = require("./dto/data-uploads-delete.dto");
let DataUploadsController = class DataUploadsController {
    constructor(dataUploadsService) {
        this.dataUploadsService = dataUploadsService;
    }
    getDataUploads(params) {
        return this.dataUploadsService.getDataUploads(params);
    }
    DeleteDataUploads(dataUploadsDeleteDto) {
        return this.dataUploadsService.deleteDataUploads(dataUploadsDeleteDto);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Find all data uploads for a site's survey point" }),
    (0, common_1.Get)('sites/:siteId'),
    openapi.ApiResponse({ status: 200, type: [require("./data-uploads-sites.entity").DataUploadsSites] }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [site_data_range_dto_1.SiteDataRangeDto]),
    __metadata("design:returntype", void 0)
], DataUploadsController.prototype, "getDataUploads", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete selected data uploads' }),
    (0, common_1.UseGuards)(is_site_admin_guard_1.IsSiteAdminGuard),
    (0, auth_decorator_1.Auth)(users_entity_1.AdminLevel.SiteManager, users_entity_1.AdminLevel.SuperAdmin),
    (0, common_1.Post)('sites/:siteId/delete-uploads'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [data_uploads_delete_dto_1.DataUploadsDeleteDto]),
    __metadata("design:returntype", void 0)
], DataUploadsController.prototype, "DeleteDataUploads", null);
DataUploadsController = __decorate([
    (0, swagger_1.ApiTags)('Data Uploads'),
    (0, common_1.Controller)('data-uploads'),
    __metadata("design:paramtypes", [data_uploads_service_1.DataUploadsService])
], DataUploadsController);
exports.DataUploadsController = DataUploadsController;
