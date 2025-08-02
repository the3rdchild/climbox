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
exports.CollectionsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/auth.decorator");
const collection_guard_1 = require("../auth/collection.guard");
const public_decorator_1 = require("../auth/public.decorator");
const api_response_1 = require("../docs/api-response");
const collections_service_1 = require("./collections.service");
const create_collection_dto_1 = require("./dto/create-collection.dto");
const filter_collection_dto_1 = require("./dto/filter-collection.dto");
const update_collection_dto_1 = require("./dto/update-collection.dto");
let CollectionsController = class CollectionsController {
    constructor(collectionsService) {
        this.collectionsService = collectionsService;
    }
    create(createCollectionDto, request) {
        return this.collectionsService.create(createCollectionDto, request.user);
    }
    find(filterCollectionDto, request) {
        return this.collectionsService.find(filterCollectionDto, request.user);
    }
    getHeatStressTracker() {
        return this.collectionsService.getHeatStressTracker();
    }
    findPublic(filterCollectionDto) {
        return this.collectionsService.find(filterCollectionDto);
    }
    findOnePublic(collectionId) {
        return this.collectionsService.findOne(collectionId, true);
    }
    findOne(collectionId) {
        return this.collectionsService.findOne(collectionId);
    }
    update(collectionId, updateCollectionDto) {
        return this.collectionsService.update(collectionId, updateCollectionDto);
    }
    delete(collectionId) {
        return this.collectionsService.delete(collectionId);
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Creates a new collection' }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("./collections.entity").Collection }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_collection_dto_1.CreateCollectionDto, Object]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Fetch all user's private collections" }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("./collections.entity").Collection] }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_collection_dto_1.FilterCollectionDto, Object]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "find", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Fetch the heat stress tracker' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('heat-stress-tracker'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "getHeatStressTracker", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Fetch all public collections' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public'),
    openapi.ApiResponse({ status: 200, type: [require("./collections.entity").Collection] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_collection_dto_1.FilterCollectionDto]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "findPublic", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Fetch detailed data from specified public collection',
    }),
    (0, api_response_1.ApiNestNotFoundResponse)('No collection was found with the specified id'),
    (0, swagger_1.ApiParam)({ name: 'collectionId', example: 1 }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public/:collectionId'),
    openapi.ApiResponse({ status: 200, type: require("./collections.entity").Collection }),
    __param(0, (0, common_1.Param)('collectionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "findOnePublic", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Fetch detailed data from specified private collection',
    }),
    (0, api_response_1.ApiNestNotFoundResponse)('No collection was found with the specified id'),
    (0, api_response_1.ApiNestUnauthorizedResponse)('Collection selected is not public'),
    (0, swagger_1.ApiParam)({ name: 'collectionId', example: 1 }),
    (0, common_1.UseGuards)(collection_guard_1.CollectionGuard),
    (0, common_1.Get)(':collectionId'),
    openapi.ApiResponse({ status: 200, type: require("./collections.entity").Collection }),
    __param(0, (0, common_1.Param)('collectionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update specified collection' }),
    (0, api_response_1.ApiNestNotFoundResponse)('No collection was found with the specified id'),
    (0, swagger_1.ApiParam)({ name: 'collectionId', example: 1 }),
    (0, common_1.UseGuards)(collection_guard_1.CollectionGuard),
    (0, common_1.Put)(':collectionId'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('collectionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_collection_dto_1.UpdateCollectionDto]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete specified collection' }),
    (0, api_response_1.ApiNestNotFoundResponse)('No collection was found with the specified id'),
    (0, swagger_1.ApiParam)({ name: 'collectionId', example: 1 }),
    (0, common_1.UseGuards)(collection_guard_1.CollectionGuard),
    (0, common_1.Delete)(':collectionId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('collectionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "delete", null);
CollectionsController = __decorate([
    (0, swagger_1.ApiTags)('Collections'),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Controller)('collections'),
    __metadata("design:paramtypes", [collections_service_1.CollectionsService])
], CollectionsController);
exports.CollectionsController = CollectionsController;
