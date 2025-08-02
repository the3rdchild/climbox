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
exports.LatestData = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const site_survey_points_entity_1 = require("../site-survey-points/site-survey-points.entity");
const sites_entity_1 = require("../sites/sites.entity");
const source_type_enum_1 = require("../sites/schemas/source-type.enum");
const time_series_entity_1 = require("./time-series.entity");
const metrics_enum_1 = require("./metrics.enum");
let LatestData = class LatestData {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, timestamp: { required: true, type: () => Date }, value: { required: true, type: () => Number }, site: { required: true, type: () => require("../sites/sites.entity").Site }, siteId: { required: true, type: () => Number }, surveyPoint: { required: true, type: () => require("../site-survey-points/site-survey-points.entity").SiteSurveyPoint, nullable: true }, source: { required: true, enum: require("../sites/schemas/source-type.enum").SourceType }, metric: { required: true, enum: require("./metrics.enum").Metric } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LatestData.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Date)
], LatestData.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 11.05 }),
    (0, typeorm_1.Column)({ type: 'float', nullable: false }),
    __metadata("design:type", Number)
], LatestData.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sites_entity_1.Site, { onDelete: 'CASCADE', nullable: false }),
    __metadata("design:type", sites_entity_1.Site)
], LatestData.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15 }),
    (0, typeorm_1.RelationId)((latestData) => latestData.site),
    __metadata("design:type", Number)
], LatestData.prototype, "siteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => site_survey_points_entity_1.SiteSurveyPoint, { onDelete: 'CASCADE', nullable: true }),
    __metadata("design:type", Object)
], LatestData.prototype, "surveyPoint", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: source_type_enum_1.SourceType }),
    __metadata("design:type", String)
], LatestData.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: metrics_enum_1.Metric }),
    __metadata("design:type", String)
], LatestData.prototype, "metric", void 0);
LatestData = __decorate([
    (0, typeorm_1.ViewEntity)({
        expression: (dataSource) => {
            return (dataSource
                .createQueryBuilder()
                .select('DISTINCT ON (metric, type, site_id, survey_point_id) time_series.id')
                .addSelect('metric')
                .addSelect('timestamp')
                .addSelect('value')
                .addSelect('type', 'source')
                .addSelect('site_id')
                .addSelect('survey_point_id')
                .from(time_series_entity_1.TimeSeries, 'time_series')
                .innerJoin('sources', 'sources', 'sources.id = time_series.source_id')
                // Limit data to the past week. Bonus, it makes view refreshes a lot faster.
                .where("timestamp >= current_date - INTERVAL '7 days'")
                // Look a bit further in the past for sonde data
                .orWhere("type IN ('sonde') AND (timestamp >= current_date - INTERVAL '2 years')")
                .orWhere("type IN ('hui') AND (timestamp >= current_date - INTERVAL '2 years')")
                .orWhere("type IN ('sheet_data') AND (timestamp >= current_date - INTERVAL '2 years')")
                .orderBy('metric, type, site_id, survey_point_id, timestamp', 'DESC'));
        },
        materialized: true,
    })
], LatestData);
exports.LatestData = LatestData;
