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
exports.UpdateCollectionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const sites_entity_1 = require("../../sites/sites.entity");
const users_entity_1 = require("../../users/users.entity");
const entity_exists_constraint_1 = require("../../validations/entity-exists.constraint");
class UpdateCollectionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, isPublic: { required: false, type: () => Boolean }, userId: { required: false, type: () => Number }, addSiteIds: { required: false, type: () => [Number] }, removeSiteIds: { required: false, type: () => [Number] } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'La Niña heatwave 20/21' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCollectionDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCollectionDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Validate)(entity_exists_constraint_1.EntityExists, [users_entity_1.User]),
    __metadata("design:type", Number)
], UpdateCollectionDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: [1, 3, 4] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.Validate)(entity_exists_constraint_1.EntityExists, [sites_entity_1.Site], { each: true }),
    __metadata("design:type", Array)
], UpdateCollectionDto.prototype, "addSiteIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: [1, 4, 5] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.Validate)(entity_exists_constraint_1.EntityExists, [sites_entity_1.Site], { each: true }),
    __metadata("design:type", Array)
], UpdateCollectionDto.prototype, "removeSiteIds", void 0);
exports.UpdateCollectionDto = UpdateCollectionDto;
