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
exports.TimeSeriesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const site_data_dto_1 = require("./dto/site-data.dto");
const survey_point_data_dto_1 = require("./dto/survey-point-data.dto");
const time_series_service_1 = require("./time-series.service");
const survey_point_data_range_dto_1 = require("./dto/survey-point-data-range.dto");
const site_data_range_dto_1 = require("./dto/site-data-range.dto");
const api_time_series_response_1 = require("../docs/api-time-series-response");
const parse_date_pipe_1 = require("../pipes/parse-date.pipe");
const is_site_admin_guard_1 = require("../auth/is-site-admin.guard");
const users_entity_1 = require("../users/users.entity");
const auth_decorator_1 = require("../auth/auth.decorator");
const source_type_enum_1 = require("../sites/schemas/source-type.enum");
const upload_sheet_data_1 = require("../utils/uploads/upload-sheet-data");
const sample_upload_files_dto_1 = require("./dto/sample-upload-files.dto");
const metrics_enum_1 = require("./metrics.enum");
const parse_metric_array_pipe_1 = require("../pipes/parse-metric-array.pipe");
const upload_time_series_data_dto_1 = require("./dto/upload-time-series-data.dto");
const MAX_FILE_COUNT = 10;
const MAX_FILE_SIZE_MB = 10;
let TimeSeriesController = class TimeSeriesController {
    constructor(timeSeriesService) {
        this.timeSeriesService = timeSeriesService;
    }
    findSurveyPointData(surveyPointDataDto, metrics, startDate, endDate, hourly) {
        return this.timeSeriesService.findSurveyPointData(surveyPointDataDto, metrics, startDate, endDate, hourly);
    }
    findSiteData(siteDataDto, metrics, startDate, endDate, hourly) {
        return this.timeSeriesService.findSiteData(siteDataDto, metrics, startDate, endDate, hourly);
    }
    findSurveyPointDataRange(surveyPointDataRangeDto) {
        return this.timeSeriesService.findSurveyPointDataRange(surveyPointDataRangeDto);
    }
    findSiteDataRange(siteDataRangeDto) {
        return this.timeSeriesService.findSiteDataRange(siteDataRangeDto);
    }
    uploadSiteTimeSeriesData(surveyPointDataRangeDto, files, sensor, failOnWarning, siteTimezone) {
        return this.timeSeriesService.uploadData({
            sensor: sensor || source_type_enum_1.SourceType.SHEET_DATA,
            files,
            multiSiteUpload: false,
            surveyPointDataRangeDto,
            failOnWarning,
            siteTimezone,
        });
    }
    uploadTimeSeriesData(req, files, uploadTimeSeriesDataDto) {
        return this.timeSeriesService.uploadData({
            user: req.user,
            sensor: uploadTimeSeriesDataDto.sensor,
            files,
            multiSiteUpload: true,
            failOnWarning: uploadTimeSeriesDataDto.failOnWarning,
            siteTimezone: uploadTimeSeriesDataDto.siteTimezone,
        });
    }
    getSampleUploadFiles(surveyPointDataRangeDto, res) {
        const file = this.timeSeriesService.getSampleUploadFiles(surveyPointDataRangeDto);
        const filename = `${surveyPointDataRangeDto.source}_example.csv`;
        res.set({
            'Content-Disposition': `attachment; filename=${encodeURIComponent(filename)}`,
        });
        return file.pipe(res);
    }
    findSiteDataCsv(res, siteDataDto, metrics, startDate, endDate, hourly) {
        if (startDate && endDate && startDate > endDate) {
            throw new common_1.BadRequestException(`Invalid Dates: start date can't be after end date`);
        }
        return this.timeSeriesService.findSiteDataCsv(res, siteDataDto, metrics, startDate, endDate, hourly);
    }
};
__decorate([
    (0, api_time_series_response_1.ApiTimeSeriesResponse)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Returns specified time series data for a specified site point of interest',
    }),
    (0, swagger_1.ApiQuery)({ name: 'start', example: '2021-05-18T10:20:28.017Z' }),
    (0, swagger_1.ApiQuery)({ name: 'end', example: '2021-05-18T10:20:28.017Z' }),
    (0, swagger_1.ApiQuery)({
        name: 'metrics',
        example: [metrics_enum_1.Metric.BOTTOM_TEMPERATURE, metrics_enum_1.Metric.TOP_TEMPERATURE],
    }),
    (0, swagger_1.ApiQuery)({ name: 'hourly', example: false, required: false }),
    (0, common_1.Get)('sites/:siteId/site-survey-points/:surveyPointId'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)('metrics', new parse_metric_array_pipe_1.MetricArrayPipe({
        predefinedSet: Object.values(metrics_enum_1.Metric),
        defaultArray: Object.values(metrics_enum_1.Metric),
    }))),
    __param(2, (0, common_1.Query)('start', parse_date_pipe_1.ParseDatePipe)),
    __param(3, (0, common_1.Query)('end', parse_date_pipe_1.ParseDatePipe)),
    __param(4, (0, common_1.Query)('hourly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [survey_point_data_dto_1.SurveyPointDataDto, Array, String, String, Boolean]),
    __metadata("design:returntype", void 0)
], TimeSeriesController.prototype, "findSurveyPointData", null);
__decorate([
    (0, api_time_series_response_1.ApiTimeSeriesResponse)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Returns specified time series data for a specified site',
    }),
    (0, swagger_1.ApiQuery)({ name: 'start', example: '2021-05-18T10:20:28.017Z' }),
    (0, swagger_1.ApiQuery)({ name: 'end', example: '2021-05-18T10:20:28.017Z' }),
    (0, swagger_1.ApiQuery)({
        name: 'metrics',
        example: [metrics_enum_1.Metric.BOTTOM_TEMPERATURE, metrics_enum_1.Metric.TOP_TEMPERATURE],
    }),
    (0, swagger_1.ApiQuery)({ name: 'hourly', example: false, required: false }),
    (0, common_1.Get)('sites/:siteId'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)('metrics', new parse_metric_array_pipe_1.MetricArrayPipe({
        predefinedSet: Object.values(metrics_enum_1.Metric),
        defaultArray: Object.values(metrics_enum_1.Metric),
    }))),
    __param(2, (0, common_1.Query)('start', parse_date_pipe_1.ParseDatePipe)),
    __param(3, (0, common_1.Query)('end', parse_date_pipe_1.ParseDatePipe)),
    __param(4, (0, common_1.Query)('hourly', common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [site_data_dto_1.SiteDataDto, Array, String, String, Boolean]),
    __metadata("design:returntype", void 0)
], TimeSeriesController.prototype, "findSiteData", null);
__decorate([
    (0, api_time_series_response_1.ApiTimeSeriesRangeResponse)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Returns the range of the available time series data for a specified site point of interest',
    }),
    (0, common_1.Get)('sites/:siteId/site-survey-points/:surveyPointId/range'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [survey_point_data_range_dto_1.SurveyPointDataRangeDto]),
    __metadata("design:returntype", void 0)
], TimeSeriesController.prototype, "findSurveyPointDataRange", null);
__decorate([
    (0, api_time_series_response_1.ApiTimeSeriesRangeResponse)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Returns the range of the available time series data for a specified site',
    }),
    (0, common_1.Get)('sites/:siteId/range'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [site_data_range_dto_1.SiteDataRangeDto]),
    __metadata("design:returntype", void 0)
], TimeSeriesController.prototype, "findSiteDataRange", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Upload time series data' }),
    (0, common_1.UseGuards)(is_site_admin_guard_1.IsSiteAdminGuard),
    (0, auth_decorator_1.Auth)(users_entity_1.AdminLevel.SiteManager, users_entity_1.AdminLevel.SuperAdmin),
    (0, common_1.Post)('sites/:siteId/site-survey-points/:surveyPointId/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', MAX_FILE_COUNT, {
        dest: './upload',
        fileFilter: upload_sheet_data_1.fileFilter,
        limits: {
            fileSize: MAX_FILE_SIZE_MB * Math.pow(2, 20),
        },
    })),
    openapi.ApiResponse({ status: 201, type: [Object] }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)('sensor')),
    __param(3, (0, common_1.Query)('failOnWarning', common_1.ParseBoolPipe)),
    __param(4, (0, common_1.Query)('siteTimezone', common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [survey_point_data_range_dto_1.SurveyPointDataRangeDto, Array, String, Boolean, Boolean]),
    __metadata("design:returntype", void 0)
], TimeSeriesController.prototype, "uploadSiteTimeSeriesData", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Upload time series data' }),
    (0, auth_decorator_1.Auth)(users_entity_1.AdminLevel.SiteManager, users_entity_1.AdminLevel.SuperAdmin),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', MAX_FILE_COUNT, {
        dest: './upload',
        fileFilter: upload_sheet_data_1.fileFilter,
        limits: {
            fileSize: MAX_FILE_SIZE_MB * Math.pow(2, 20),
        },
    })),
    openapi.ApiResponse({ status: 201, type: [Object] }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, upload_time_series_data_dto_1.UploadTimeSeriesDataDto]),
    __metadata("design:returntype", void 0)
], TimeSeriesController.prototype, "uploadTimeSeriesData", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get sample upload files' }),
    (0, common_1.Get)('sample-upload-files/:source'),
    (0, common_1.Header)('Content-Type', 'text/csv'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sample_upload_files_dto_1.SampleUploadFilesDto, Object]),
    __metadata("design:returntype", void 0)
], TimeSeriesController.prototype, "getSampleUploadFiles", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Returns specified time series data for a specified site as csv',
    }),
    (0, swagger_1.ApiQuery)({ name: 'start', example: '2021-05-18T10:20:28.017Z' }),
    (0, swagger_1.ApiQuery)({ name: 'end', example: '2021-05-18T10:20:28.017Z' }),
    (0, swagger_1.ApiQuery)({
        name: 'metrics',
        example: [metrics_enum_1.Metric.BOTTOM_TEMPERATURE, metrics_enum_1.Metric.TOP_TEMPERATURE],
    }),
    (0, swagger_1.ApiQuery)({ name: 'hourly', example: false, required: false }),
    (0, common_1.Header)('Content-Type', 'text/csv'),
    (0, common_1.Get)('sites/:siteId/csv'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Query)('metrics', new parse_metric_array_pipe_1.MetricArrayPipe({
        predefinedSet: Object.values(metrics_enum_1.Metric),
        defaultArray: Object.values(metrics_enum_1.Metric),
    }))),
    __param(3, (0, common_1.Query)('start', parse_date_pipe_1.ParseDatePipe)),
    __param(4, (0, common_1.Query)('end', parse_date_pipe_1.ParseDatePipe)),
    __param(5, (0, common_1.Query)('hourly', common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, site_data_dto_1.SiteDataDto, Array, String, String, Boolean]),
    __metadata("design:returntype", void 0)
], TimeSeriesController.prototype, "findSiteDataCsv", null);
TimeSeriesController = __decorate([
    (0, swagger_1.ApiTags)('Time Series'),
    (0, common_1.Controller)('time-series'),
    __metadata("design:paramtypes", [time_series_service_1.TimeSeriesService])
], TimeSeriesController);
exports.TimeSeriesController = TimeSeriesController;
