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
exports.EditSurveyMediaDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const survey_media_entity_1 = require("../survey-media.entity");
const entity_exists_constraint_1 = require("../../validations/entity-exists.constraint");
const site_survey_points_entity_1 = require("../../site-survey-points/site-survey-points.entity");
class EditSurveyMediaDto {
    constructor() {
        this.featured = false;
        this.hidden = false;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { featured: { required: true, type: () => Boolean, default: false }, hidden: { required: true, type: () => Boolean, default: false }, observations: { required: false, enum: require("../survey-media.entity").Observations }, comments: { required: false, type: () => String }, surveyPointId: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EditSurveyMediaDto.prototype, "featured", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EditSurveyMediaDto.prototype, "hidden", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(survey_media_entity_1.Observations),
    __metadata("design:type", String)
], EditSurveyMediaDto.prototype, "observations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Survey media comments' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditSurveyMediaDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Validate)(entity_exists_constraint_1.EntityExists, [site_survey_points_entity_1.SiteSurveyPoint]),
    __metadata("design:type", Number)
], EditSurveyMediaDto.prototype, "surveyPointId", void 0);
exports.EditSurveyMediaDto = EditSurveyMediaDto;
