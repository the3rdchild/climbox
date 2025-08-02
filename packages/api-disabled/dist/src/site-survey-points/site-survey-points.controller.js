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
exports.SiteSurveyPointsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const site_survey_points_service_1 = require("./site-survey-points.service");
const create_survey_point_dto_1 = require("./dto/create-survey-point.dto");
const filter_survey_point_dto_1 = require("./dto/filter-survey-point.dto");
const update_survey_point_dto_1 = require("./dto/update-survey-point.dto");
const users_entity_1 = require("../users/users.entity");
const auth_decorator_1 = require("../auth/auth.decorator");
const public_decorator_1 = require("../auth/public.decorator");
const api_response_1 = require("../docs/api-response");
let SiteSurveyPointsController = class SiteSurveyPointsController {
    constructor(surveyPointsService) {
        this.surveyPointsService = surveyPointsService;
    }
    create(createSiteSurveyPointDto) {
        return this.surveyPointsService.create(createSiteSurveyPointDto);
    }
    find(filterSiteSurveyPointDto) {
        return this.surveyPointsService.find(filterSiteSurveyPointDto);
    }
    findOne(id) {
        return this.surveyPointsService.findOne(id);
    }
    update(id, updateSiteSurveyPointDto) {
        return this.surveyPointsService.update(id, updateSiteSurveyPointDto);
    }
    delete(id) {
        return this.surveyPointsService.delete(id);
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Creates a new site point of interest' }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("./site-survey-points.entity").SiteSurveyPoint }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_survey_point_dto_1.CreateSiteSurveyPointDto]),
    __metadata("design:returntype", Promise)
], SiteSurveyPointsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Returns site points of interest filtered by the provided filters',
    }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("./site-survey-points.entity").SiteSurveyPoint] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_survey_point_dto_1.FilterSiteSurveyPointDto]),
    __metadata("design:returntype", Promise)
], SiteSurveyPointsController.prototype, "find", null);
__decorate([
    (0, api_response_1.ApiNestNotFoundResponse)('No site point of interest was found with the specified id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Returns specified site point of interest',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./site-survey-points.entity").SiteSurveyPoint }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SiteSurveyPointsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No site point of interest was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Updates specified site point of interest' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, common_1.Put)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./site-survey-points.entity").SiteSurveyPoint }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_survey_point_dto_1.UpdateSiteSurveyPointDto]),
    __metadata("design:returntype", Promise)
], SiteSurveyPointsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No site point of interest was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deletes specified site point of interest' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SiteSurveyPointsController.prototype, "delete", null);
SiteSurveyPointsController = __decorate([
    (0, swagger_1.ApiTags)('Site Points of Interest'),
    (0, auth_decorator_1.Auth)(users_entity_1.AdminLevel.SiteManager, users_entity_1.AdminLevel.SuperAdmin),
    (0, common_1.Controller)('site-survey-points'),
    __metadata("design:paramtypes", [site_survey_points_service_1.SiteSurveyPointsService])
], SiteSurveyPointsController);
exports.SiteSurveyPointsController = SiteSurveyPointsController;
