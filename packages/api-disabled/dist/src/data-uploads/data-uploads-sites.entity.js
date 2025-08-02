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
exports.DataUploadsSites = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const site_survey_points_entity_1 = require("../site-survey-points/site-survey-points.entity");
const sites_entity_1 = require("../sites/sites.entity");
const data_uploads_entity_1 = require("./data-uploads.entity");
let DataUploadsSites = class DataUploadsSites {
    static _OPENAPI_METADATA_FACTORY() {
        return { site: { required: true, type: () => require("../sites/sites.entity").Site }, siteId: { required: true, type: () => Number }, dataUpload: { required: true, type: () => require("./data-uploads.entity").DataUploads }, dataUploadId: { required: true, type: () => Number }, surveyPoint: { required: true, type: () => require("../site-survey-points/site-survey-points.entity").SiteSurveyPoint, nullable: true }, surveyPointId: { required: false, type: () => Number }, minDate: { required: true, type: () => Date }, maxDate: { required: true, type: () => Date }, sitesAffectedByDataUpload: { required: false, type: () => [Number] } };
    }
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => sites_entity_1.Site, { onDelete: 'CASCADE', nullable: false }),
    (0, typeorm_1.Index)(),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", sites_entity_1.Site)
], DataUploadsSites.prototype, "site", void 0);
__decorate([
    (0, typeorm_1.RelationId)((dataUploadsSite) => dataUploadsSite.site),
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], DataUploadsSites.prototype, "siteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => data_uploads_entity_1.DataUploads, { onDelete: 'CASCADE', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", data_uploads_entity_1.DataUploads)
], DataUploadsSites.prototype, "dataUpload", void 0);
__decorate([
    (0, typeorm_1.RelationId)((dataUploadsSite) => dataUploadsSite.dataUpload),
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], DataUploadsSites.prototype, "dataUploadId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => site_survey_points_entity_1.SiteSurveyPoint, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Object)
], DataUploadsSites.prototype, "surveyPoint", void 0);
__decorate([
    (0, typeorm_1.RelationId)((dataUploadsSite) => dataUploadsSite.surveyPoint),
    __metadata("design:type", Number)
], DataUploadsSites.prototype, "surveyPointId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], DataUploadsSites.prototype, "minDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], DataUploadsSites.prototype, "maxDate", void 0);
DataUploadsSites = __decorate([
    (0, typeorm_1.Entity)()
], DataUploadsSites);
exports.DataUploadsSites = DataUploadsSites;
