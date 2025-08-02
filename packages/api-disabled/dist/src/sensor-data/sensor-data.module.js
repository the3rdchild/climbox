"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorDataModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sites_entity_1 = require("../sites/sites.entity");
const sensor_data_controller_1 = require("./sensor-data.controller");
const sensor_data_service_1 = require("./sensor-data.service");
let SensorDataModule = class SensorDataModule {
};
SensorDataModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([sites_entity_1.Site])],
        controllers: [sensor_data_controller_1.SensorDataController],
        providers: [sensor_data_service_1.SensorDataService],
    })
], SensorDataModule);
exports.SensorDataModule = SensorDataModule;
