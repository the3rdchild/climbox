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
exports.Monitoring = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const sites_entity_1 = require("../sites/sites.entity");
const users_entity_1 = require("../users/users.entity");
const monitoring_metric_enum_1 = require("./schemas/monitoring-metric.enum");
let Monitoring = class Monitoring {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, metric: { required: true, enum: require("./schemas/monitoring-metric.enum").MonitoringMetric }, user: { required: true, type: () => require("../users/users.entity").User }, site: { required: true, type: () => require("../sites/sites.entity").Site }, timestamp: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Monitoring.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: monitoring_metric_enum_1.MonitoringMetric, nullable: false }),
    __metadata("design:type", String)
], Monitoring.prototype, "metric", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", users_entity_1.User)
], Monitoring.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sites_entity_1.Site, { onDelete: 'CASCADE', nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'site_id' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", sites_entity_1.Site)
], Monitoring.prototype, "site", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'timestamp' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], Monitoring.prototype, "timestamp", void 0);
Monitoring = __decorate([
    (0, typeorm_1.Entity)()
], Monitoring);
exports.Monitoring = Monitoring;
