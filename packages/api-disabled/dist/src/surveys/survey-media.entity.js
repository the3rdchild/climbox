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
exports.SurveyMedia = exports.MediaType = exports.Observations = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const surveys_entity_1 = require("./surveys.entity");
const site_survey_points_entity_1 = require("../site-survey-points/site-survey-points.entity");
const sensor_data_dto_1 = require("../sensors/dto/sensor-data.dto");
const api_sensor_data_1 = require("../docs/api-sensor-data");
var Observations;
(function (Observations) {
    Observations["Anthropogenic"] = "anthropogenic";
    Observations["Environmental"] = "environmental";
    Observations["EvidentDisease"] = "evident-disease";
    Observations["Healthy"] = "healthy";
    Observations["InvasiveSpecies"] = "invasive-species";
    Observations["Mortality"] = "mortality";
    Observations["NoData"] = "no-data";
    Observations["PossibleDisease"] = "possible-disease";
})(Observations = exports.Observations || (exports.Observations = {}));
var MediaType;
(function (MediaType) {
    MediaType["Video"] = "video";
    MediaType["Image"] = "image";
})(MediaType = exports.MediaType || (exports.MediaType = {}));
let SurveyMedia = class SurveyMedia {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, url: { required: true, type: () => String }, thumbnailUrl: { required: true, type: () => String, nullable: true }, quality: { required: true, type: () => Number }, featured: { required: true, type: () => Boolean }, hidden: { required: true, type: () => Boolean }, metadata: { required: true, type: () => String }, observations: { required: true, enum: require("./survey-media.entity").Observations }, comments: { required: true, type: () => String, nullable: true }, surveyId: { required: true, type: () => require("./surveys.entity").Survey }, type: { required: true, enum: require("./survey-media.entity").MediaType }, surveyPointId: { required: true, type: () => Number }, surveyPoint: { required: true, type: () => require("../site-survey-points/site-survey-points.entity").SiteSurveyPoint, nullable: true }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, sensorData: { required: false, type: () => require("../sensors/dto/sensor-data.dto").SensorDataDto } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SurveyMedia.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://storage.googleapis.com/storage/reef-image-a5b5f5c5d5da5d5e.jpg',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SurveyMedia.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://storage.googleapis.com/storage/thumbnail-reef-image-a5b5f5c5d5da5d5e.jpg',
    }),
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'character varying',
    }),
    __metadata("design:type", Object)
], SurveyMedia.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], SurveyMedia.prototype, "quality", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], SurveyMedia.prototype, "featured", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], SurveyMedia.prototype, "hidden", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: {} }),
    (0, typeorm_1.Column)('json'),
    __metadata("design:type", String)
], SurveyMedia.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Observations,
    }),
    __metadata("design:type", String)
], SurveyMedia.prototype, "observations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Survey media comments' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], SurveyMedia.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => surveys_entity_1.Survey, { onDelete: 'CASCADE', eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'survey_id' }),
    __metadata("design:type", surveys_entity_1.Survey)
], SurveyMedia.prototype, "surveyId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MediaType,
    }),
    __metadata("design:type", String)
], SurveyMedia.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.RelationId)((surveyMedia) => surveyMedia.surveyPoint),
    __metadata("design:type", Number)
], SurveyMedia.prototype, "surveyPointId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => site_survey_points_entity_1.SiteSurveyPoint, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'survey_point_id' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Object)
], SurveyMedia.prototype, "surveyPoint", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SurveyMedia.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SurveyMedia.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(api_sensor_data_1.sensorDataSchema),
    __metadata("design:type", sensor_data_dto_1.SensorDataDto)
], SurveyMedia.prototype, "sensorData", void 0);
SurveyMedia = __decorate([
    (0, typeorm_1.Entity)()
], SurveyMedia);
exports.SurveyMedia = SurveyMedia;
