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
var CollectionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const lodash_1 = require("lodash");
const typeorm_2 = require("typeorm");
const collections_entity_1 = require("./collections.entity");
const sources_entity_1 = require("../sites/sources.entity");
const latest_data_entity_1 = require("../time-series/latest-data.entity");
const users_entity_1 = require("../users/users.entity");
const site_utils_1 = require("../utils/site.utils");
const collections_utils_1 = require("../utils/collections.utils");
const sites_entity_1 = require("../sites/sites.entity");
const metrics_enum_1 = require("../time-series/metrics.enum");
let CollectionsService = CollectionsService_1 = class CollectionsService {
    constructor(collectionRepository, latestDataRepository, siteRepository, sourcesRepository) {
        this.collectionRepository = collectionRepository;
        this.latestDataRepository = latestDataRepository;
        this.siteRepository = siteRepository;
        this.sourcesRepository = sourcesRepository;
        this.logger = new common_1.Logger(CollectionsService_1.name);
    }
    create(createCollectionDto, user) {
        const { name, isPublic, siteIds, userId: idFromDTO } = createCollectionDto;
        // Users who are not admins can only create collections for themselves
        if (idFromDTO &&
            idFromDTO !== (user === null || user === void 0 ? void 0 : user.id) &&
            (user === null || user === void 0 ? void 0 : user.adminLevel) !== users_entity_1.AdminLevel.SuperAdmin) {
            throw new common_1.ForbiddenException('You are not allowed to execute this operation');
        }
        const userId = idFromDTO || (user === null || user === void 0 ? void 0 : user.id);
        const sites = siteIds.map((siteId) => ({ id: siteId }));
        return this.collectionRepository.save({
            name,
            isPublic,
            sites,
            user: { id: userId },
        });
    }
    find(filterCollectionDto, user) {
        const { name, siteId } = filterCollectionDto;
        const query = this.collectionRepository.createQueryBuilder('collection');
        if (user) {
            query.andWhere('collection.user_id = :userId', { userId: user.id });
        }
        else {
            query.andWhere('collection.is_public = TRUE');
        }
        if (name) {
            query.andWhere('collection.name = :name', { name });
        }
        if (siteId) {
            query
                .innerJoin('collection.sites', 'site')
                .andWhere('site.id = :siteId', { siteId });
        }
        return query.getMany();
    }
    findOne(collectionId, publicOnly = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.collectionRepository.findOne({
                where: { id: collectionId },
                relations: [
                    'sites',
                    'sites.historicalMonthlyMean',
                    'sites.region',
                    'user',
                ],
            });
            if (!collection) {
                throw new common_1.NotFoundException(`Collection with ID ${collectionId} not found.`);
            }
            if (publicOnly && !collection.isPublic) {
                throw new common_1.ForbiddenException(`You are not allowed to access this collection with ${collectionId}`);
            }
            if (collection.sites.length === 0) {
                return collection;
            }
            return this.processCollection(collection, collection.sites);
        });
    }
    update(collectionId, updateCollectionDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.collectionRepository.findOneBy({
                id: collectionId,
            });
            if (!collection) {
                throw new common_1.NotFoundException(`Collection with ID ${collectionId} not found.`);
            }
            const { name, isPublic, userId, addSiteIds, removeSiteIds } = updateCollectionDto;
            const filteredAddSiteIds = addSiteIds === null || addSiteIds === void 0 ? void 0 : addSiteIds.filter((siteId) => !collection.siteIds.includes(siteId));
            yield this.collectionRepository
                .createQueryBuilder('collection')
                .relation('sites')
                .of(collection)
                .addAndRemove(filteredAddSiteIds || [], removeSiteIds || []);
            yield this.collectionRepository.update({
                id: collectionId,
            }, Object.assign(Object.assign({}, (0, lodash_1.omitBy)({ name, isPublic }, lodash_1.isUndefined)), (userId !== undefined ? { user: { id: userId } } : {})));
            return this.collectionRepository.findOneBy({ id: collection.id });
        });
    }
    delete(collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collectionRepository.delete(collectionId);
            if (!result.affected) {
                throw new common_1.NotFoundException(`Collection with ID ${collectionId} not found.`);
            }
        });
    }
    getHeatStressTracker() {
        return __awaiter(this, void 0, void 0, function* () {
            const heatStressData = yield this.latestDataRepository.findBy({
                metric: metrics_enum_1.Metric.DHW,
                value: (0, typeorm_2.MoreThanOrEqual)(1),
            });
            const heatStressSiteIds = heatStressData.map((data) => data.siteId);
            const heatStressSites = yield this.siteRepository.find({
                where: { id: (0, typeorm_2.In)(heatStressSiteIds), display: true },
            });
            return this.processCollection(collections_utils_1.heatStressTracker, heatStressSites);
        });
    }
    processCollection(collection, sites) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedSiteData = yield (0, collections_utils_1.getCollectionData)(sites, this.latestDataRepository);
            const hasHoboData = yield (0, site_utils_1.hasHoboDataSubQuery)(this.sourcesRepository);
            return Object.assign(Object.assign({}, collection), { user: collection instanceof collections_entity_1.Collection
                    ? Object.assign(Object.assign({}, collection.user), { firebaseUid: undefined }) : undefined, siteIds: sites.map((site) => site.id), sites: sites.map((site) => (Object.assign(Object.assign({}, site), { hasHobo: hasHoboData.has(site.id), applied: site.applied, collectionData: mappedSiteData[site.id] }))) });
        });
    }
};
CollectionsService = CollectionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(collections_entity_1.Collection)),
    __param(1, (0, typeorm_1.InjectRepository)(latest_data_entity_1.LatestData)),
    __param(2, (0, typeorm_1.InjectRepository)(sites_entity_1.Site)),
    __param(3, (0, typeorm_1.InjectRepository)(sources_entity_1.Sources)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CollectionsService);
exports.CollectionsService = CollectionsService;
