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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReefCheckSurveysController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reef_check_surveys_service_1 = require("./reef-check-surveys.service");
const public_decorator_1 = require("../auth/public.decorator");
const api_response_1 = require("../docs/api-response");
let ReefCheckSurveysController = class ReefCheckSurveysController {
    constructor(surveysService) {
        this.surveysService = surveysService;
    }
    find(siteId) {
        return this.surveysService.find(siteId);
    }
    findOne(id) {
        return this.surveysService.findOne(id);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Returns all reef check site's survey" }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 4236 }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("./reef-check-surveys.entity").ReefCheckSurvey] }),
    __param(0, (0, common_1.Param)('siteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReefCheckSurveysController.prototype, "find", null);
__decorate([
    (0, api_response_1.ApiNestNotFoundResponse)('No reef check survey was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Returns specified reef check survey' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: '12345678-abcd-efgh-12345678' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./reef-check-surveys.entity").ReefCheckSurvey }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReefCheckSurveysController.prototype, "findOne", null);
ReefCheckSurveysController = __decorate([
    (0, swagger_1.ApiTags)('Reef Check Surveys'),
    (0, common_1.Controller)('reef-check-sites/:siteId/surveys'),
    __metadata("design:paramtypes", [reef_check_surveys_service_1.ReefCheckSurveysService])
], ReefCheckSurveysController);
exports.ReefCheckSurveysController = ReefCheckSurveysController;
