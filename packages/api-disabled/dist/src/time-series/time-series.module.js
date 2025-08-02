"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSeriesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const monitoring_entity_1 = require("../monitoring/monitoring.entity");
const data_uploads_sites_entity_1 = require("../data-uploads/data-uploads-sites.entity");
const data_uploads_entity_1 = require("../data-uploads/data-uploads.entity");
const site_survey_points_entity_1 = require("../site-survey-points/site-survey-points.entity");
const sites_entity_1 = require("../sites/sites.entity");
const sources_entity_1 = require("../sites/sources.entity");
const entity_exists_constraint_1 = require("../validations/entity-exists.constraint");
const time_series_controller_1 = require("./time-series.controller");
const time_series_entity_1 = require("./time-series.entity");
const time_series_service_1 = require("./time-series.service");
let TimeSeriesModule = class TimeSeriesModule {
};
TimeSeriesModule = __decorate([
    (0, common_1.Module)({
        controllers: [time_series_controller_1.TimeSeriesController],
        providers: [time_series_service_1.TimeSeriesService, entity_exists_constraint_1.EntityExists],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                time_series_entity_1.TimeSeries,
                sites_entity_1.Site,
                site_survey_points_entity_1.SiteSurveyPoint,
                sources_entity_1.Sources,
                data_uploads_entity_1.DataUploads,
                data_uploads_sites_entity_1.DataUploadsSites,
                monitoring_entity_1.Monitoring,
            ]),
        ],
    })
], TimeSeriesModule);
exports.TimeSeriesModule = TimeSeriesModule;
