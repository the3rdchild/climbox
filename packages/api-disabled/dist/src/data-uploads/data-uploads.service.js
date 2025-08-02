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
exports.DataUploadsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const data_uploads_sites_entity_1 = require("./data-uploads-sites.entity");
const data_uploads_entity_1 = require("./data-uploads.entity");
let DataUploadsService = class DataUploadsService {
    constructor(dataUploadsRepository, dataUploadsSitesRepository) {
        this.dataUploadsRepository = dataUploadsRepository;
        this.dataUploadsSitesRepository = dataUploadsSitesRepository;
    }
    getDataUploads({ siteId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadsData = yield this.dataUploadsSitesRepository
                .createQueryBuilder('dataUploadsSites')
                .leftJoinAndSelect('dataUploadsSites.site', 'site')
                .leftJoinAndSelect('dataUploadsSites.dataUpload', 'dataUpload')
                .leftJoinAndSelect('dataUploadsSites.surveyPoint', 'surveyPoint')
                .where('dataUploadsSites.siteId = :siteId', { siteId })
                .getMany();
            const otherSiteRelations = yield this.dataUploadsSitesRepository
                .createQueryBuilder('dus')
                .select(['dus.site_id', 'dus2.site_id', 'dus.data_upload_id'])
                .innerJoin('data_uploads_sites', 'dus2', 'dus.data_upload_id = dus2.data_upload_id')
                .where('dus.site_id = :siteId', { siteId })
                .getRawMany();
            const groupedByDataUploadId = otherSiteRelations.reduce((acc, cur) => {
                const uploadId = cur.data_upload_id;
                const id = cur.site_id;
                const val = acc.get(uploadId);
                acc.set(uploadId, val !== undefined ? [...val, id] : [id]);
                return acc;
            }, new Map());
            return uploadsData.map((x) => (Object.assign(Object.assign({}, x), { sitesAffectedByDataUpload: groupedByDataUploadId.get(x.dataUploadId) })));
        });
    }
    deleteDataUploads({ ids }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataUploadsRepository.delete({ id: (0, typeorm_2.In)(ids) });
            this.dataUploadsRepository.query('REFRESH MATERIALIZED VIEW latest_data');
        });
    }
};
DataUploadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(data_uploads_entity_1.DataUploads)),
    __param(1, (0, typeorm_1.InjectRepository)(data_uploads_sites_entity_1.DataUploadsSites)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DataUploadsService);
exports.DataUploadsService = DataUploadsService;
