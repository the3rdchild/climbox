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
exports.ReefCheckSurvey = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const sites_entity_1 = require("../sites/sites.entity");
const reef_check_sites_entity_1 = require("../reef-check-sites/reef-check-sites.entity");
const reef_check_organisms_entity_1 = require("../reef-check-organisms/reef-check-organisms.entity");
const reef_check_substrates_entity_1 = require("../reef-check-substrates/reef-check-substrates.entity");
let ReefCheckSurvey = class ReefCheckSurvey {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, siteId: { required: true, type: () => Number }, site: { required: true, type: () => require("../sites/sites.entity").Site }, reefCheckSiteId: { required: true, type: () => String }, reefCheckSite: { required: true, type: () => require("../reef-check-sites/reef-check-sites.entity").ReefCheckSite }, organisms: { required: true, type: () => [require("../reef-check-organisms/reef-check-organisms.entity").ReefCheckOrganism] }, substrates: { required: true, type: () => [require("../reef-check-substrates/reef-check-substrates.entity").ReefCheckSubstrate] }, date: { required: true, type: () => Date }, errors: { required: true, type: () => String }, depth: { required: true, type: () => Number }, timeOfDayWorkBegan: { required: true, type: () => String }, timeOfDayWorkEnded: { required: true, type: () => String }, methodUsedToDetermineLocation: { required: true, type: () => String }, riverMouthWidth: { required: true, type: () => String }, weather: { required: true, type: () => String }, airTemp: { required: true, type: () => Number }, waterTempAtSurface: { required: true, type: () => Number }, waterTempAt3M: { required: true, type: () => Number }, waterTempAt10M: { required: true, type: () => Number }, approxPopnSizeX1000: { required: true, type: () => Number }, horizontalVisibilityInWater: { required: true, type: () => Number }, bestReefArea: { required: true, type: () => String }, whyWasThisSiteSelected: { required: true, type: () => String }, shelteredOrExposed: { required: true, type: () => String }, anyMajorStormsInLastYears: { required: true, type: () => String }, whenStorms: { required: true, type: () => String }, overallAnthroImpact: { required: true, type: () => String }, whatKindOfImpacts: { required: true, type: () => String }, siltation: { required: true, type: () => String }, dynamiteFishing: { required: true, type: () => String }, poisonFishing: { required: true, type: () => String }, aquariumFishCollection: { required: true, type: () => String }, harvestOfInvertsForFood: { required: true, type: () => String }, harvestOfInvertsForCurio: { required: true, type: () => String }, touristDivingSnorkeling: { required: true, type: () => String }, sewagePollution: { required: true, type: () => String }, industrialPollution: { required: true, type: () => String }, commercialFishing: { required: true, type: () => String }, liveFoodFishing: { required: true, type: () => String }, artisinalRecreational: { required: true, type: () => String }, otherFormsOfFishing: { required: true, type: () => String }, otherFishing: { required: true, type: () => String }, yachts: { required: true, type: () => String }, levelOfOtherImpacts: { required: true, type: () => String }, otherImpacts: { required: true, type: () => String }, isSiteProtected: { required: true, type: () => String }, isProtectionEnforced: { required: true, type: () => String }, levelOfPoaching: { required: true, type: () => String }, spearfishing: { required: true, type: () => String }, bannedCommercialFishing: { required: true, type: () => String }, recreationalFishing: { required: true, type: () => String }, invertebrateShellCollection: { required: true, type: () => String }, anchoring: { required: true, type: () => String }, diving: { required: true, type: () => String }, otherSpecify: { required: true, type: () => String }, natureOfProtection: { required: true, type: () => String }, siteComments: { required: true, type: () => String }, substrateComments: { required: true, type: () => String }, fishComments: { required: true, type: () => String }, invertsComments: { required: true, type: () => String }, commentsFromOrganismSheet: { required: true, type: () => String }, grouperSize: { required: true, type: () => String }, percentBleaching: { required: true, type: () => String }, percentColoniesBleached: { required: true, type: () => String }, percentOfEachColony: { required: true, type: () => String }, suspectedDisease: { required: true, type: () => String }, rareAnimalsDetails: { required: true, type: () => String }, submittedBy: { required: true, type: () => String }, teamLeader: { required: true, type: () => String }, teamScientist: { required: true, type: () => String }, satelliteTemperature: { required: true, type: () => String } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ReefCheckSurvey.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.ManyToOne)(() => sites_entity_1.Site, (site) => site.reefCheckSurveys),
    (0, typeorm_1.JoinColumn)({ name: 'site_id' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", sites_entity_1.Site)
], ReefCheckSurvey.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "reefCheckSiteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.ManyToOne)(() => reef_check_sites_entity_1.ReefCheckSite, (reefCheckSite) => reefCheckSite.surveys),
    (0, typeorm_1.JoinColumn)({ name: 'reef_check_site_id' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", reef_check_sites_entity_1.ReefCheckSite)
], ReefCheckSurvey.prototype, "reefCheckSite", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.OneToMany)(() => reef_check_organisms_entity_1.ReefCheckOrganism, (organism) => organism.survey),
    __metadata("design:type", Array)
], ReefCheckSurvey.prototype, "organisms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.OneToMany)(() => reef_check_substrates_entity_1.ReefCheckSubstrate, (substrate) => substrate.survey),
    __metadata("design:type", Array)
], ReefCheckSurvey.prototype, "substrates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ReefCheckSurvey.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "errors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)('float', { nullable: true }),
    __metadata("design:type", Number)
], ReefCheckSurvey.prototype, "depth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "timeOfDayWorkBegan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "timeOfDayWorkEnded", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "methodUsedToDetermineLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "riverMouthWidth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "weather", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], ReefCheckSurvey.prototype, "airTemp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], ReefCheckSurvey.prototype, "waterTempAtSurface", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], ReefCheckSurvey.prototype, "waterTempAt3M", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], ReefCheckSurvey.prototype, "waterTempAt10M", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], ReefCheckSurvey.prototype, "approxPopnSizeX1000", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], ReefCheckSurvey.prototype, "horizontalVisibilityInWater", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "bestReefArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "whyWasThisSiteSelected", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "shelteredOrExposed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "anyMajorStormsInLastYears", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "whenStorms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "overallAnthroImpact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "whatKindOfImpacts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "siltation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "dynamiteFishing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "poisonFishing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "aquariumFishCollection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "harvestOfInvertsForFood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "harvestOfInvertsForCurio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "touristDivingSnorkeling", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "sewagePollution", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "industrialPollution", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "commercialFishing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "liveFoodFishing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "artisinalRecreational", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "otherFormsOfFishing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "otherFishing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "yachts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "levelOfOtherImpacts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "otherImpacts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "isSiteProtected", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "isProtectionEnforced", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "levelOfPoaching", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "spearfishing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "bannedCommercialFishing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "recreationalFishing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "invertebrateShellCollection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "anchoring", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "diving", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "otherSpecify", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "natureOfProtection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "siteComments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "substrateComments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "fishComments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "invertsComments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "commentsFromOrganismSheet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "grouperSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "percentBleaching", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "percentColoniesBleached", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "percentOfEachColony", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "suspectedDisease", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "rareAnimalsDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "submittedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "teamLeader", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "teamScientist", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.VirtualColumn)({
        query: (survey) => `
      SELECT satellite_temperature
      FROM daily_data
      WHERE DATE(daily_data.date) = DATE(${survey}.date)
      AND daily_data.site_id = ${survey}.site_id
      LIMIT 1
    `,
    }),
    __metadata("design:type", String)
], ReefCheckSurvey.prototype, "satelliteTemperature", void 0);
ReefCheckSurvey = __decorate([
    (0, typeorm_1.Entity)()
], ReefCheckSurvey);
exports.ReefCheckSurvey = ReefCheckSurvey;
