"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const site_applications_entity_1 = require("../site-applications/site-applications.entity");
const sites_entity_1 = require("../sites/sites.entity");
const surveys_entity_1 = require("../surveys/surveys.entity");
const latest_data_entity_1 = require("../time-series/latest-data.entity");
const users_entity_1 = require("../users/users.entity");
const monitoring_controller_1 = require("./monitoring.controller");
const monitoring_entity_1 = require("./monitoring.entity");
const monitoring_service_1 = require("./monitoring.service");
let MonitoringModule = class MonitoringModule {
};
MonitoringModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                monitoring_entity_1.Monitoring,
                users_entity_1.User,
                sites_entity_1.Site,
                surveys_entity_1.Survey,
                latest_data_entity_1.LatestData,
                site_applications_entity_1.SiteApplication,
            ]),
        ],
        controllers: [monitoring_controller_1.MonitoringController],
        providers: [monitoring_service_1.MonitoringService],
    })
], MonitoringModule);
exports.MonitoringModule = MonitoringModule;
