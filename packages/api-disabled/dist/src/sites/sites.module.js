"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const site_sketchfab_entity_1 = require("../site-sketchfab/site-sketchfab.entity");
const reef_check_surveys_entity_1 = require("../reef-check-surveys/reef-check-surveys.entity");
const sites_controller_1 = require("./sites.controller");
const sites_service_1 = require("./sites.service");
const sites_entity_1 = require("./sites.entity");
const daily_data_entity_1 = require("./daily-data.entity");
const entity_exists_constraint_1 = require("../validations/entity-exists.constraint");
const auth_module_1 = require("../auth/auth.module");
const regions_entity_1 = require("../regions/regions.entity");
const exclusion_dates_entity_1 = require("./exclusion-dates.entity");
const site_applications_entity_1 = require("../site-applications/site-applications.entity");
const users_entity_1 = require("../users/users.entity");
const sources_entity_1 = require("./sources.entity");
const historical_monthly_mean_entity_1 = require("./historical-monthly-mean.entity");
const latest_data_entity_1 = require("../time-series/latest-data.entity");
const time_series_entity_1 = require("../time-series/time-series.entity");
const scheduled_updates_entity_1 = require("./scheduled-updates.entity");
let SitesModule = class SitesModule {
};
SitesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            typeorm_1.TypeOrmModule.forFeature([
                sites_entity_1.Site,
                site_applications_entity_1.SiteApplication,
                daily_data_entity_1.DailyData,
                regions_entity_1.Region,
                exclusion_dates_entity_1.ExclusionDates,
                historical_monthly_mean_entity_1.HistoricalMonthlyMean,
                users_entity_1.User,
                sources_entity_1.Sources,
                latest_data_entity_1.LatestData,
                time_series_entity_1.TimeSeries,
                scheduled_updates_entity_1.ScheduledUpdate,
                site_sketchfab_entity_1.SketchFab,
                reef_check_surveys_entity_1.ReefCheckSurvey,
            ]),
        ],
        controllers: [sites_controller_1.SitesController],
        providers: [sites_service_1.SitesService, entity_exists_constraint_1.EntityExists],
    })
], SitesModule);
exports.SitesModule = SitesModule;
