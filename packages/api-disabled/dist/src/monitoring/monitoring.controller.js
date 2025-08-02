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
exports.MonitoringController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/auth.decorator");
const users_entity_1 = require("../users/users.entity");
const get_monitoring_stats_dto_1 = require("./dto/get-monitoring-stats.dto");
const get_sites_overview_dto_1 = require("./dto/get-sites-overview.dto");
const post_monitoring_metric_dto_1 = require("./dto/post-monitoring-metric.dto");
const monitoring_service_1 = require("./monitoring.service");
const get_monitoring_last_month_dto_1 = require("./dto/get-monitoring-last-month.dto");
let MonitoringController = class MonitoringController {
    constructor(monitoringService) {
        this.monitoringService = monitoringService;
    }
    postMonitoringMetric(postMonitoringMetricDto, req) {
        return this.monitoringService.postMonitoringMetric(postMonitoringMetricDto, req.user);
    }
    getMonitoringStats(getMonitoringStatsDto, req, res) {
        return this.monitoringService.getMonitoringStats(getMonitoringStatsDto, req.user, res);
    }
    getMonitoringLastMonth(getMonitoringLastMonthDto, res) {
        return this.monitoringService.getMonitoringLastMonth(getMonitoringLastMonthDto, res);
    }
    getSurveysReport() {
        return this.monitoringService.surveysReport();
    }
    getSitesOverview(getSitesOverviewDto) {
        return this.monitoringService.SitesOverview(getSitesOverviewDto);
    }
    getSitesStatus() {
        return this.monitoringService.getSitesStatus();
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Post a usage metric' }),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [post_monitoring_metric_dto_1.PostMonitoringMetricDto, Object]),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "postMonitoringMetric", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get usage metrics' }),
    (0, auth_decorator_1.Auth)(users_entity_1.AdminLevel.SuperAdmin, users_entity_1.AdminLevel.SiteManager),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_monitoring_stats_dto_1.GetMonitoringStatsDto, Object, Object]),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "getMonitoringStats", null);
__decorate([
    (0, common_1.Get)('last-month'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get monitoring metrics for last month for each site with a spotter',
    }),
    (0, auth_decorator_1.Auth)(users_entity_1.AdminLevel.SuperAdmin),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_monitoring_last_month_dto_1.GetMonitoringLastMonthDto, Object]),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "getMonitoringLastMonth", null);
__decorate([
    (0, common_1.Get)('surveys-report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get surveys report' }),
    (0, auth_decorator_1.Auth)(users_entity_1.AdminLevel.SuperAdmin),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "getSurveysReport", null);
__decorate([
    (0, common_1.Get)('sites-overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Aqualink overview' }),
    (0, auth_decorator_1.Auth)(users_entity_1.AdminLevel.SuperAdmin),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_sites_overview_dto_1.GetSitesOverviewDto]),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "getSitesOverview", null);
__decorate([
    (0, common_1.Get)('sites-status'),
    (0, swagger_1.ApiOperation)({ summary: "Get sites' status" }),
    (0, auth_decorator_1.Auth)(users_entity_1.AdminLevel.SuperAdmin),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "getSitesStatus", null);
MonitoringController = __decorate([
    (0, swagger_1.ApiTags)('Monitoring'),
    (0, common_1.Controller)('monitoring'),
    __metadata("design:paramtypes", [monitoring_service_1.MonitoringService])
], MonitoringController);
exports.MonitoringController = MonitoringController;
