"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCloudModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const google_cloud_service_1 = require("./google-cloud.service");
const google_cloud_controller_1 = require("./google-cloud.controller");
const auth_module_1 = require("../auth/auth.module");
const survey_media_entity_1 = require("../surveys/survey-media.entity");
const data_uploads_entity_1 = require("../data-uploads/data-uploads.entity");
let GoogleCloudModule = class GoogleCloudModule {
};
GoogleCloudModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, typeorm_1.TypeOrmModule.forFeature([data_uploads_entity_1.DataUploads, survey_media_entity_1.SurveyMedia])],
        providers: [google_cloud_service_1.GoogleCloudService],
        exports: [google_cloud_service_1.GoogleCloudService],
        controllers: [google_cloud_controller_1.GoogleCloudController],
    })
], GoogleCloudModule);
exports.GoogleCloudModule = GoogleCloudModule;
