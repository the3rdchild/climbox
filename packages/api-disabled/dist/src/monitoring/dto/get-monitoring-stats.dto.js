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
exports.GetMonitoringStatsDto = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const sites_entity_1 = require("../../sites/sites.entity");
const entity_exists_constraint_1 = require("../../validations/entity-exists.constraint");
const maxAllowedIds = 10;
class GetMonitoringStatsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { siteIds: { required: false, type: () => [Number] }, spotterId: { required: false, type: () => String }, monthly: { required: false, type: () => Boolean }, start: { required: false, type: () => Date }, end: { required: false, type: () => Date }, csv: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: [1, 3, 5] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        try {
            const splitted = value.split(',');
            if (splitted.length > maxAllowedIds) {
                throw new common_1.BadRequestException(`siteIds: Too many IDs. Maximum allowed: ${maxAllowedIds}.`);
            }
            return splitted.map((x) => parseInt(x, 10));
        }
        catch (error) {
            throw new common_1.BadRequestException('siteIds: invalid format');
        }
    }),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.Validate)(entity_exists_constraint_1.EntityExists, [sites_entity_1.Site], { each: true }),
    __metadata("design:type", Array)
], GetMonitoringStatsDto.prototype, "siteIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SPOT-2742' }),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetMonitoringStatsDto.prototype, "spotterId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        return [true, 'true', 1, '1'].indexOf(value) > -1;
    }),
    __metadata("design:type", Boolean)
], GetMonitoringStatsDto.prototype, "monthly", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GetMonitoringStatsDto.prototype, "start", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GetMonitoringStatsDto.prototype, "end", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        return [true, 'true', 1, '1'].indexOf(value) > -1;
    }),
    __metadata("design:type", Boolean)
], GetMonitoringStatsDto.prototype, "csv", void 0);
exports.GetMonitoringStatsDto = GetMonitoringStatsDto;
