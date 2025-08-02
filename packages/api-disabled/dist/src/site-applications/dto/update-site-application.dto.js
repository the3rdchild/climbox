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
exports.UpdateSiteApplicationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UpdateSiteApplicationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { permitRequirements: { required: true, type: () => String }, fundingSource: { required: true, type: () => String }, installationSchedule: { required: false, type: () => Date }, installationResources: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Permit requirements' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateSiteApplicationDto.prototype, "permitRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Funding Source' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateSiteApplicationDto.prototype, "fundingSource", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateSiteApplicationDto.prototype, "installationSchedule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Installation Resources' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateSiteApplicationDto.prototype, "installationResources", void 0);
exports.UpdateSiteApplicationDto = UpdateSiteApplicationDto;
