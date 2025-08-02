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
exports.Sources = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const site_survey_points_entity_1 = require("../site-survey-points/site-survey-points.entity");
const sites_entity_1 = require("./sites.entity");
const source_type_enum_1 = require("./schemas/source-type.enum");
let Sources = class Sources {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, site: { required: true, type: () => require("./sites.entity").Site }, surveyPoint: { required: true, type: () => require("../site-survey-points/site-survey-points.entity").SiteSurveyPoint, nullable: true }, type: { required: true, enum: require("./schemas/source-type.enum").SourceType }, depth: { required: true, type: () => Number, nullable: true }, sensorId: { required: true, type: () => String, nullable: true } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Sources.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sites_entity_1.Site, { onDelete: 'CASCADE' }),
    __metadata("design:type", sites_entity_1.Site)
], Sources.prototype, "site", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => site_survey_points_entity_1.SiteSurveyPoint, { onDelete: 'CASCADE', nullable: true }),
    __metadata("design:type", Object)
], Sources.prototype, "surveyPoint", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: source_type_enum_1.SourceType }),
    __metadata("design:type", String)
], Sources.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    (0, typeorm_1.Column)('float', { nullable: true }),
    __metadata("design:type", Object)
], Sources.prototype, "depth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SPOT-0000' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], Sources.prototype, "sensorId", void 0);
Sources = __decorate([
    (0, typeorm_1.Entity)()
    // Typeorm does not allow to add raw SQL on column declaration
    // So we will edit the query on the migration
    // CREATE UNIQUE INDEX "no_duplicate_sources" ON "sources" ("site_id", COALESCE("survey_point_id", 0), "type", COALESCE("sensor_id", 'SPOT-IMPOSSIBLE'), COALESCE("depth", 0))
    ,
    (0, typeorm_1.Index)('no_duplicate_sources', { synchronize: false })
], Sources);
exports.Sources = Sources;
