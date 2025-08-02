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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_entity_1 = require("./users.entity");
const site_applications_entity_1 = require("../site-applications/site-applications.entity");
const collections_entity_1 = require("../collections/collections.entity");
const firebase_auth_utils_1 = require("../auth/firebase-auth.utils");
let UsersService = class UsersService {
    constructor(usersRepository, siteApplicationRepository, collectionRepository) {
        this.usersRepository = usersRepository;
        this.siteApplicationRepository = siteApplicationRepository;
        this.collectionRepository = collectionRepository;
    }
    create(req, createUserDto) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const firebaseUser = yield (0, firebase_auth_utils_1.extractAndVerifyToken)(req);
            if (!firebaseUser) {
                throw new common_1.BadRequestException('Invalid Firebase token.');
            }
            if (((_a = firebaseUser.email) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== createUserDto.email.toLowerCase()) {
                throw new common_1.BadRequestException('Invalid user email.');
            }
            const firebaseUid = firebaseUser.uid;
            const uidExists = yield this.findByFirebaseUid(firebaseUid);
            if (uidExists) {
                throw new common_1.BadRequestException(`User with firebaseUid ${firebaseUid} already exists.`);
            }
            const { email } = firebaseUser;
            const priorAccount = yield this.findByEmail(email.toLowerCase());
            if (priorAccount && priorAccount.firebaseUid) {
                throw new common_1.BadRequestException(`Email ${email} is already connected to a different firebaseUid.`);
            }
            if (priorAccount) {
                const newUser = yield this.migrateUserAssociations(priorAccount);
                // User has associations so we have to explicitly change their admin level to site manager
                if (newUser.administeredSites.length &&
                    priorAccount.adminLevel !== users_entity_1.AdminLevel.SuperAdmin) {
                    // eslint-disable-next-line fp/no-mutation
                    priorAccount.adminLevel = users_entity_1.AdminLevel.SiteManager;
                    // eslint-disable-next-line fp/no-mutation
                    priorAccount.administeredSites = newUser.administeredSites;
                }
            }
            const user = Object.assign(Object.assign(Object.assign({}, priorAccount), createUserDto), { adminLevel: (priorAccount === null || priorAccount === void 0 ? void 0 : priorAccount.adminLevel) || users_entity_1.AdminLevel.Default, email: email.toLowerCase(), firebaseUid });
            const createdUser = yield this.usersRepository.save(user);
            return createdUser;
        });
    }
    getSelf(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return req.user;
        });
    }
    getAdministeredSites(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository
                .createQueryBuilder('users')
                .leftJoinAndSelect('users.administeredSites', 'sites')
                .leftJoinAndSelect('sites.siteApplication', 'siteApplication')
                .where('users.id = :id', { id: req.user.id })
                .getOne();
            return (user.administeredSites.map((site) => {
                return Object.assign(Object.assign({}, site), { siteApplication: undefined, applied: site.applied });
            }) || []);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Use query builder to include the firebaseUid
            return this.usersRepository
                .createQueryBuilder('users')
                .addSelect('users.firebaseUid')
                .where('email = :email', { email })
                .getOne();
        });
    }
    findByFirebaseUid(firebaseUid) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersRepository.findOne({ where: { firebaseUid } });
        });
    }
    setAdminLevel(id, adminLevel) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.usersRepository.update(id, { adminLevel });
            if (!result.affected) {
                throw new common_1.NotFoundException(`User with ID ${id} not found.`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.usersRepository.delete(id);
            if (!result.affected) {
                throw new common_1.NotFoundException(`User with ID ${id} not found.`);
            }
        });
    }
    /**
     * Transfer the associations between the user and the sites from the site-application table
     */
    migrateUserAssociations(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const siteAssociations = yield this.siteApplicationRepository.find({
                where: { user: { id: user.id } },
                relations: ['site'],
            });
            const { administeredSites: existingSites = [] } = (yield this.usersRepository.findOne({
                where: { id: user.id },
                relations: ['administeredSites'],
            })) || {};
            const administeredSites = siteAssociations.reduce((sites, siteAssociation) => {
                const { site } = siteAssociation;
                const alreadyExists = sites.some(({ id }) => site.id === id);
                return alreadyExists ? sites : sites.concat(site);
            }, existingSites);
            const newUser = {
                id: user.id,
                administeredSites,
            };
            return this.usersRepository.save(newUser);
        });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(site_applications_entity_1.SiteApplication)),
    __param(2, (0, typeorm_1.InjectRepository)(collections_entity_1.Collection)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
