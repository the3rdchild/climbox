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
exports.UpdateSiteDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const sites_entity_1 = require("../sites.entity");
const entity_exists_constraint_1 = require("../../validations/entity-exists.constraint");
const regions_entity_1 = require("../../regions/regions.entity");
const users_entity_1 = require("../../users/users.entity");
class Coordinates {
    static _OPENAPI_METADATA_FACTORY() {
        return { latitude: { required: true, type: () => Number }, longitude: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15.5416 }),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], Coordinates.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -1.456 }),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], Coordinates.prototype, "longitude", void 0);
class UpdateSiteDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String, maxLength: 100 }, coordinates: { required: false, type: () => Coordinates }, depth: { required: false, type: () => Number }, videoStream: { required: false, type: () => String, nullable: true }, regionId: { required: false, type: () => Number }, adminIds: { required: false, type: () => [Number] }, sensorId: { required: false, type: () => String, maxLength: 100 }, spotterApiToken: { required: false, type: () => String, nullable: true, maxLength: 100 }, status: { required: false, enum: require("../sites.entity").SiteStatus }, display: { required: false, type: () => Boolean }, contactInformation: { required: false, type: () => String, nullable: true, maxLength: 100 }, iframe: { required: false, type: () => String, minLength: 10, maxLength: 200 } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Duxbury Site' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateSiteDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Coordinates),
    __metadata("design:type", Coordinates)
], UpdateSiteDto.prototype, "coordinates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 81 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateSiteDto.prototype, "depth", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", Object)
], UpdateSiteDto.prototype, "videoStream", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Validate)(entity_exists_constraint_1.EntityExists, [regions_entity_1.Region]),
    __metadata("design:type", Number)
], UpdateSiteDto.prototype, "regionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: [1, 2, 3] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.Validate)(entity_exists_constraint_1.EntityExists, [users_entity_1.User], { each: true }),
    __metadata("design:type", Array)
], UpdateSiteDto.prototype, "adminIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SPOT-1742' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateSiteDto.prototype, "sensorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'jl3Xr1kZeqDqs7KAiktXOyr3PlB5Ip' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", Object)
], UpdateSiteDto.prototype, "spotterApiToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'deployed' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(sites_entity_1.SiteStatus),
    __metadata("design:type", String)
], UpdateSiteDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        return [true, 'true', 1, '1'].indexOf(value) > -1;
    }),
    __metadata("design:type", Boolean)
], UpdateSiteDto.prototype, "display", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'email: john@example.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", Object)
], UpdateSiteDto.prototype, "contactInformation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://something.example.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateSiteDto.prototype, "iframe", void 0);
exports.UpdateSiteDto = UpdateSiteDto;
