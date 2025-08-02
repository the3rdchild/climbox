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
exports.SiteAudit = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const sites_entity_1 = require("../sites/sites.entity");
var SiteColumn;
(function (SiteColumn) {
    SiteColumn["NAME"] = "name";
    SiteColumn["SENSOR_ID"] = "sensor_id";
    SiteColumn["STATUS"] = "status";
    SiteColumn["VIDEO_STREAM"] = "video_stream";
    SiteColumn["MAX_MONTHLY_MEAN"] = "max_monthly_mean";
    SiteColumn["DISPLAY"] = "display";
    SiteColumn["SOFAR_API_TOKEN"] = "spotter_api_token";
})(SiteColumn || (SiteColumn = {}));
let SiteAudit = class SiteAudit {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, oldValue: { required: true, type: () => String }, newValue: { required: true, type: () => String }, columnName: { required: true, enum: SiteColumn }, site: { required: true, type: () => require("../sites/sites.entity").Site }, createdAt: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SiteAudit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SiteAudit.prototype, "oldValue", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SiteAudit.prototype, "newValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SiteColumn }),
    __metadata("design:type", String)
], SiteAudit.prototype, "columnName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sites_entity_1.Site, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", sites_entity_1.Site)
], SiteAudit.prototype, "site", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SiteAudit.prototype, "createdAt", void 0);
SiteAudit = __decorate([
    (0, typeorm_1.Entity)()
], SiteAudit);
exports.SiteAudit = SiteAudit;
