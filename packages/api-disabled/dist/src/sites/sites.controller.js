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
exports.SitesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sites_service_1 = require("./sites.service");
const filter_site_dto_1 = require("./dto/filter-site.dto");
const update_site_dto_1 = require("./dto/update-site.dto");
const users_entity_1 = require("../users/users.entity");
const auth_decorator_1 = require("../auth/auth.decorator");
const public_decorator_1 = require("../auth/public.decorator");
const create_site_dto_1 = require("./dto/create-site.dto");
const is_site_admin_guard_1 = require("../auth/is-site-admin.guard");
const parse_date_pipe_1 = require("../pipes/parse-date.pipe");
const deploy_spotter_dto_1 = require("./dto/deploy-spotter.dto");
const exclude_spotter_dates_dto_1 = require("./dto/exclude-spotter-dates.dto");
const override_level_access_decorator_1 = require("../auth/override-level-access.decorator");
const api_properties_1 = require("../docs/api-properties");
const api_response_1 = require("../docs/api-response");
let SitesController = class SitesController {
    constructor(sitesService) {
        this.sitesService = sitesService;
    }
    create(request, siteApplication, site) {
        return this.sitesService.create(siteApplication, site, request.user);
    }
    find(filterSiteDto) {
        return this.sitesService.find(filterSiteDto);
    }
    findOne(id) {
        return this.sitesService.findOne(id);
    }
    findDailyData(id, start, end) {
        return this.sitesService.findDailyData(id, start, end);
    }
    findSpotterPosition(id) {
        return this.sitesService.findSpotterPosition(id);
    }
    findLatestData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const latestData = yield this.sitesService.findLatestData(id);
            return { latestData };
        });
    }
    getSpotterData(id, startDate, endDate) {
        return this.sitesService.getSpotterData(id, startDate, endDate);
    }
    update(id, updateSiteDto, request) {
        return this.sitesService.update(id, updateSiteDto, request.user);
    }
    delete(id) {
        return this.sitesService.delete(id);
    }
    deploySpotter(id, deploySpotterDto) {
        return this.sitesService.deploySpotter(id, deploySpotterDto);
    }
    addExclusionDates(id, excludeSpotterDatesDto) {
        return this.sitesService.addExclusionDates(id, excludeSpotterDatesDto);
    }
    findExclusionDates(id) {
        return this.sitesService.getExclusionDates(id);
    }
    getContactInformation(id) {
        return this.sitesService.getContactInformation(id);
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_properties_1.ApiCreateSiteBody)(),
    (0, swagger_1.ApiOperation)({ summary: 'Creates a new site and its site application' }),
    (0, override_level_access_decorator_1.OverrideLevelAccess)(),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../site-applications/site-applications.entity").SiteApplication }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('siteApplication')),
    __param(2, (0, common_1.Body)('site')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_site_dto_1.CreateSiteApplicationDto,
        create_site_dto_1.CreateSiteDto]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Returns sites filtered by provided filters' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("./sites.entity").Site] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_site_dto_1.FilterSiteDto]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "find", null);
__decorate([
    (0, api_response_1.ApiNestNotFoundResponse)('No site was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Returns specified site' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./sites.entity").Site }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "findOne", null);
__decorate([
    (0, api_response_1.ApiNestNotFoundResponse)('No site was found with the specified id'),
    (0, api_response_1.ApiNestBadRequestResponse)('Start or end is not a valid date'),
    (0, swagger_1.ApiOperation)({ summary: 'Returns daily data for the specified site' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'start', example: '2021-04-18T08:45:35.780Z' }),
    (0, swagger_1.ApiQuery)({ name: 'end', example: '2021-05-18T08:45:35.780Z' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id/daily_data'),
    openapi.ApiResponse({ status: 200, type: [require("./daily-data.entity").DailyData] }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('start')),
    __param(2, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "findDailyData", null);
__decorate([
    (0, api_response_1.ApiNestNotFoundResponse)('No site was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Returns spotter position for the specified site' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id/spotter_position'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "findSpotterPosition", null);
__decorate([
    (0, api_response_1.ApiNestNotFoundResponse)('No site was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Returns latest data for the specified site' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id/latest_data'),
    openapi.ApiResponse({ status: 200, type: require("./dto/latest-data.dto").SofarLatestDataDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "findLatestData", null);
__decorate([
    (0, api_response_1.ApiNestNotFoundResponse)('No site was found or found site had no spotter'),
    (0, swagger_1.ApiOperation)({ summary: 'Returns spotter data for the specified site' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', example: '2021-04-18T08:45:35.780Z' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', example: '2021-05-18T08:45:35.780Z' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id/spotter_data'),
    openapi.ApiResponse({ status: 200, type: require("./dto/spotter-data.dto").SpotterDataDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('startDate', parse_date_pipe_1.ParseDatePipe)),
    __param(2, (0, common_1.Query)('endDate', parse_date_pipe_1.ParseDatePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "getSpotterData", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No site was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Updates specified site' }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, common_1.UseGuards)(is_site_admin_guard_1.IsSiteAdminGuard),
    (0, common_1.Put)(':siteId'),
    openapi.ApiResponse({ status: 200, type: require("./sites.entity").Site }),
    __param(0, (0, common_1.Param)('siteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_site_dto_1.UpdateSiteDto, Object]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No site was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deletes specified site' }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, common_1.UseGuards)(is_site_admin_guard_1.IsSiteAdminGuard),
    (0, common_1.Delete)(':siteId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('siteId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "delete", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No site was found with the specified id'),
    (0, api_response_1.ApiNestBadRequestResponse)('Site has no spotter or spotter is already deployed'),
    (0, swagger_1.ApiOperation)({ summary: "Deploys site's spotter" }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, common_1.UseGuards)(is_site_admin_guard_1.IsSiteAdminGuard),
    (0, common_1.Post)(':siteId/deploy'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('siteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, deploy_spotter_dto_1.DeploySpotterDto]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "deploySpotter", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No site was found with the specified id'),
    (0, api_response_1.ApiNestBadRequestResponse)('Site has no spotter or start date is larger than end date'),
    (0, swagger_1.ApiOperation)({ summary: "Adds exclusion dates to spotter's data" }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, common_1.UseGuards)(is_site_admin_guard_1.IsSiteAdminGuard),
    (0, common_1.Post)(':siteId/exclusion_dates'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('siteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, exclude_spotter_dates_dto_1.ExcludeSpotterDatesDto]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "addExclusionDates", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "Returns exclusion dates of specified site's spotter",
    }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, common_1.UseGuards)(is_site_admin_guard_1.IsSiteAdminGuard),
    (0, common_1.Get)(':siteId/exclusion_dates'),
    openapi.ApiResponse({ status: 200, type: [require("./exclusion-dates.entity").ExclusionDates] }),
    __param(0, (0, common_1.Param)('siteId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "findExclusionDates", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Returns sites contact information notes',
    }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, auth_decorator_1.Auth)(users_entity_1.AdminLevel.SuperAdmin),
    (0, common_1.Get)(':siteId/contact_info'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('siteId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "getContactInformation", null);
SitesController = __decorate([
    (0, swagger_1.ApiTags)('Sites'),
    (0, auth_decorator_1.Auth)(users_entity_1.AdminLevel.SiteManager, users_entity_1.AdminLevel.SuperAdmin),
    (0, common_1.Controller)('sites'),
    __metadata("design:paramtypes", [sites_service_1.SitesService])
], SitesController);
exports.SitesController = SitesController;
