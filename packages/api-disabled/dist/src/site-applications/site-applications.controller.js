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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteApplicationsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const site_applications_service_1 = require("./site-applications.service");
const update_site_application_dto_1 = require("./dto/update-site-application.dto");
const auth_decorator_1 = require("../auth/auth.decorator");
const is_site_admin_guard_1 = require("../auth/is-site-admin.guard");
const parse_hashed_id_pipe_1 = require("../pipes/parse-hashed-id.pipe");
const override_level_access_decorator_1 = require("../auth/override-level-access.decorator");
const users_entity_1 = require("../users/users.entity");
const api_response_1 = require("../docs/api-response");
const api_properties_1 = require("../docs/api-properties");
let SiteApplicationsController = class SiteApplicationsController {
    constructor(siteApplicationsService) {
        this.siteApplicationsService = siteApplicationsService;
    }
    findOneFromSite(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.siteApplicationsService.findOneFromSite(siteId);
        });
    }
    update(id, siteApplication) {
        return this.siteApplicationsService.update(id, siteApplication);
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No site application for specified site was found'),
    (0, swagger_1.ApiOperation)({ summary: 'Returns site application of specified site' }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, override_level_access_decorator_1.OverrideLevelAccess)(users_entity_1.AdminLevel.SuperAdmin, users_entity_1.AdminLevel.SiteManager),
    (0, common_1.UseGuards)(is_site_admin_guard_1.IsSiteAdminGuard),
    (0, common_1.Get)('/sites/:siteId'),
    openapi.ApiResponse({ status: 200, type: require("./site-applications.entity").SiteApplication }),
    __param(0, (0, common_1.Param)('siteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SiteApplicationsController.prototype, "findOneFromSite", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_properties_1.ApiUpdateSiteApplicationBody)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Updates site application by providing its appId. Needs authentication.',
    }),
    (0, swagger_1.ApiParam)({ name: 'appId', example: 1 }),
    (0, common_1.UseGuards)(is_site_admin_guard_1.IsSiteAdminGuard),
    (0, common_1.Put)(':appId/sites/:siteId'),
    openapi.ApiResponse({ status: 200, type: require("./site-applications.entity").SiteApplication }),
    __param(0, (0, common_1.Param)('appId', new parse_hashed_id_pipe_1.ParseHashedIdPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_site_application_dto_1.UpdateSiteApplicationDto]),
    __metadata("design:returntype", void 0)
], SiteApplicationsController.prototype, "update", null);
SiteApplicationsController = __decorate([
    (0, swagger_1.ApiTags)('SiteApplications'),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.Controller)('site-applications'),
    (0, common_1.SerializeOptions)({
        excludePrefixes: ['id', 'createdAt', 'updatedAt', 'adminLevel'],
    }),
    __metadata("design:paramtypes", [site_applications_service_1.SiteApplicationsService])
], SiteApplicationsController);
exports.SiteApplicationsController = SiteApplicationsController;
