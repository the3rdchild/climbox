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
exports.DailyData = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const sites_entity_1 = require("./sites.entity");
let DailyData = class DailyData {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, date: { required: true, type: () => Date }, degreeHeatingDays: { required: true, type: () => Number, nullable: true }, satelliteTemperature: { required: true, type: () => Number, nullable: true }, dailyAlertLevel: { required: true, type: () => Number, nullable: true }, weeklyAlertLevel: { required: true, type: () => Number, nullable: true }, site: { required: true, type: () => require("./sites.entity").Site }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DailyData.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], DailyData.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20 }),
    (0, typeorm_1.Column)('float', { nullable: true }),
    __metadata("design:type", Object)
], DailyData.prototype, "degreeHeatingDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 21 }),
    (0, typeorm_1.Column)('float', { nullable: true }),
    __metadata("design:type", Object)
], DailyData.prototype, "satelliteTemperature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    (0, typeorm_1.Column)('integer', { nullable: true }),
    __metadata("design:type", Object)
], DailyData.prototype, "dailyAlertLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    (0, typeorm_1.Column)('integer', { nullable: true }),
    __metadata("design:type", Object)
], DailyData.prototype, "weeklyAlertLevel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sites_entity_1.Site, { onDelete: 'CASCADE' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", sites_entity_1.Site)
], DailyData.prototype, "site", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DailyData.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DailyData.prototype, "updatedAt", void 0);
DailyData = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)('no_duplicated_date', ['site', 'date'])
], DailyData);
exports.DailyData = DailyData;
