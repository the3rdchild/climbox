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
exports.RegionsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const regions_service_1 = require("./regions.service");
const create_region_dto_1 = require("./dto/create-region.dto");
const filter_region_dto_1 = require("./dto/filter-region.dto");
const update_region_dto_1 = require("./dto/update-region.dto");
const auth_decorator_1 = require("../auth/auth.decorator");
const users_entity_1 = require("../users/users.entity");
const public_decorator_1 = require("../auth/public.decorator");
const api_response_1 = require("../docs/api-response");
let RegionsController = class RegionsController {
    constructor(regionsService) {
        this.regionsService = regionsService;
    }
    create(createRegionDto) {
        return this.regionsService.create(createRegionDto);
    }
    find(filterRegionDto) {
        return this.regionsService.find(filterRegionDto);
    }
    findOne(id) {
        return this.regionsService.findOne(id);
    }
    update(id, updateRegionDto) {
        return this.regionsService.update(id, updateRegionDto);
    }
    delete(id) {
        return this.regionsService.delete(id);
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Creates new region' }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("./regions.entity").Region }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_region_dto_1.CreateRegionDto]),
    __metadata("design:returntype", Promise)
], RegionsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Returns regions filtered by provided filters' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("./regions.entity").Region] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_region_dto_1.FilterRegionDto]),
    __metadata("design:returntype", Promise)
], RegionsController.prototype, "find", null);
__decorate([
    (0, api_response_1.ApiNestNotFoundResponse)('No region was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Returns specified region' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./regions.entity").Region }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RegionsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No region was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Updates specified region' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, common_1.Put)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./regions.entity").Region }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_region_dto_1.UpdateRegionDto]),
    __metadata("design:returntype", Promise)
], RegionsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No region was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deletes specified region' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RegionsController.prototype, "delete", null);
RegionsController = __decorate([
    (0, swagger_1.ApiTags)('Regions'),
    (0, auth_decorator_1.Auth)(users_entity_1.AdminLevel.SiteManager, users_entity_1.AdminLevel.SuperAdmin),
    (0, common_1.Controller)('regions'),
    __metadata("design:paramtypes", [regions_service_1.RegionsService])
], RegionsController);
exports.RegionsController = RegionsController;
