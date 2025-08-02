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
exports.ForecastData = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const source_type_enum_1 = require("../sites/schemas/source-type.enum");
const sites_entity_1 = require("../sites/sites.entity");
const wind_wave_data_types_1 = require("./wind-wave-data.types");
let ForecastData = class ForecastData {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, site: { required: true, type: () => require("../sites/sites.entity").Site }, timestamp: { required: true, type: () => Date }, value: { required: true, type: () => Number }, metric: { required: true, enum: require("./wind-wave-data.types").WindWaveMetric }, source: { required: true, enum: require("../sites/schemas/source-type.enum").SourceType }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ForecastData.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sites_entity_1.Site, { onDelete: 'CASCADE', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", sites_entity_1.Site)
], ForecastData.prototype, "site", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Date)
], ForecastData.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: false }),
    __metadata("design:type", Number)
], ForecastData.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: wind_wave_data_types_1.WindWaveMetric, nullable: false }),
    __metadata("design:type", Number)
], ForecastData.prototype, "metric", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: source_type_enum_1.SourceType }),
    __metadata("design:type", String)
], ForecastData.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ForecastData.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ForecastData.prototype, "updatedAt", void 0);
ForecastData = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)('one_row_per_site_per_metric_per_source', ['site', 'metric', 'source'])
], ForecastData);
exports.ForecastData = ForecastData;
