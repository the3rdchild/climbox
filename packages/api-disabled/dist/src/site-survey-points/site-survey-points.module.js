"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSurveyPointsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const site_survey_points_controller_1 = require("./site-survey-points.controller");
const site_survey_points_service_1 = require("./site-survey-points.service");
const site_survey_points_entity_1 = require("./site-survey-points.entity");
const entity_exists_constraint_1 = require("../validations/entity-exists.constraint");
const auth_module_1 = require("../auth/auth.module");
let SiteSurveyPointsModule = class SiteSurveyPointsModule {
};
SiteSurveyPointsModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, typeorm_1.TypeOrmModule.forFeature([site_survey_points_entity_1.SiteSurveyPoint])],
        controllers: [site_survey_points_controller_1.SiteSurveyPointsController],
        providers: [site_survey_points_service_1.SiteSurveyPointsService, entity_exists_constraint_1.EntityExists],
    })
], SiteSurveyPointsModule);
exports.SiteSurveyPointsModule = SiteSurveyPointsModule;
