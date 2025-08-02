"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sites_entity_1 = require("../sites/sites.entity");
const sources_entity_1 = require("../sites/sources.entity");
const latest_data_entity_1 = require("../time-series/latest-data.entity");
const entity_exists_constraint_1 = require("../validations/entity-exists.constraint");
const collections_controller_1 = require("./collections.controller");
const collections_entity_1 = require("./collections.entity");
const collections_service_1 = require("./collections.service");
let CollectionsModule = class CollectionsModule {
};
CollectionsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([collections_entity_1.Collection, latest_data_entity_1.LatestData, sites_entity_1.Site, sources_entity_1.Sources])],
        controllers: [collections_controller_1.CollectionsController],
        providers: [collections_service_1.CollectionsService, entity_exists_constraint_1.EntityExists],
    })
], CollectionsModule);
exports.CollectionsModule = CollectionsModule;
