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
exports.SiteApplication = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const sites_entity_1 = require("../sites/sites.entity");
const users_entity_1 = require("../users/users.entity");
const urls_1 = require("../utils/urls");
let SiteApplication = class SiteApplication {
    get appId() {
        return (0, urls_1.hashId)(this.id);
    }
    get applied() {
        return !!this.permitRequirements;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, permitRequirements: { required: true, type: () => String, nullable: true }, fundingSource: { required: true, type: () => String, nullable: true }, installationSchedule: { required: true, type: () => Date, nullable: true }, installationResources: { required: true, type: () => String, nullable: true }, targetShipdate: { required: true, type: () => Date, nullable: true }, trackingUrl: { required: true, type: () => String, nullable: true }, uid: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, site: { required: true, type: () => require("../sites/sites.entity").Site }, user: { required: true, type: () => require("../users/users.entity").User } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SiteApplication.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Permit Requirements' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], SiteApplication.prototype, "permitRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Funding Source' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], SiteApplication.prototype, "fundingSource", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'timestamp' }),
    __metadata("design:type", Object)
], SiteApplication.prototype, "installationSchedule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Installation Resource' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], SiteApplication.prototype, "installationResources", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'timestamp' }),
    __metadata("design:type", Object)
], SiteApplication.prototype, "targetShipdate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tracking URL' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'character varying' }),
    __metadata("design:type", Object)
], SiteApplication.prototype, "trackingUrl", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ unique: true }),
    (0, typeorm_1.Generated)('uuid'),
    __metadata("design:type", String)
], SiteApplication.prototype, "uid", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SiteApplication.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SiteApplication.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => sites_entity_1.Site, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", sites_entity_1.Site)
], SiteApplication.prototype, "site", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", users_entity_1.User)
], SiteApplication.prototype, "user", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], SiteApplication.prototype, "appId", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], SiteApplication.prototype, "applied", null);
SiteApplication = __decorate([
    (0, typeorm_1.Entity)()
], SiteApplication);
exports.SiteApplication = SiteApplication;
