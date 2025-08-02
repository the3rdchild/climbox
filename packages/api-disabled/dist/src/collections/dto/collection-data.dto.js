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
exports.CollectionDataDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class CollectionDataDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { bottomTemperature: { required: false, type: () => Number }, topTemperature: { required: false, type: () => Number }, satelliteTemperature: { required: false, type: () => Number }, dhw: { required: false, type: () => Number }, tempAlert: { required: false, type: () => Number }, tempWeeklyAlert: { required: false, type: () => Number }, sstAnomaly: { required: false, type: () => Number }, significantWaveHeight: { required: false, type: () => Number }, waveMeanDirection: { required: false, type: () => Number }, waveMeanPeriod: { required: false, type: () => Number }, wavePeakPeriod: { required: false, type: () => Number }, windDirection: { required: false, type: () => Number }, windSpeed: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 28.05 }),
    __metadata("design:type", Number)
], CollectionDataDto.prototype, "bottomTemperature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 29.05 }),
    __metadata("design:type", Number)
], CollectionDataDto.prototype, "topTemperature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 29.13 }),
    __metadata("design:type", Number)
], CollectionDataDto.prototype, "satelliteTemperature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    __metadata("design:type", Number)
], CollectionDataDto.prototype, "dhw", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    __metadata("design:type", Number)
], CollectionDataDto.prototype, "tempAlert", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    __metadata("design:type", Number)
], CollectionDataDto.prototype, "tempWeeklyAlert", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: -0.101 }),
    __metadata("design:type", Number)
], CollectionDataDto.prototype, "sstAnomaly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1.32 }),
    __metadata("design:type", Number)
], CollectionDataDto.prototype, "significantWaveHeight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2 }),
    __metadata("design:type", Number)
], CollectionDataDto.prototype, "waveMeanDirection", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12 }),
    __metadata("design:type", Number)
], CollectionDataDto.prototype, "waveMeanPeriod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12 }),
    __metadata("design:type", Number)
], CollectionDataDto.prototype, "wavePeakPeriod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 153 }),
    __metadata("design:type", Number)
], CollectionDataDto.prototype, "windDirection", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10.4 }),
    __metadata("design:type", Number)
], CollectionDataDto.prototype, "windSpeed", void 0);
exports.CollectionDataDto = CollectionDataDto;
