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
var Region_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Region = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const api_properties_1 = require("../docs/api-properties");
let Region = Region_1 = class Region {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, polygon: { required: true, type: () => Object, nullable: true }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, parent: { required: true, type: () => require("./regions.entity").Region, nullable: true }, parentId: { required: false, type: () => Number } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Region.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'United States' }),
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Region.prototype, "name", void 0);
__decorate([
    (0, api_properties_1.ApiPointProperty)(),
    (0, typeorm_1.Column)({
        type: 'geometry',
        spatialFeatureType: 'Point',
        unique: true,
        srid: 4326,
        nullable: false,
    }),
    (0, typeorm_1.Index)({ spatial: true }),
    __metadata("design:type", Object)
], Region.prototype, "polygon", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Region.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Region.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Region_1 }),
    (0, typeorm_1.ManyToOne)(() => Region_1, { onDelete: 'CASCADE', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Object)
], Region.prototype, "parent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.RelationId)((region) => region.parent),
    __metadata("design:type", Number)
], Region.prototype, "parentId", void 0);
Region = Region_1 = __decorate([
    (0, typeorm_1.Entity)()
], Region);
exports.Region = Region;
