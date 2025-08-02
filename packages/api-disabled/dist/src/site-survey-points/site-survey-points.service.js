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
exports.SiteSurveyPointsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const lodash_1 = require("lodash");
const site_survey_points_entity_1 = require("./site-survey-points.entity");
const coordinates_1 = require("../utils/coordinates");
let SiteSurveyPointsService = class SiteSurveyPointsService {
    constructor(surveyPointsRepository) {
        this.surveyPointsRepository = surveyPointsRepository;
    }
    create(createSiteSurveyPointDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { latitude, longitude, siteId } = createSiteSurveyPointDto;
            const polygon = longitude !== undefined && latitude !== undefined
                ? (0, coordinates_1.createPoint)(longitude, latitude)
                : undefined;
            return this.surveyPointsRepository.save(Object.assign(Object.assign({}, createSiteSurveyPointDto), { site: { id: siteId }, polygon }));
        });
    }
    find(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.surveyPointsRepository.createQueryBuilder('survey_point');
            if (filter.name) {
                query.andWhere('(lower(survey_point.name) LIKE :name)', {
                    name: `%${filter.name.toLowerCase()}%`,
                });
            }
            if (filter.siteId) {
                query.andWhere('survey_point.site_id = :site', {
                    site: filter.siteId,
                });
            }
            query.leftJoinAndSelect('survey_point.site', 'site');
            return query.getMany();
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield this.surveyPointsRepository.findOne({
                where: { id },
                relations: ['site'],
            });
            if (!found) {
                throw new common_1.NotFoundException(`Site Point of Interest with ID ${id} not found.`);
            }
            return found;
        });
    }
    update(id, updateSiteSurveyPointDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { latitude, longitude, siteId } = updateSiteSurveyPointDto;
            const polygon = longitude !== undefined && latitude !== undefined
                ? {
                    polygon: (0, coordinates_1.createPoint)(longitude, latitude),
                }
                : {};
            const updateSite = siteId !== undefined ? { site: { id: siteId } } : {};
            const result = yield this.surveyPointsRepository.update(id, Object.assign(Object.assign(Object.assign({}, (0, lodash_1.omit)(updateSiteSurveyPointDto, 'longitude', 'latitude', 'siteId')), updateSite), polygon));
            if (!result.affected) {
                throw new common_1.NotFoundException(`Site Point of Interest with ID ${id} not found.`);
            }
            const updated = yield this.surveyPointsRepository.findOneBy({ id });
            return updated;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.surveyPointsRepository.delete(id);
            if (!result.affected) {
                throw new common_1.NotFoundException(`Site Point of Interest with ID ${id} not found.`);
            }
        });
    }
};
SiteSurveyPointsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(site_survey_points_entity_1.SiteSurveyPoint)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SiteSurveyPointsService);
exports.SiteSurveyPointsService = SiteSurveyPointsService;
