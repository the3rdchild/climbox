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
exports.SensorDataService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sites_entity_1 = require("../sites/sites.entity");
const typeorm_2 = require("typeorm");
const users_entity_1 = require("../users/users.entity");
const sofar_1 = require("../utils/sofar");
let SensorDataService = class SensorDataService {
    constructor(siteRepository) {
        this.siteRepository = siteRepository;
    }
    get(sensorId, startDate, endDate) {
        return (0, sofar_1.sofarSensor)(sensorId, process.env.SOFAR_API_TOKEN, startDate, endDate);
    }
    getSensorInfo(siteId, sensorId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user)
                throw new common_1.UnauthorizedException('Unauthorized');
            if ((!siteId && !sensorId) || (siteId && sensorId))
                throw new common_1.BadRequestException('Provide one of siteId or sensorId');
            const condition = siteId ? { id: siteId } : { sensorId };
            const site = yield this.siteRepository.findOne({
                where: condition,
                relations: ['admins'],
            });
            if (!site ||
                (!site.admins.find((x) => x.id === user.id) &&
                    !(user.adminLevel === users_entity_1.AdminLevel.SuperAdmin)))
                throw new common_1.BadRequestException('Invalid siteId or sensorId');
            if (!site.sensorId)
                throw new common_1.BadRequestException('No deployed spotter for this site');
            return (0, sofar_1.sofarLatest)({
                sensorId: site.sensorId,
                token: process.env.SOFAR_API_TOKEN,
            });
        });
    }
};
SensorDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sites_entity_1.Site)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SensorDataService);
exports.SensorDataService = SensorDataService;
