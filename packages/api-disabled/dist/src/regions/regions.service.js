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
exports.RegionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const lodash_1 = require("lodash");
const regions_entity_1 = require("./regions.entity");
let RegionsService = class RegionsService {
    constructor(regionsRepository) {
        this.regionsRepository = regionsRepository;
    }
    create(createRegionDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parentId } = createRegionDto;
            return this.regionsRepository.save(Object.assign(Object.assign({}, createRegionDto), { parent: parentId === undefined ? undefined : { id: parentId } }));
        });
    }
    find(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.regionsRepository.createQueryBuilder('region');
            if (filter.name) {
                query.andWhere('(lower(region.name) LIKE :name)', {
                    name: `%${filter.name.toLowerCase()}%`,
                });
            }
            if (filter.parent) {
                query.andWhere('region.parent = :parent', {
                    parent: filter.parent,
                });
            }
            query.leftJoinAndSelect('region.parent', 'parent');
            return query.getMany();
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield this.regionsRepository.findOne({
                where: { id },
                relations: ['parent'],
            });
            if (!found) {
                throw new common_1.NotFoundException(`Region with ID ${id} not found.`);
            }
            return found;
        });
    }
    update(id, updateRegionDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parentId } = updateRegionDto;
            const updateParent = parentId !== undefined ? { parent: { id: parentId } } : {};
            const result = yield this.regionsRepository.update(id, Object.assign(Object.assign({}, (0, lodash_1.omit)(updateRegionDto, 'parentId')), updateParent));
            if (!result.affected) {
                throw new common_1.NotFoundException(`Region with ID ${id} not found.`);
            }
            const updated = yield this.regionsRepository.findOneBy({ id });
            if (!updated) {
                throw new common_1.InternalServerErrorException('Something went wrong.');
            }
            return updated;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.regionsRepository.delete(id);
            if (!result.affected) {
                throw new common_1.NotFoundException(`Region with ID ${id} not found.`);
            }
        });
    }
};
RegionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(regions_entity_1.Region)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RegionsService);
exports.RegionsService = RegionsService;
