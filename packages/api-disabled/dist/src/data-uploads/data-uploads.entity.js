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
exports.DataUploads = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
let DataUploads = class DataUploads {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, sensorTypes: { required: true, enum: require("../sites/schemas/source-type.enum").SourceType, isArray: true }, file: { required: true, type: () => String }, signature: { required: true, type: () => String }, minDate: { required: true, type: () => Date }, maxDate: { required: true, type: () => Date }, metrics: { required: true, enum: require("../time-series/metrics.enum").Metric, isArray: true }, fileLocation: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DataUploads.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('character varying', { array: true, nullable: true }),
    __metadata("design:type", Array)
], DataUploads.prototype, "sensorTypes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], DataUploads.prototype, "file", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], DataUploads.prototype, "signature", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Date)
], DataUploads.prototype, "minDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Date)
], DataUploads.prototype, "maxDate", void 0);
__decorate([
    (0, typeorm_1.Column)('character varying', { array: true, nullable: false }),
    __metadata("design:type", Array)
], DataUploads.prototype, "metrics", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DataUploads.prototype, "fileLocation", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DataUploads.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DataUploads.prototype, "updatedAt", void 0);
DataUploads = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['file', 'signature'])
], DataUploads);
exports.DataUploads = DataUploads;
