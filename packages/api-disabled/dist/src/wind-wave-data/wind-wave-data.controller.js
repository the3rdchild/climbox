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
exports.WindWaveController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_wind_wave_data_dto_1 = require("./dto/get-wind-wave-data.dto");
const wind_wave_data_service_1 = require("./wind-wave-data.service");
let WindWaveController = class WindWaveController {
    constructor(windWaveService) {
        this.windWaveService = windWaveService;
    }
    getWindWaveData(getWindWaveData) {
        return this.windWaveService.getWindWaveDate(getWindWaveData.siteId);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Return hindcast wind and wave date for a specified site',
    }),
    (0, common_1.Get)('sites/:siteId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_wind_wave_data_dto_1.GetWindWaveDataDTO]),
    __metadata("design:returntype", void 0)
], WindWaveController.prototype, "getWindWaveData", null);
WindWaveController = __decorate([
    (0, swagger_1.ApiTags)('Wind Wave Data'),
    (0, common_1.Controller)('wind-wave-data-hindcast'),
    __metadata("design:paramtypes", [wind_wave_data_service_1.WindWaveService])
], WindWaveController);
exports.WindWaveController = WindWaveController;
