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
exports.UpdateRegionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const api_properties_1 = require("../../docs/api-properties");
const entity_exists_constraint_1 = require("../../validations/entity-exists.constraint");
const regions_entity_1 = require("../regions.entity");
class UpdateRegionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, polygon: { required: false, type: () => Object }, parentId: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'United States' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateRegionDto.prototype, "name", void 0);
__decorate([
    (0, api_properties_1.ApiPointProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], UpdateRegionDto.prototype, "polygon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Validate)(entity_exists_constraint_1.EntityExists, [regions_entity_1.Region]),
    __metadata("design:type", Number)
], UpdateRegionDto.prototype, "parentId", void 0);
exports.UpdateRegionDto = UpdateRegionDto;
