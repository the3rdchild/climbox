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
exports.CreateSiteApplicationDto = exports.CreateSiteDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateSiteDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, latitude: { required: true, type: () => Number }, longitude: { required: true, type: () => Number }, depth: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Duxbury Site' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSiteDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 13.21651 }),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreateSiteDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 132.51651 }),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreateSiteDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSiteDto.prototype, "depth", void 0);
exports.CreateSiteDto = CreateSiteDto;
class CreateSiteApplicationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { permitRequirements: { required: false, type: () => String }, fundingSource: { required: false, type: () => String }, installationSchedule: { required: false, type: () => Date }, installationResources: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Some permit requirements' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSiteApplicationDto.prototype, "permitRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Some funding source' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSiteApplicationDto.prototype, "fundingSource", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateSiteApplicationDto.prototype, "installationSchedule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Some installation resources' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSiteApplicationDto.prototype, "installationResources", void 0);
exports.CreateSiteApplicationDto = CreateSiteApplicationDto;
