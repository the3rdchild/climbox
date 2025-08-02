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
exports.SensorDataController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/auth.decorator");
const users_entity_1 = require("../users/users.entity");
const sensor_data_service_1 = require("./sensor-data.service");
let SensorDataController = class SensorDataController {
    constructor(sensorDataService) {
        this.sensorDataService = sensorDataService;
    }
    findSensors(id, start, end) {
        return this.sensorDataService.get(id, start, end);
    }
    sensorInfo(request, siteId, sensorId) {
        return this.sensorDataService.getSensorInfo(siteId, sensorId, request.user);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get sofar data by sensorId' }),
    (0, swagger_1.ApiQuery)({ name: 'id', example: 'SPOT-0000' }),
    (0, swagger_1.ApiQuery)({ name: 'start', example: '2022-05-27' }),
    (0, swagger_1.ApiQuery)({ name: 'end', example: '2022-05-28' }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Query)('start')),
    __param(2, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], SensorDataController.prototype, "findSensors", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, auth_decorator_1.Auth)(users_entity_1.AdminLevel.SiteManager, users_entity_1.AdminLevel.SuperAdmin),
    (0, swagger_1.ApiOperation)({ summary: 'Get sensor status information' }),
    (0, swagger_1.ApiQuery)({ name: 'siteId', example: '1063' }),
    (0, swagger_1.ApiQuery)({ name: 'sensorId', example: 'SPOT-0000' }),
    (0, common_1.Get)('info'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('siteId')),
    __param(2, (0, common_1.Query)('sensorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", void 0)
], SensorDataController.prototype, "sensorInfo", null);
SensorDataController = __decorate([
    (0, common_1.Controller)('sensor-data'),
    __metadata("design:paramtypes", [sensor_data_service_1.SensorDataService])
], SensorDataController);
exports.SensorDataController = SensorDataController;
