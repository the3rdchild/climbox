"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindWaveModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entity_exists_constraint_1 = require("../validations/entity-exists.constraint");
const wind_wave_data_controller_1 = require("./wind-wave-data.controller");
const forecast_data_entity_1 = require("./forecast-data.entity");
const wind_wave_data_service_1 = require("./wind-wave-data.service");
let WindWaveModule = class WindWaveModule {
};
WindWaveModule = __decorate([
    (0, common_1.Module)({
        controllers: [wind_wave_data_controller_1.WindWaveController],
        providers: [wind_wave_data_service_1.WindWaveService, entity_exists_constraint_1.EntityExists],
        imports: [typeorm_1.TypeOrmModule.forFeature([forecast_data_entity_1.ForecastData])],
    })
], WindWaveModule);
exports.WindWaveModule = WindWaveModule;
