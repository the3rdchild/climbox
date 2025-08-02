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
exports.TimeSeries = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const data_uploads_entity_1 = require("../data-uploads/data-uploads.entity");
const sources_entity_1 = require("../sites/sources.entity");
const metrics_enum_1 = require("./metrics.enum");
let TimeSeries = class TimeSeries {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, timestamp: { required: true, type: () => Date }, value: { required: true, type: () => Number }, metric: { required: true, enum: require("./metrics.enum").Metric }, source: { required: true, type: () => require("../sites/sources.entity").Sources, nullable: true }, dataUpload: { required: true, type: () => require("../data-uploads/data-uploads.entity").DataUploads, nullable: true }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TimeSeries.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Date)
], TimeSeries.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 11.05 }),
    (0, typeorm_1.Column)({ type: 'float', nullable: false }),
    __metadata("design:type", Number)
], TimeSeries.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: metrics_enum_1.Metric, nullable: false }),
    __metadata("design:type", String)
], TimeSeries.prototype, "metric", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sources_entity_1.Sources, { onDelete: 'CASCADE', nullable: false }),
    __metadata("design:type", Object)
], TimeSeries.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => data_uploads_entity_1.DataUploads, { onDelete: 'CASCADE', nullable: true }),
    __metadata("design:type", Object)
], TimeSeries.prototype, "dataUpload", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TimeSeries.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TimeSeries.prototype, "updatedAt", void 0);
TimeSeries = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)('no_duplicate_data', ['metric', 'source', 'timestamp'])
    // https://github.com/typeorm/typeorm/issues/3336
    // CREATE INDEX "IDX_cb2f3e83c09f83e8ce007ffd6f" ON "time_series" ("metric", "source_id", "timestamp" DESC)
    ,
    (0, typeorm_1.Index)('IDX_time_series_metric_source_timestamp_DESC', { synchronize: false })
], TimeSeries);
exports.TimeSeries = TimeSeries;
