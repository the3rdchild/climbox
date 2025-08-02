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
exports.SiteSurveyPoint = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const sites_entity_1 = require("../sites/sites.entity");
const api_properties_1 = require("../docs/api-properties");
let SiteSurveyPoint = class SiteSurveyPoint {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, surveyPointLabelId: { required: true, type: () => Number, nullable: true }, imageUrl: { required: true, type: () => String, nullable: true }, name: { required: true, type: () => String }, site: { required: true, type: () => require("../sites/sites.entity").Site }, siteId: { required: true, type: () => Number }, polygon: { required: true, type: () => Object, nullable: true }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SiteSurveyPoint.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.Column)({ nullable: true, type: 'integer' }),
    __metadata("design:type", Object)
], SiteSurveyPoint.prototype, "surveyPointLabelId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'http://some-sample-url.com' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], SiteSurveyPoint.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Outer tide pool' }),
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], SiteSurveyPoint.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sites_entity_1.Site, { onDelete: 'CASCADE', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", sites_entity_1.Site)
], SiteSurveyPoint.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.RelationId)((surveyPoint) => surveyPoint.site),
    __metadata("design:type", Number)
], SiteSurveyPoint.prototype, "siteId", void 0);
__decorate([
    (0, api_properties_1.ApiPointProperty)(),
    (0, typeorm_1.Column)({
        type: 'geometry',
        spatialFeatureType: 'Point',
        unique: true,
        srid: 4326,
        nullable: true,
    }),
    (0, typeorm_1.Index)({ spatial: true }),
    __metadata("design:type", Object)
], SiteSurveyPoint.prototype, "polygon", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SiteSurveyPoint.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SiteSurveyPoint.prototype, "updatedAt", void 0);
SiteSurveyPoint = __decorate([
    (0, typeorm_1.Entity)()
], SiteSurveyPoint);
exports.SiteSurveyPoint = SiteSurveyPoint;
