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
exports.ReefCheckSite = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const reef_check_surveys_entity_1 = require("../reef-check-surveys/reef-check-surveys.entity");
const sites_entity_1 = require("../sites/sites.entity");
let ReefCheckSite = class ReefCheckSite {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, siteId: { required: true, type: () => Number }, site: { required: true, type: () => require("../sites/sites.entity").Site }, reefName: { required: true, type: () => String }, orientation: { required: true, type: () => String }, country: { required: true, type: () => String }, stateProvinceIsland: { required: true, type: () => String }, cityTown: { required: true, type: () => String }, region: { required: true, type: () => String }, distanceFromShore: { required: true, type: () => Number }, distanceFromNearestRiver: { required: true, type: () => Number }, distanceToNearestPopn: { required: true, type: () => Number }, surveys: { required: true, type: () => [require("../reef-check-surveys/reef-check-surveys.entity").ReefCheckSurvey] } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], ReefCheckSite.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ReefCheckSite.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => sites_entity_1.Site }),
    (0, typeorm_1.ManyToOne)(() => sites_entity_1.Site),
    (0, typeorm_1.JoinColumn)({ name: 'site_id' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", sites_entity_1.Site)
], ReefCheckSite.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSite.prototype, "reefName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSite.prototype, "orientation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSite.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSite.prototype, "stateProvinceIsland", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSite.prototype, "cityTown", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSite.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)('float', { nullable: true }),
    __metadata("design:type", Number)
], ReefCheckSite.prototype, "distanceFromShore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)('float', { nullable: true }),
    __metadata("design:type", Number)
], ReefCheckSite.prototype, "distanceFromNearestRiver", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)('float', { nullable: true }),
    __metadata("design:type", Number)
], ReefCheckSite.prototype, "distanceToNearestPopn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.OneToMany)(() => reef_check_surveys_entity_1.ReefCheckSurvey, (survey) => survey.site),
    __metadata("design:type", Array)
], ReefCheckSite.prototype, "surveys", void 0);
ReefCheckSite = __decorate([
    (0, typeorm_1.Entity)()
], ReefCheckSite);
exports.ReefCheckSite = ReefCheckSite;
