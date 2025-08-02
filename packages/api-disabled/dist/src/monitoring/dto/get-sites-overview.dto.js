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
exports.GetSitesOverviewDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const sites_entity_1 = require("../../sites/sites.entity");
const entity_exists_constraint_1 = require("../../validations/entity-exists.constraint");
class GetSitesOverviewDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { siteId: { required: false, type: () => Number, minimum: 1, maximum: 1000000 }, siteName: { required: false, type: () => String }, spotterId: { required: false, type: () => String }, adminEmail: { required: false, type: () => String }, adminUsername: { required: false, type: () => String }, organization: { required: false, type: () => String }, status: { required: false, enum: require("../../sites/sites.entity").SiteStatus } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 42 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000000),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Validate)(entity_exists_constraint_1.EntityExists, [sites_entity_1.Site]),
    __metadata("design:type", Number)
], GetSitesOverviewDto.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bellows South Africa' }),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetSitesOverviewDto.prototype, "siteName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SPOT-2742' }),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetSitesOverviewDto.prototype, "spotterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin@example.com' }),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetSitesOverviewDto.prototype, "adminEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Smith' }),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetSitesOverviewDto.prototype, "adminUsername", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Aqualink' }),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetSitesOverviewDto.prototype, "organization", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'deployed' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(sites_entity_1.SiteStatus),
    __metadata("design:type", String)
], GetSitesOverviewDto.prototype, "status", void 0);
exports.GetSitesOverviewDto = GetSitesOverviewDto;
