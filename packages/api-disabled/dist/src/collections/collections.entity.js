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
exports.Collection = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const sites_entity_1 = require("../sites/sites.entity");
const users_entity_1 = require("../users/users.entity");
let Collection = class Collection {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, isPublic: { required: true, type: () => Boolean }, user: { required: true, type: () => require("../users/users.entity").User }, userId: { required: true, type: () => Number }, sites: { required: true, type: () => [require("../sites/sites.entity").Site] }, siteIds: { required: true, type: () => [Number] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Collection.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'La Niña heatwave 20/21' }),
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Collection.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: false }),
    __metadata("design:type", Boolean)
], Collection.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", users_entity_1.User)
], Collection.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.RelationId)((collection) => collection.user),
    __metadata("design:type", Number)
], Collection.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => sites_entity_1.Site),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Collection.prototype, "sites", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: [1, 2, 3] }),
    (0, typeorm_1.RelationId)((collection) => collection.sites),
    __metadata("design:type", Array)
], Collection.prototype, "siteIds", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Collection.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Collection.prototype, "updatedAt", void 0);
Collection = __decorate([
    (0, typeorm_1.Entity)()
], Collection);
exports.Collection = Collection;
