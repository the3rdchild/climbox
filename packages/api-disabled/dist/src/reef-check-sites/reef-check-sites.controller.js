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
exports.ReefCheckSitesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reef_check_sites_service_1 = require("./reef-check-sites.service");
const public_decorator_1 = require("../auth/public.decorator");
const api_response_1 = require("../docs/api-response");
let ReefCheckSitesController = class ReefCheckSitesController {
    constructor(sitesService) {
        this.sitesService = sitesService;
    }
    findOne(id) {
        return this.sitesService.findOne(id);
    }
};
__decorate([
    (0, api_response_1.ApiNestNotFoundResponse)('No reef check site was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Returns specified reef check site' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: '12345678-abcd-efgh-12345678' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./reef-check-sites.entity").ReefCheckSite }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReefCheckSitesController.prototype, "findOne", null);
ReefCheckSitesController = __decorate([
    (0, swagger_1.ApiTags)('Reef Check Sites'),
    (0, common_1.Controller)('reef-check-sites'),
    __metadata("design:paramtypes", [reef_check_sites_service_1.ReefCheckSitesService])
], ReefCheckSitesController);
exports.ReefCheckSitesController = ReefCheckSitesController;
