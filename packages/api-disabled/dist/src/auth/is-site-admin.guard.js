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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsSiteAdminGuard = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const typeorm_2 = require("typeorm");
const users_entity_1 = require("../users/users.entity");
const sites_entity_1 = require("../sites/sites.entity");
let IsSiteAdminGuard = class IsSiteAdminGuard {
    constructor(siteRepository, reflector) {
        this.siteRepository = siteRepository;
        this.reflector = reflector;
    }
    canActivate(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const isPublic = this.reflector.get('isPublic', context.getHandler());
            if (isPublic) {
                return true;
            }
            const request = context.switchToHttp().getRequest();
            const { user } = request;
            const siteId = parseInt(request.params.siteId, 10);
            if (user.adminLevel === users_entity_1.AdminLevel.SuperAdmin) {
                return true;
            }
            if (!Number.isNaN(siteId) && user.adminLevel === users_entity_1.AdminLevel.SiteManager) {
                const isSiteAdmin = yield this.siteRepository
                    .createQueryBuilder('site')
                    .innerJoin('site.admins', 'admins', 'admins.id = :userId', {
                    userId: user.id,
                })
                    .andWhere('site.id = :siteId', { siteId })
                    .getOne();
                return !!isSiteAdmin;
            }
            return false;
        });
    }
};
IsSiteAdminGuard = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(sites_entity_1.Site)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        core_1.Reflector])
], IsSiteAdminGuard);
exports.IsSiteAdminGuard = IsSiteAdminGuard;
