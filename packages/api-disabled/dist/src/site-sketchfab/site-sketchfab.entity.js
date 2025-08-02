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
exports.SketchFab = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const sites_entity_1 = require("../sites/sites.entity");
let SketchFab = class SketchFab {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, site: { required: true, type: () => require("../sites/sites.entity").Site }, siteId: { required: true, type: () => Number }, description: { required: true, type: () => String, nullable: true }, scale: { required: true, type: () => Number }, uuid: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SketchFab.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => sites_entity_1.Site, { onDelete: 'CASCADE', nullable: false }),
    (0, typeorm_1.JoinColumn)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", sites_entity_1.Site)
], SketchFab.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.RelationId)((surveyPoint) => surveyPoint.site),
    __metadata("design:type", Number)
], SketchFab.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A 3D model of Keahole Reef in Hawai' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], SketchFab.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], SketchFab.prototype, "scale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '0fd310d08bd6472db293f574da0e200b' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SketchFab.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SketchFab.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SketchFab.prototype, "updatedAt", void 0);
SketchFab = __decorate([
    (0, typeorm_1.Entity)()
], SketchFab);
exports.SketchFab = SketchFab;
