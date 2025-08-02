"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveysModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const surveys_controller_1 = require("./surveys.controller");
const surveys_entity_1 = require("./surveys.entity");
const entity_exists_constraint_1 = require("../validations/entity-exists.constraint");
const auth_module_1 = require("../auth/auth.module");
const surveys_service_1 = require("./surveys.service");
const survey_media_entity_1 = require("./survey-media.entity");
const site_survey_points_entity_1 = require("../site-survey-points/site-survey-points.entity");
const google_cloud_module_1 = require("../google-cloud/google-cloud.module");
const google_cloud_service_1 = require("../google-cloud/google-cloud.service");
const sites_entity_1 = require("../sites/sites.entity");
const data_uploads_entity_1 = require("../data-uploads/data-uploads.entity");
let SurveysModule = class SurveysModule {
};
SurveysModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            google_cloud_module_1.GoogleCloudModule,
            // Since we use GoogleCloudModule here the TypeOrmModule list should meet the requirements of GoogleCloudModule
            typeorm_1.TypeOrmModule.forFeature([
                surveys_entity_1.Survey,
                survey_media_entity_1.SurveyMedia,
                site_survey_points_entity_1.SiteSurveyPoint,
                sites_entity_1.Site,
                data_uploads_entity_1.DataUploads,
            ]),
        ],
        controllers: [surveys_controller_1.SurveysController],
        providers: [entity_exists_constraint_1.EntityExists, surveys_service_1.SurveysService, google_cloud_service_1.GoogleCloudService],
    })
], SurveysModule);
exports.SurveysModule = SurveysModule;
