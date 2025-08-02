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
exports.UpdateSiteSurveyPointDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const entity_exists_constraint_1 = require("../../validations/entity-exists.constraint");
const sites_entity_1 = require("../../sites/sites.entity");
class UpdateSiteSurveyPointDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, latitude: { required: false, type: () => Number }, longitude: { required: false, type: () => Number }, surveyPointLabelId: { required: false, type: () => Number }, imageUrl: { required: false, type: () => String }, siteId: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Outer tide pool' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateSiteSurveyPointDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1.21123 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], UpdateSiteSurveyPointDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 94.22121 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], UpdateSiteSurveyPointDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateSiteSurveyPointDto.prototype, "surveyPointLabelId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'http://some-sample-url.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateSiteSurveyPointDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Validate)(entity_exists_constraint_1.EntityExists, [sites_entity_1.Site]),
    __metadata("design:type", Number)
], UpdateSiteSurveyPointDto.prototype, "siteId", void 0);
exports.UpdateSiteSurveyPointDto = UpdateSiteSurveyPointDto;
