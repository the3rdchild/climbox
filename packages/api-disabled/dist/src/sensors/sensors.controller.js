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
exports.SensorsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_1 = require("../docs/api-response");
const api_time_series_response_1 = require("../docs/api-time-series-response");
const parse_date_pipe_1 = require("../pipes/parse-date.pipe");
const sensors_service_1 = require("./sensors.service");
let SensorsController = class SensorsController {
    constructor(coralAtlasService) {
        this.coralAtlasService = coralAtlasService;
    }
    findSensors() {
        return this.coralAtlasService.findSensors();
    }
    findSensorData(sensorId, metrics, startDate, endDate) {
        return this.coralAtlasService.findSensorData(sensorId, metrics, startDate, endDate);
    }
    findSensorSurveys(sensorId) {
        return this.coralAtlasService.findSensorSurveys(sensorId);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all sites having sensors' }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SensorsController.prototype, "findSensors", null);
__decorate([
    (0, api_time_series_response_1.ApiTimeSeriesResponse)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No data were found with the specified sensor id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get data from a specified sensor' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'SPOT-0000' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', example: '2021-01-10T12:00:00Z' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', example: '2021-05-10T12:00:00Z' }),
    (0, swagger_1.ApiQuery)({
        name: 'metrics',
        example: ['bottom_temperature', 'top_temperature'],
    }),
    (0, common_1.Get)(':id/data'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('metrics', common_1.ParseArrayPipe)),
    __param(2, (0, common_1.Query)('startDate', parse_date_pipe_1.ParseDatePipe)),
    __param(3, (0, common_1.Query)('endDate', parse_date_pipe_1.ParseDatePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, String, String]),
    __metadata("design:returntype", void 0)
], SensorsController.prototype, "findSensorData", null);
__decorate([
    (0, api_response_1.ApiNestNotFoundResponse)('No surveys were found with the specified sensor id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get surveys and survey media from a specified sensor',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'SPOT-0000' }),
    (0, common_1.Get)(':id/surveys'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SensorsController.prototype, "findSensorSurveys", null);
SensorsController = __decorate([
    (0, swagger_1.ApiTags)('Sensors'),
    (0, common_1.Controller)('sensors'),
    __metadata("design:paramtypes", [sensors_service_1.SensorsService])
], SensorsController);
exports.SensorsController = SensorsController;
