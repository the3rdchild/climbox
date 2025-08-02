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
exports.SurveysController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const auth_decorator_1 = require("../auth/auth.decorator");
const users_entity_1 = require("../users/users.entity");
const create_survey_dto_1 = require("./dto/create-survey.dto");
const surveys_service_1 = require("./surveys.service");
const create_survey_media_dto_1 = require("./dto/create-survey-media.dto");
const edit_survey_dto_1 = require("./dto/edit-survey.dto");
const edit_survey_media_dto_1 = require("./dto/edit-survey-media.dto");
const is_site_admin_guard_1 = require("../auth/is-site-admin.guard");
const public_decorator_1 = require("../auth/public.decorator");
const api_properties_1 = require("../docs/api-properties");
const api_response_1 = require("../docs/api-response");
const file_filter_1 = require("../uploads/file.filter");
let SurveysController = class SurveysController {
    constructor(surveyService) {
        this.surveyService = surveyService;
    }
    upload(siteId, file) {
        return this.surveyService.upload(file);
    }
    create(createSurveyDto, siteId, req) {
        return this.surveyService.create(createSurveyDto, req.user, siteId);
    }
    createMedia(createSurveyMediaDto, siteId, surveyId) {
        return this.surveyService.createMedia(createSurveyMediaDto, surveyId);
    }
    find(siteId) {
        return this.surveyService.find(siteId);
    }
    findOne(siteId, surveyId) {
        return this.surveyService.findOne(surveyId);
    }
    findMedia(siteId, surveyId) {
        return this.surveyService.findMedia(surveyId);
    }
    updateMedia(siteId, mediaId, editSurveyMediaDto) {
        return this.surveyService.updateMedia(editSurveyMediaDto, mediaId);
    }
    update(siteId, surveyId, editSurveyDto) {
        return this.surveyService.update(editSurveyDto, surveyId);
    }
    delete(siteId, surveyId) {
        return this.surveyService.delete(surveyId);
    }
    deleteMedia(siteId, mediaId) {
        return this.surveyService.deleteMedia(mediaId);
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_properties_1.ApiFileUpload)(),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Returns the public url to access the uploaded media',
        schema: {
            type: 'string',
            example: 'https://storage.googleapis.com/storage/reef-image-1029381082910831.jpg',
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Uploads a new survey media' }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { fileFilter: (0, file_filter_1.fileFilter)(['image', 'video']) })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('siteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SurveysController.prototype, "upload", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No site was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Creates a new survey' }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("./surveys.entity").Survey }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('siteId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_survey_dto_1.CreateSurveyDto, Number, Object]),
    __metadata("design:returntype", Promise)
], SurveysController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No survey was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Creates a new survey media' }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, common_1.Post)(':id/media'),
    openapi.ApiResponse({ status: 201, type: require("./survey-media.entity").SurveyMedia }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('siteId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_survey_media_dto_1.CreateSurveyMediaDto, Number, Number]),
    __metadata("design:returntype", Promise)
], SurveysController.prototype, "createMedia", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Returns all site's survey" }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("./surveys.entity").Survey] }),
    __param(0, (0, common_1.Param)('siteId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SurveysController.prototype, "find", null);
__decorate([
    (0, api_response_1.ApiNestNotFoundResponse)('No survey was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Returns specified survey' }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./surveys.entity").Survey }),
    __param(0, (0, common_1.Param)('siteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SurveysController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Returns all media of a specified survey' }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id/media'),
    openapi.ApiResponse({ status: 200, type: [require("./survey-media.entity").SurveyMedia] }),
    __param(0, (0, common_1.Param)('siteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SurveysController.prototype, "findMedia", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No survey media was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Updates a specified survey media' }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, common_1.Put)('media/:id'),
    openapi.ApiResponse({ status: 200, type: require("./survey-media.entity").SurveyMedia }),
    __param(0, (0, common_1.Param)('siteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, edit_survey_media_dto_1.EditSurveyMediaDto]),
    __metadata("design:returntype", Promise)
], SurveysController.prototype, "updateMedia", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No survey was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Updates a specified survey' }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, common_1.Put)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./surveys.entity").Survey }),
    __param(0, (0, common_1.Param)('siteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, edit_survey_dto_1.EditSurveyDto]),
    __metadata("design:returntype", Promise)
], SurveysController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No survey was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deletes a specified survey' }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('siteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SurveysController.prototype, "delete", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No survey media was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deletes a specified survey media' }),
    (0, swagger_1.ApiParam)({ name: 'siteId', example: 1 }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, common_1.Delete)('media/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('siteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SurveysController.prototype, "deleteMedia", null);
SurveysController = __decorate([
    (0, swagger_1.ApiTags)('Surveys'),
    (0, common_1.UseGuards)(is_site_admin_guard_1.IsSiteAdminGuard),
    (0, auth_decorator_1.Auth)(users_entity_1.AdminLevel.SiteManager, users_entity_1.AdminLevel.SuperAdmin),
    (0, common_1.Controller)('sites/:siteId/surveys'),
    __metadata("design:paramtypes", [surveys_service_1.SurveysService])
], SurveysController);
exports.SurveysController = SurveysController;
