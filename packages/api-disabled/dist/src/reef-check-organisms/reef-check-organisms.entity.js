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
exports.ReefCheckOrganism = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const reef_check_surveys_entity_1 = require("../reef-check-surveys/reef-check-surveys.entity");
let ReefCheckOrganism = class ReefCheckOrganism {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, surveyId: { required: true, type: () => String }, survey: { required: true, type: () => require("../reef-check-surveys/reef-check-surveys.entity").ReefCheckSurvey }, date: { required: true, type: () => Date }, organism: { required: true, type: () => String }, type: { required: true, type: () => String }, s1: { required: true, type: () => Number }, s2: { required: true, type: () => Number }, s3: { required: true, type: () => Number }, s4: { required: true, type: () => Number }, recordedBy: { required: true, type: () => String }, errors: { required: true, type: () => String } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReefCheckOrganism.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReefCheckOrganism.prototype, "surveyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.ManyToOne)(() => reef_check_surveys_entity_1.ReefCheckSurvey, { nullable: false }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", reef_check_surveys_entity_1.ReefCheckSurvey)
], ReefCheckOrganism.prototype, "survey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ReefCheckOrganism.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReefCheckOrganism.prototype, "organism", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReefCheckOrganism.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ReefCheckOrganism.prototype, "s1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ReefCheckOrganism.prototype, "s2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ReefCheckOrganism.prototype, "s3", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ReefCheckOrganism.prototype, "s4", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckOrganism.prototype, "recordedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReefCheckOrganism.prototype, "errors", void 0);
ReefCheckOrganism = __decorate([
    (0, typeorm_1.Entity)()
], ReefCheckOrganism);
exports.ReefCheckOrganism = ReefCheckOrganism;
