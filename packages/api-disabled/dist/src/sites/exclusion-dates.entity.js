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
exports.ExclusionDates = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let ExclusionDates = class ExclusionDates {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, sensorId: { required: true, type: () => String }, startDate: { required: true, type: () => Date, nullable: true }, endDate: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ExclusionDates.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SPOT-0000' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExclusionDates.prototype, "sensorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'timestamp' }),
    __metadata("design:type", Object)
], ExclusionDates.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ExclusionDates.prototype, "endDate", void 0);
ExclusionDates = __decorate([
    (0, typeorm_1.Entity)()
], ExclusionDates);
exports.ExclusionDates = ExclusionDates;
