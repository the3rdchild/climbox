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
var ReefCheckSurveysService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReefCheckSurveysService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const site_utils_1 = require("../utils/site.utils");
const reef_check_surveys_entity_1 = require("./reef-check-surveys.entity");
let ReefCheckSurveysService = ReefCheckSurveysService_1 = class ReefCheckSurveysService {
    constructor(reefCheckSurveyRepository) {
        this.reefCheckSurveyRepository = reefCheckSurveyRepository;
        this.logger = new common_1.Logger(ReefCheckSurveysService_1.name);
    }
    find(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reefCheckSurveyRepository.find({
                where: { siteId },
                relations: ['organisms', 'substrates', 'reefCheckSite'],
            });
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reefCheckSurvey = yield this.reefCheckSurveyRepository.findOne({
                where: { id },
                relations: ['organisms', 'substrates', 'reefCheckSite'],
                // Using getAllColumns to include VirtualColumns - they are not included by default
                select: (0, site_utils_1.getAllColumns)(this.reefCheckSurveyRepository),
            });
            if (!reefCheckSurvey) {
                throw new common_1.NotFoundException(`No site was found with the specified id`);
            }
            return reefCheckSurvey;
        });
    }
};
ReefCheckSurveysService = ReefCheckSurveysService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reef_check_surveys_entity_1.ReefCheckSurvey)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReefCheckSurveysService);
exports.ReefCheckSurveysService = ReefCheckSurveysService;
