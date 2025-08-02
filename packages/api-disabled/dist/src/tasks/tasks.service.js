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
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const surveys_entity_1 = require("../surveys/surveys.entity");
const tasks_constants_1 = require("./tasks.constants");
let TasksService = TasksService_1 = class TasksService {
    constructor(surveyRepository) {
        this.surveyRepository = surveyRepository;
        this.logger = new common_1.Logger(TasksService_1.name);
    }
    // Run task every 2 hours at 00 minutes.
    deleteEmptySurveys() {
        return __awaiter(this, void 0, void 0, function* () {
            const emptySurveys = yield this.surveyRepository
                .createQueryBuilder('survey')
                .leftJoin('survey.surveyMedia', 'surveyMedia')
                .where('surveyMedia.id is NULL')
                .andWhere("survey.createdAt < now() - INTERVAL '2 hour'")
                .select('survey.id')
                .getMany();
            const emptyKeys = emptySurveys.map((survey) => survey.id);
            if (emptySurveys.length) {
                const results = yield this.surveyRepository
                    .createQueryBuilder('survey')
                    .where('survey.id IN (:...ids)', { ids: emptyKeys })
                    .delete()
                    .execute();
                this.logger.log(`Deleted ${results.affected} empty survey(s).`);
            }
            else {
                this.logger.debug('No empty surveys to delete.');
            }
        });
    }
};
__decorate([
    (0, schedule_1.Cron)('0 */2 * * *', { name: tasks_constants_1.CronJobs.DeleteEmptySurveys }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "deleteEmptySurveys", null);
TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(surveys_entity_1.Survey)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TasksService);
exports.TasksService = TasksService;
