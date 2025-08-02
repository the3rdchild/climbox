"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const daily_data_entity_1 = require("../sites/daily-data.entity");
const sites_entity_1 = require("../sites/sites.entity");
const sources_entity_1 = require("../sites/sources.entity");
const surveys_entity_1 = require("../surveys/surveys.entity");
const time_series_entity_1 = require("../time-series/time-series.entity");
const sensors_controller_1 = require("./sensors.controller");
const sensors_service_1 = require("./sensors.service");
let SensorsModule = class SensorsModule {
};
SensorsModule = __decorate([
    (0, common_1.Module)({
        controllers: [sensors_controller_1.SensorsController],
        providers: [sensors_service_1.SensorsService],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([daily_data_entity_1.DailyData, sites_entity_1.Site, sources_entity_1.Sources, surveys_entity_1.Survey, time_series_entity_1.TimeSeries]),
        ],
    })
], SensorsModule);
exports.SensorsModule = SensorsModule;
