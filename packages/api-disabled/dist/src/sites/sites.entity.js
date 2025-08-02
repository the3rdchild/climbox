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
exports.Site = exports.SensorType = exports.SiteStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const reef_check_sites_entity_1 = require("../reef-check-sites/reef-check-sites.entity");
const reef_check_surveys_entity_1 = require("../reef-check-surveys/reef-check-surveys.entity");
const site_sketchfab_entity_1 = require("../site-sketchfab/site-sketchfab.entity");
const regions_entity_1 = require("../regions/regions.entity");
const surveys_entity_1 = require("../surveys/surveys.entity");
const users_entity_1 = require("../users/users.entity");
const site_applications_entity_1 = require("../site-applications/site-applications.entity");
const historical_monthly_mean_entity_1 = require("./historical-monthly-mean.entity");
const api_properties_1 = require("../docs/api-properties");
var SiteStatus;
(function (SiteStatus) {
    SiteStatus["InReview"] = "in_review";
    SiteStatus["Rejected"] = "rejected";
    SiteStatus["Approved"] = "approved";
    SiteStatus["Shipped"] = "shipped";
    SiteStatus["Deployed"] = "deployed";
    SiteStatus["Maintenance"] = "maintenance";
    SiteStatus["Lost"] = "lost";
    SiteStatus["EndOfLife"] = "end_of_life";
})(SiteStatus = exports.SiteStatus || (exports.SiteStatus = {}));
var SensorType;
(function (SensorType) {
    SensorType["SofarSpotter"] = "sofar_spotter";
})(SensorType = exports.SensorType || (exports.SensorType = {}));
let Site = class Site {
    get applied() {
        var _a;
        return !!((_a = this.siteApplication) === null || _a === void 0 ? void 0 : _a.permitRequirements);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String, nullable: true }, sensorId: { required: true, type: () => String, nullable: true }, polygon: { required: true, type: () => Object, nullable: true }, nearestNOAALocation: { required: true, type: () => Object, nullable: true }, depth: { required: true, type: () => Number, nullable: true }, iframe: { required: true, type: () => String, nullable: true }, status: { required: true, enum: require("./sites.entity").SiteStatus }, videoStream: { required: true, type: () => String, nullable: true }, maxMonthlyMean: { required: true, type: () => Number, nullable: true }, timezone: { required: true, type: () => String, nullable: true }, display: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, region: { required: true, type: () => require("../regions/regions.entity").Region, nullable: true }, sketchFab: { required: false, type: () => require("../site-sketchfab/site-sketchfab.entity").SketchFab, nullable: true }, admins: { required: true, type: () => [require("../users/users.entity").User] }, reefCheckSites: { required: true, type: () => [require("../reef-check-sites/reef-check-sites.entity").ReefCheckSite] }, surveys: { required: true, type: () => [require("../surveys/surveys.entity").Survey] }, reefCheckSurveys: { required: true, type: () => [require("../reef-check-surveys/reef-check-surveys.entity").ReefCheckSurvey] }, siteApplication: { required: false, type: () => require("../site-applications/site-applications.entity").SiteApplication }, historicalMonthlyMean: { required: true, type: () => [require("./historical-monthly-mean.entity").HistoricalMonthlyMean] }, hasHobo: { required: false, type: () => Boolean }, collectionData: { required: false, type: () => require("../collections/dto/collection-data.dto").CollectionDataDto }, maskedSpotterApiToken: { required: false, type: () => String }, waterQualitySources: { required: false, type: () => [String] } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Site.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Duxbury Site' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], Site.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SPOT-0000' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], Site.prototype, "sensorId", void 0);
__decorate([
    (0, api_properties_1.ApiPointProperty)(),
    (0, typeorm_1.Column)({
        type: 'geometry',
        spatialFeatureType: 'Point',
        unique: true,
        srid: 4326,
        nullable: false,
    }),
    (0, typeorm_1.Index)({ spatial: true }),
    __metadata("design:type", Object)
], Site.prototype, "polygon", void 0);
__decorate([
    (0, api_properties_1.ApiPointProperty)(),
    (0, typeorm_1.Column)({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Site.prototype, "nearestNOAALocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 23 }),
    (0, typeorm_1.Column)({ nullable: true, type: 'integer' }),
    __metadata("design:type", Object)
], Site.prototype, "depth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://something.example.com' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    (0, typeorm_1.Check)('char_length(iframe) <= 200 AND char_length(iframe) > 10'),
    __metadata("design:type", Object)
], Site.prototype, "iframe", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SiteStatus,
        default: SiteStatus.InReview,
        nullable: false,
    }),
    __metadata("design:type", String)
], Site.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], Site.prototype, "videoStream", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 33.54 }),
    (0, typeorm_1.Column)('float', { nullable: true }),
    __metadata("design:type", Object)
], Site.prototype, "maxMonthlyMean", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pacific/Palau' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], Site.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Site.prototype, "display", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Site.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Site.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => regions_entity_1.Region, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Object)
], Site.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => site_sketchfab_entity_1.SketchFab, (sketchFab) => sketchFab.site),
    __metadata("design:type", Object)
], Site.prototype, "sketchFab", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => users_entity_1.User, (user) => user.administeredSites, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Site.prototype, "admins", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => [reef_check_sites_entity_1.ReefCheckSite] }),
    (0, typeorm_1.OneToMany)(() => reef_check_sites_entity_1.ReefCheckSite, (reefCheckSite) => reefCheckSite.site),
    __metadata("design:type", Array)
], Site.prototype, "reefCheckSites", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.OneToMany)(() => surveys_entity_1.Survey, (survey) => survey.site),
    __metadata("design:type", Array)
], Site.prototype, "surveys", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.OneToMany)(() => reef_check_surveys_entity_1.ReefCheckSurvey, (reefCheckSurvey) => reefCheckSurvey.site),
    __metadata("design:type", Array)
], Site.prototype, "reefCheckSurveys", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => site_applications_entity_1.SiteApplication, (siteApplication) => siteApplication.site),
    __metadata("design:type", site_applications_entity_1.SiteApplication)
], Site.prototype, "siteApplication", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.OneToMany)(() => historical_monthly_mean_entity_1.HistoricalMonthlyMean, (historicalMonthlyMean) => historicalMonthlyMean.site),
    __metadata("design:type", Array)
], Site.prototype, "historicalMonthlyMean", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ nullable: true, select: false, type: 'character varying' }),
    __metadata("design:type", Object)
], Site.prototype, "spotterApiToken", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ nullable: true, select: false, type: 'character varying' }),
    __metadata("design:type", Object)
], Site.prototype, "contactInformation", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], Site.prototype, "applied", null);
Site = __decorate([
    (0, typeorm_1.Entity)()
], Site);
exports.Site = Site;
