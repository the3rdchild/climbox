"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const monitoring_module_1 = require("./monitoring/monitoring.module");
const reef_check_sites_module_1 = require("./reef-check-sites/reef-check-sites.module");
const reef_check_surveys_module_1 = require("./reef-check-surveys/reef-check-surveys.module");
const config_service_1 = require("./config/config.service");
const site_applications_module_1 = require("./site-applications/site-applications.module");
const sites_module_1 = require("./sites/sites.module");
const site_survey_points_module_1 = require("./site-survey-points/site-survey-points.module");
const regions_module_1 = require("./regions/regions.module");
const surveys_module_1 = require("./surveys/surveys.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const google_cloud_module_1 = require("./google-cloud/google-cloud.module");
const tasks_module_1 = require("./tasks/tasks.module");
const health_check_module_1 = require("./health-check/health-check.module");
const time_series_module_1 = require("./time-series/time-series.module");
const collections_module_1 = require("./collections/collections.module");
const sensors_module_1 = require("./sensors/sensors.module");
const app_controller_1 = require("./app.controller");
const audit_module_1 = require("./audit/audit.module");
const data_uploads_module_1 = require("./data-uploads/data-uploads.module");
const site_sketchfab_module_1 = require("./site-sketchfab/site-sketchfab.module");
const wind_wave_data_module_1 = require("./wind-wave-data/wind-wave-data.module");
const sensor_data_module_1 = require("./sensor-data/sensor-data.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            site_applications_module_1.SiteApplicationsModule,
            sites_module_1.SitesModule,
            site_survey_points_module_1.SiteSurveyPointsModule,
            regions_module_1.RegionsModule,
            surveys_module_1.SurveysModule,
            typeorm_1.TypeOrmModule.forRoot(config_service_1.configService.getTypeOrmConfig()),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            google_cloud_module_1.GoogleCloudModule,
            schedule_1.ScheduleModule.forRoot(),
            tasks_module_1.TasksModule,
            health_check_module_1.HealthCheckModule,
            time_series_module_1.TimeSeriesModule,
            collections_module_1.CollectionsModule,
            sensors_module_1.SensorsModule,
            audit_module_1.AuditModule,
            data_uploads_module_1.DataUploadsModule,
            site_sketchfab_module_1.SiteSketchFabModule,
            wind_wave_data_module_1.WindWaveModule,
            sensor_data_module_1.SensorDataModule,
            monitoring_module_1.MonitoringModule,
            reef_check_sites_module_1.ReefCheckSitesModule,
            reef_check_surveys_module_1.ReefCheckSurveysModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
exports.AppModule = AppModule;
