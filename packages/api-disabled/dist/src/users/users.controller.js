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
exports.UsersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const users_entity_1 = require("./users.entity");
const create_user_dto_1 = require("./dto/create-user.dto");
const auth_decorator_1 = require("../auth/auth.decorator");
const override_level_access_decorator_1 = require("../auth/override-level-access.decorator");
const public_decorator_1 = require("../auth/public.decorator");
const api_response_1 = require("../docs/api-response");
const set_admin_level_dto_1 = require("./dto/set-admin-level.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(req, createUserDto) {
        return this.usersService.create(req, createUserDto);
    }
    getSelf(req) {
        return this.usersService.getSelf(req);
    }
    setAdminLevel(id, setAdminLevelDto) {
        return this.usersService.setAdminLevel(id, setAdminLevelDto.level);
    }
    delete(id) {
        return this.usersService.delete(id);
    }
    getAdministeredSites(req) {
        return this.usersService.getAdministeredSites(req);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Creates a new user' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("./users.entity").User }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Returns the currently signed in user' }),
    (0, common_1.Get)('current'),
    openapi.ApiResponse({ status: 200, type: require("./users.entity").User }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getSelf", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No user was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Updates the access level of a user' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, override_level_access_decorator_1.OverrideLevelAccess)(users_entity_1.AdminLevel.SuperAdmin),
    (0, common_1.Put)(':id/level'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, set_admin_level_dto_1.SetAdminLevelDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "setAdminLevel", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, api_response_1.ApiNestNotFoundResponse)('No user was found with the specified id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deletes specified user' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, override_level_access_decorator_1.OverrideLevelAccess)(users_entity_1.AdminLevel.SuperAdmin),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delete", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Returns the administered sites of the signed in user',
    }),
    (0, common_1.Get)('current/administered-sites'),
    openapi.ApiResponse({ status: 200, type: [require("../sites/sites.entity").Site] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAdministeredSites", null);
UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
