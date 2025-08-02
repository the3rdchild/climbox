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
exports.HistoricalMonthlyMean = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const sites_entity_1 = require("./sites.entity");
let HistoricalMonthlyMean = class HistoricalMonthlyMean {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, month: { required: true, type: () => Number }, temperature: { required: true, type: () => Number }, siteId: { required: true, type: () => Number }, site: { required: true, type: () => require("./sites.entity").Site }, updatedAt: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HistoricalMonthlyMean.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, minimum: 1, maximum: 12 }),
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], HistoricalMonthlyMean.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 24.21 }),
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], HistoricalMonthlyMean.prototype, "temperature", void 0);
__decorate([
    (0, typeorm_1.RelationId)((historicalMonthlyMean) => historicalMonthlyMean.site),
    __metadata("design:type", Number)
], HistoricalMonthlyMean.prototype, "siteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sites_entity_1.Site, { onDelete: 'CASCADE' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", sites_entity_1.Site)
], HistoricalMonthlyMean.prototype, "site", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], HistoricalMonthlyMean.prototype, "updatedAt", void 0);
HistoricalMonthlyMean = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)('UQ_MONTHS', ['site', 'month'])
], HistoricalMonthlyMean);
exports.HistoricalMonthlyMean = HistoricalMonthlyMean;
