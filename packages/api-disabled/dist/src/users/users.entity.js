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
exports.User = exports.AdminLevel = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const sites_entity_1 = require("../sites/sites.entity");
const api_properties_1 = require("../docs/api-properties");
var AdminLevel;
(function (AdminLevel) {
    AdminLevel["Default"] = "default";
    AdminLevel["SiteManager"] = "site_manager";
    AdminLevel["SuperAdmin"] = "super_admin";
})(AdminLevel = exports.AdminLevel || (exports.AdminLevel = {}));
let User = class User {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, fullName: { required: false, type: () => String, nullable: true }, email: { required: true, type: () => String }, organization: { required: true, type: () => String, nullable: true }, location: { required: true, type: () => Object, nullable: true }, country: { required: true, type: () => String, nullable: true }, adminLevel: { required: true, enum: require("./users.entity").AdminLevel }, description: { required: true, type: () => String, nullable: true }, imageUrl: { required: true, type: () => String, nullable: true }, administeredSites: { required: true, type: () => [require("../sites/sites.entity").Site] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying', select: false }),
    __metadata("design:type", Object)
], User.prototype, "firebaseUid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Full Name' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], User.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fullname@example.com' }),
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Random organization' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], User.prototype, "organization", void 0);
__decorate([
    (0, api_properties_1.ApiPointProperty)(),
    (0, typeorm_1.Column)({
        type: 'geometry',
        spatialFeatureType: 'Point',
        nullable: true,
        srid: 4326,
    }),
    (0, typeorm_1.Index)({ spatial: true }),
    __metadata("design:type", Object)
], User.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Some country' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], User.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AdminLevel,
        default: AdminLevel.Default,
        nullable: false,
    }),
    __metadata("design:type", String)
], User.prototype, "adminLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Some description' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], User.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'http://some-sample-url.com' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], User.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.ManyToMany)(() => sites_entity_1.Site, (site) => site.admins, { cascade: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], User.prototype, "administeredSites", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    (0, typeorm_1.Entity)({ name: 'users' })
], User);
exports.User = User;
