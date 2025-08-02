"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteApplicationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const site_applications_controller_1 = require("./site-applications.controller");
const site_applications_service_1 = require("./site-applications.service");
const entity_exists_constraint_1 = require("../validations/entity-exists.constraint");
const site_applications_entity_1 = require("./site-applications.entity");
const auth_module_1 = require("../auth/auth.module");
const sites_entity_1 = require("../sites/sites.entity");
let SiteApplicationsModule = class SiteApplicationsModule {
};
SiteApplicationsModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, typeorm_1.TypeOrmModule.forFeature([sites_entity_1.Site, site_applications_entity_1.SiteApplication])],
        controllers: [site_applications_controller_1.SiteApplicationsController],
        providers: [site_applications_service_1.SiteApplicationsService, entity_exists_constraint_1.EntityExists],
    })
], SiteApplicationsModule);
exports.SiteApplicationsModule = SiteApplicationsModule;
