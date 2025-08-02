"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Survey = exports.WeatherConditions = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const sites_entity_1 = require("../sites/sites.entity");
const users_entity_1 = require("../users/users.entity");
const survey_media_entity_1 = require("./survey-media.entity");
const sensor_data_dto_1 = require("../sensors/dto/sensor-data.dto");
const api_sensor_data_1 = require("../docs/api-sensor-data");
var WeatherConditions;
(function (WeatherConditions) {
    WeatherConditions["Calm"] = "calm";
    WeatherConditions["Wavy"] = "waves";
    WeatherConditions["Stormy"] = "storm";
    WeatherConditions["NoData"] = "no-data";
})(WeatherConditions = exports.WeatherConditions || (exports.WeatherConditions = {}));
let Survey = class Survey {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, weatherConditions: { required: true, enum: require("./surveys.entity").WeatherConditions }, temperature: { required: false, type: () => Number, nullable: true }, comments: { required: false, type: () => String, nullable: true }, diveDate: { required: true, type: () => Date }, user: { required: true, type: () => require("../users/users.entity").User }, siteId: { required: true, type: () => Number }, site: { required: true, type: () => require("../sites/sites.entity").Site }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, featuredSurveyMedia: { required: false, type: () => require("./survey-media.entity").SurveyMedia }, surveyMedia: { required: false, type: () => [require("./survey-media.entity").SurveyMedia] }, latestDailyData: { required: false, type: () => require("../sites/daily-data.entity").DailyData }, surveyPoints: { required: false, type: () => [require("../site-survey-points/site-survey-points.entity").SiteSurveyPoint] }, observations: { required: false, enum: require("./survey-media.entity").Observations, isArray: true }, satelliteTemperature: { required: false, type: () => Number }, sensorData: { required: false, type: () => require("../sensors/dto/sensor-data.dto").SensorDataDto } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Survey.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'weather_conditions',
        type: 'enum',
        enum: WeatherConditions,
        default: 'no-data',
        nullable: false,
    }),
    __metadata("design:type", String)
], Survey.prototype, "weatherConditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 33.2 }),
    (0, typeorm_1.Column)('float', { nullable: true }),
    __metadata("design:type", Object)
], Survey.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Survey comment' }),
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", Object)
], Survey.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Date)
], Survey.prototype, "diveDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, { onDelete: 'CASCADE', nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", users_entity_1.User)
], Survey.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.RelationId)((survey) => survey.site),
    __metadata("design:type", Number)
], Survey.prototype, "siteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sites_entity_1.Site, { onDelete: 'CASCADE', nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'site_id' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", sites_entity_1.Site)
], Survey.prototype, "site", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Survey.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Survey.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => survey_media_entity_1.SurveyMedia, (surveyMedia) => surveyMedia.surveyId),
    __metadata("design:type", survey_media_entity_1.SurveyMedia)
], Survey.prototype, "featuredSurveyMedia", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => survey_media_entity_1.SurveyMedia, (surveyMedia) => surveyMedia.surveyId),
    __metadata("design:type", Array)
], Survey.prototype, "surveyMedia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(api_sensor_data_1.sensorDataSchema),
    __metadata("design:type", sensor_data_dto_1.SensorDataDto)
], Survey.prototype, "sensorData", void 0);
Survey = __decorate([
    (0, typeorm_1.Entity)()
], Survey);
exports.Survey = Survey;
