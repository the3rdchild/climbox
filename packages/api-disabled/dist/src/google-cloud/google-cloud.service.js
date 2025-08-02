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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCloudService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const storage_1 = require("@google-cloud/storage");
const typeorm_2 = require("typeorm");
const path_1 = __importDefault(require("path"));
const file_decorator_1 = require("../uploads/file.decorator");
const data_uploads_entity_1 = require("../data-uploads/data-uploads.entity");
const google_cloud_utils_1 = require("../utils/google-cloud.utils");
const survey_media_entity_1 = require("../surveys/survey-media.entity");
let GoogleCloudService = class GoogleCloudService {
    constructor(surveyMediaRepository, dataUploadsRepository) {
        this.surveyMediaRepository = surveyMediaRepository;
        this.dataUploadsRepository = dataUploadsRepository;
        this.logger = new common_1.Logger('GCS');
        this.GCS_BUCKET = process.env.GCS_BUCKET;
        this.STORAGE_FOLDER = process.env.STORAGE_FOLDER;
        this.GCS_KEYFILE = process.env.GCS_KEYFILE;
        this.GCS_PROJECT = process.env.GCS_PROJECT;
        this.storage = new storage_1.Storage({
            keyFilename: this.GCS_KEYFILE,
            projectId: this.GCS_PROJECT,
            retryOptions: { autoRetry: true, maxRetries: 3 },
        });
    }
    getDestination(filePath, type, dir, prefix) {
        if (!this.STORAGE_FOLDER) {
            this.logger.error('STORAGE_FOLDER variable has not been initialized');
            throw new common_1.InternalServerErrorException();
        }
        const folder = `${this.STORAGE_FOLDER}/${dir}/`;
        const basename = path_1.default.basename(filePath);
        return (0, file_decorator_1.getRandomName)(folder, prefix, basename, type);
    }
    uploadFileAsync(filePath, type, dir = 'surveys', prefix = 'site_hobo_image') {
        const dest = this.getDestination(filePath, type, dir, prefix);
        this.uploadFile(filePath, dest);
        return dest;
    }
    uploadFileSync(filePath, type, dir = 'surveys', prefix = 'site_hobo_image') {
        return __awaiter(this, void 0, void 0, function* () {
            const destination = this.getDestination(filePath, type, dir, prefix);
            return this.uploadFile(filePath, destination);
        });
    }
    uploadFile(filePath, destination) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.GCS_BUCKET) {
                this.logger.error('GCS_BUCKET variable has not been initialized');
                throw new common_1.InternalServerErrorException();
            }
            const response = yield this.storage
                .bucket(this.GCS_BUCKET)
                .upload(filePath, {
                destination,
                public: true,
                gzip: true,
            });
            const publicUrl = response[0].name;
            return `https://storage.googleapis.com/${this.GCS_BUCKET}/${publicUrl}`;
        });
    }
    uploadBuffer(buffer, filePath, type, dir, prefix) {
        const dest = this.getDestination(filePath, type, dir, prefix);
        return this.uploadBufferToDestination(buffer, dest);
    }
    uploadBufferToDestination(buffer, destination, bucket = this.GCS_BUCKET) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bucket) {
                this.logger.error('GCS_BUCKET variable has not been initialized');
                throw new common_1.InternalServerErrorException();
            }
            const file = this.storage.bucket(bucket).file(destination);
            try {
                const bufferData = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
                yield file.save(bufferData, { public: true, gzip: true });
            }
            catch (error) {
                this.logger.error(error);
                throw new common_1.InternalServerErrorException();
            }
            return `https://storage.googleapis.com/${bucket}/${destination}`;
        });
    }
    findDanglingFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.GCS_BUCKET || !this.STORAGE_FOLDER) {
                this.logger.error('GCS_BUCKET or STORAGE_FOLDER variable has not been initialized');
                throw new common_1.InternalServerErrorException();
            }
            if (!this.surveyMediaRepository || !this.dataUploadsRepository) {
                throw new common_1.InternalServerErrorException();
            }
            const surveyMedia = yield this.surveyMediaRepository.find({
                select: ['url', 'thumbnailUrl'],
            });
            const dataUploads = yield this.dataUploadsRepository.find({
                select: ['fileLocation'],
            });
            const originalMediaSet = new Set(surveyMedia.map((media) => (0, google_cloud_utils_1.getSurveyMediaFileFromURL)(media.url)));
            const thumbnailMediaSet = new Set(surveyMedia.map((media) => (0, google_cloud_utils_1.getSurveyMediaFileFromURL)(media.thumbnailUrl || '')));
            const dataUploadsSet = new Set(dataUploads.map((x) => x.fileLocation));
            const [mediaFileResponse] = yield this.storage
                .bucket(this.GCS_BUCKET)
                .getFiles({ prefix: `${this.STORAGE_FOLDER}/${google_cloud_utils_1.GoogleCloudDir.SURVEYS}` });
            const [dataUploadsFileResponse] = yield this.storage
                .bucket(this.GCS_BUCKET)
                .getFiles({
                prefix: `${this.STORAGE_FOLDER}/${google_cloud_utils_1.GoogleCloudDir.DATA_UPLOADS}`,
            });
            const mediaFiltered = mediaFileResponse
                .filter((f) => !originalMediaSet.has(f.name))
                .filter((f) => !thumbnailMediaSet.has(f.name))
                .map((f) => f.name);
            const dataUploadsFiltered = dataUploadsFileResponse
                .filter((f) => !dataUploadsSet.has(f.name))
                .map((f) => f.name);
            return [...mediaFiltered, ...dataUploadsFiltered];
        });
    }
    deleteDanglingFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const danglingFiles = yield this.findDanglingFiles();
            const actions = danglingFiles.map((file) => {
                return this.deleteFile(file).catch(() => {
                    this.logger.log(`Could not delete media ${file}.`);
                });
            });
            return Promise.all(actions);
        });
    }
    deleteFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.GCS_BUCKET) {
                this.logger.error('GCS_BUCKET variable has not been initialized');
                throw new common_1.InternalServerErrorException();
            }
            try {
                yield this.storage.bucket(this.GCS_BUCKET).file(file).delete();
            }
            catch (error) {
                this.logger.error(`Failed to delete the file ${file}: `, error);
                throw new common_1.InternalServerErrorException();
            }
        });
    }
};
GoogleCloudService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(survey_media_entity_1.SurveyMedia)),
    __param(1, (0, typeorm_1.InjectRepository)(data_uploads_entity_1.DataUploads)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], GoogleCloudService);
exports.GoogleCloudService = GoogleCloudService;
