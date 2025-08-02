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
var SurveysService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveysService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const lodash_1 = require("lodash");
const surveys_entity_1 = require("./surveys.entity");
const survey_media_entity_1 = require("./survey-media.entity");
const google_cloud_service_1 = require("../google-cloud/google-cloud.service");
const sites_entity_1 = require("../sites/sites.entity");
const google_cloud_utils_1 = require("../utils/google-cloud.utils");
const site_utils_1 = require("../utils/site.utils");
const image_1 = require("../../scripts/utils/image");
const mimetypes_1 = require("../uploads/mimetypes");
const image_resize_1 = require("../utils/image-resize");
let SurveysService = SurveysService_1 = class SurveysService {
    constructor(surveyRepository, surveyMediaRepository, siteRepository, googleCloudService) {
        this.surveyRepository = surveyRepository;
        this.surveyMediaRepository = surveyMediaRepository;
        this.siteRepository = siteRepository;
        this.googleCloudService = googleCloudService;
        this.logger = new common_1.Logger(SurveysService_1.name);
        // The target width for the thumbnails generated at survey image upload.
        this.surveyImageResizeWidth = 512;
        this.maxFileSizeMB = process.env.STORAGE_MAX_FILE_SIZE_MB
            ? parseInt(process.env.STORAGE_MAX_FILE_SIZE_MB, 10)
            : 1;
        this.maxFileSizeB = this.maxFileSizeMB * 1024 * 1024;
    }
    // Create a survey
    create(createSurveyDto, user, siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const site = yield (0, site_utils_1.getSite)(siteId, this.siteRepository);
            const survey = yield this.surveyRepository.save(Object.assign(Object.assign({ user,
                site }, createSurveyDto), { comments: this.transformComments(createSurveyDto.comments) }));
            return survey;
        });
    }
    upload(file) {
        return __awaiter(this, void 0, void 0, function* () {
            // Upload original
            if (file.buffer.byteLength > this.maxFileSizeB) {
                throw new common_1.BadRequestException(`Max size allowed is ${this.maxFileSizeMB} MB`);
            }
            const url = yield this.googleCloudService.uploadBuffer(file.buffer, file.originalname, 'image', google_cloud_utils_1.GoogleCloudDir.SURVEYS, 'site');
            // Upload resized
            const type = (0, mimetypes_1.validateMimetype)(file.mimetype);
            if (type !== 'image')
                return { url };
            const imageData = yield (0, image_1.getImageData)(file.buffer);
            if ((imageData.width || 0) <= this.surveyImageResizeWidth)
                return { url };
            const resizedImage = yield (0, image_1.resize)(file.buffer, this.surveyImageResizeWidth);
            const { bucket, destination } = (0, image_resize_1.getThumbnailBucketAndDestination)(url);
            const thumbnailUrl = yield this.googleCloudService.uploadBufferToDestination(resizedImage, destination, bucket);
            return { url, thumbnailUrl };
        });
    }
    // Create a survey media (video or image)
    createMedia(createSurveyMediaDto, surveyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const survey = yield this.surveyRepository.findOneBy({ id: surveyId });
            if (!survey) {
                throw new common_1.NotFoundException(`Survey with id ${surveyId} was not found`);
            }
            // Check if a featured media already exists for this survey
            const featuredMedia = yield this.surveyMediaRepository.findOne({
                where: {
                    featured: true,
                    surveyId: { id: survey.id },
                },
            });
            const newFeatured = featuredMedia &&
                createSurveyMediaDto.featured &&
                !createSurveyMediaDto.hidden;
            if (featuredMedia && newFeatured) {
                yield this.surveyMediaRepository.update(featuredMedia.id, {
                    featured: false,
                });
            }
            return this.surveyMediaRepository.save(Object.assign(Object.assign({}, createSurveyMediaDto), { surveyPoint: { id: createSurveyMediaDto.surveyPointId }, featured: newFeatured || (!featuredMedia && !createSurveyMediaDto.hidden), type: survey_media_entity_1.MediaType.Image, surveyId: survey, comments: this.transformComments(createSurveyMediaDto.comments) }));
        });
    }
    // Find all surveys related to a specific site.
    find(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const surveyHistoryQuery = yield this.surveyRepository
                .createQueryBuilder('survey')
                .leftJoinAndMapOne('survey.latestDailyData', 'daily_data', 'data', 'data.site_id = survey.site_id AND DATE(data.date) = DATE(survey.diveDate)')
                .innerJoin('survey.user', 'users')
                .leftJoinAndSelect('survey.featuredSurveyMedia', 'featuredSurveyMedia', 'featuredSurveyMedia.featured = True')
                .leftJoinAndSelect('featuredSurveyMedia.surveyPoint', 'surveyPoint')
                .addSelect(['users.fullName', 'users.id'])
                .where('survey.site_id = :siteId', { siteId })
                .getMany();
            const surveyObservationsQuery = yield this.surveyMediaRepository
                .createQueryBuilder('surveyMedia')
                .innerJoin('surveyMedia.surveyId', 'surveys', 'surveys.site_id = :siteId', { siteId })
                .groupBy('surveyMedia.surveyId, surveyMedia.observations')
                .select(['surveyMedia.surveyId', 'surveyMedia.observations'])
                .getRawMany();
            const surveyPointsQuery = yield this.surveyMediaRepository
                .createQueryBuilder('surveyMedia')
                .innerJoin('surveyMedia.surveyId', 'surveys', 'surveys.site_id = :siteId', { siteId })
                .groupBy('surveyMedia.surveyId, surveyMedia.surveyPoint')
                .select([
                'surveyMedia.surveyId',
                'surveyMedia.surveyPoint',
                `array_agg(
          json_build_object(
            'url', url,
            'thumbnailUrl', thumbnail_url
          )
        ) survey_point_images`,
            ])
                .getRawMany();
            const observationsGroupedBySurveyId = this.groupBySurveyId(surveyObservationsQuery, 'surveyMedia_observations');
            const surveyPointIdGroupedBySurveyId = this.groupBySurveyId(surveyPointsQuery, 'survey_point_id');
            const surveyImageGroupedBySurveyPointId = this.groupBySurveyId(surveyPointsQuery, 'survey_point_images', 'survey_point_id');
            return surveyHistoryQuery.map((survey) => {
                var _a;
                return ({
                    id: survey.id,
                    diveDate: survey.diveDate,
                    comments: survey.comments,
                    weatherConditions: survey.weatherConditions,
                    user: survey.user,
                    site: survey.site,
                    siteId: survey.siteId,
                    temperature: survey.temperature,
                    satelliteTemperature: ((_a = survey.latestDailyData) === null || _a === void 0 ? void 0 : _a.satelliteTemperature) || undefined,
                    featuredSurveyMedia: survey.featuredSurveyMedia,
                    observations: observationsGroupedBySurveyId[survey.id] || [],
                    surveyPoints: surveyPointIdGroupedBySurveyId[survey.id] || [],
                    surveyPointImage: surveyImageGroupedBySurveyPointId[survey.id] || [],
                    createdAt: survey.createdAt,
                    updatedAt: survey.updatedAt,
                });
            });
        });
    }
    // Find one survey provided its id
    // Include its surveyMedia grouped by siteSurveyPoint
    findOne(surveyId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const surveyDetails = yield this.surveyRepository
                .createQueryBuilder('survey')
                .innerJoinAndSelect('survey.surveyMedia', 'surveyMedia')
                .leftJoinAndSelect('surveyMedia.surveyPoint', 'surveyPoints')
                .leftJoinAndMapOne('survey.latestDailyData', 'daily_data', 'data', 'data.site_id = survey.site_id AND DATE(data.date) = DATE(survey.diveDate)')
                .where('survey.id = :surveyId', { surveyId })
                .andWhere('surveyMedia.hidden = False')
                .getOne();
            if (!surveyDetails) {
                throw new common_1.NotFoundException(`Survey with id ${surveyId} was not found`);
            }
            return Object.assign(Object.assign({}, surveyDetails), { satelliteTemperature: ((_a = surveyDetails.latestDailyData) === null || _a === void 0 ? void 0 : _a.satelliteTemperature) || undefined, latestDailyData: undefined });
        });
    }
    findMedia(surveyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.surveyMediaRepository
                .createQueryBuilder('surveyMedia')
                .leftJoinAndSelect('surveyMedia.surveyPoint', 'surveyPoint')
                .where('surveyMedia.surveyId = :surveyId', { surveyId })
                .getMany();
        });
    }
    update(editSurveyDto, surveyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.surveyRepository.update(surveyId, Object.assign(Object.assign({}, editSurveyDto), { comments: this.transformComments(editSurveyDto.comments) }));
            if (!result.affected) {
                throw new common_1.NotFoundException(`Survey with id ${surveyId} was not found`);
            }
            const updated = yield this.surveyRepository.findOneBy({ id: surveyId });
            return updated;
        });
    }
    updateMedia(editSurveyMediaDto, mediaId) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, lodash_1.isNil)(editSurveyMediaDto.featured) ||
                (0, lodash_1.isNil)(editSurveyMediaDto.hidden)) {
                throw new common_1.BadRequestException('Features and hidden flags must be provided');
            }
            const surveyMedia = yield this.surveyMediaRepository.findOneBy({
                id: mediaId,
            });
            if (!surveyMedia) {
                throw new common_1.NotFoundException(`Survey media with id ${mediaId} was not found`);
            }
            // Media changes from featured to not featured
            if (surveyMedia.featured &&
                (editSurveyMediaDto.hidden || !editSurveyMediaDto.featured)) {
                yield this.assignFeaturedMedia(surveyMedia.surveyId.id, mediaId);
            }
            // Media changes from not featured to featured
            if (!surveyMedia.featured &&
                !editSurveyMediaDto.hidden &&
                editSurveyMediaDto.featured) {
                yield this.surveyMediaRepository.update({
                    surveyId: { id: surveyMedia.surveyId.id },
                    featured: true,
                }, { featured: false });
            }
            const trimmedComments = this.transformComments(editSurveyMediaDto.comments);
            yield this.surveyMediaRepository.update(mediaId, Object.assign(Object.assign(Object.assign(Object.assign({}, (0, lodash_1.omit)(editSurveyMediaDto, 'surveyPointId')), (editSurveyMediaDto.surveyPointId
                ? { surveyPoint: { id: editSurveyMediaDto.surveyPointId } }
                : {})), { featured: !editSurveyMediaDto.hidden && editSurveyMediaDto.featured }), (trimmedComments ? { comments: trimmedComments } : {})));
            const updated = yield this.surveyMediaRepository
                .createQueryBuilder('survey_media')
                .leftJoinAndMapOne('survey_media.surveyPoint', 'site_survey_point', 'point', 'point.id = survey_media.survey_point_id')
                .where('survey_media.id = :mediaId', { mediaId })
                .getOne();
            return updated;
        });
    }
    delete(surveyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const surveyMedia = yield this.surveyMediaRepository.find({
                where: { surveyId: { id: surveyId } },
            });
            yield Promise.all(surveyMedia.map((media) => {
                const file = (0, google_cloud_utils_1.getSurveyMediaFileFromURL)(media.url);
                // We need to grab the path/to/file. So we split the url on "{GCS_BUCKET}/"
                return this.googleCloudService.deleteFile(file).catch(() => {
                    this.logger.error(`Could not delete media ${media.url} of survey ${surveyId}.`);
                });
            }));
            const result = yield this.surveyRepository.delete(surveyId);
            if (!result.affected) {
                throw new common_1.NotFoundException(`Survey with id ${surveyId} was not found`);
            }
        });
    }
    deleteMedia(mediaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const surveyMedia = yield this.surveyMediaRepository.findOneBy({
                id: mediaId,
            });
            if (!surveyMedia) {
                throw new common_1.NotFoundException(`Survey media with id ${mediaId} was not found`);
            }
            if (surveyMedia.featured) {
                yield this.assignFeaturedMedia(surveyMedia.surveyId.id, mediaId);
            }
            // We need to grab the path/to/file. So we split the url on "{GCS_BUCKET}/"
            // and grab the second element of the resulting array which is the path we need
            yield this.googleCloudService
                .deleteFile((0, google_cloud_utils_1.getSurveyMediaFileFromURL)(surveyMedia.url))
                .catch((error) => {
                this.logger.error(`Could not delete media ${surveyMedia.url} of survey media ${mediaId}.`);
                throw error;
            });
            yield this.surveyMediaRepository.delete(mediaId);
        });
    }
    /**
     * Assign a random survey media as the featured media of the survey,
     * because the current one will be unset.
     *
     * The new media should be not hidden.
     *
     * If no such media exists no featured media is assigned.
     *
     * @param surveyId The survey id
     * @param mediaId The media id that was previously featured and should be excluded
     */
    assignFeaturedMedia(surveyId, mediaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const surveyMedia = yield this.surveyMediaRepository
                .createQueryBuilder('surveyMedia')
                .where('surveyMedia.surveyId = :surveyId ', { surveyId })
                .andWhere('id != :mediaId', { mediaId })
                .andWhere('hidden != True')
                .getOne();
            if (!surveyMedia) {
                return;
            }
            yield this.surveyMediaRepository.update(surveyMedia.id, { featured: true });
        });
    }
    /**
     * Transform all empty-like comments to null values to not have to deal with different types of empty comments
     *
     * @param comments The comments to transform
     */
    transformComments(comments) {
        if (comments === undefined) {
            return undefined;
        }
        const trimmedComments = comments.trim();
        return trimmedComments === '' ? undefined : trimmedComments;
    }
    /**
     * Group the values of the provided object array by the survey id and optionally by a secondary key
     *
     * @param object The object of arrays to perform the group (must have a survey id in each record)
     * @param key The key of the value you want to group
     * @param secondary The optional secondary key to perform a deeper group
     */
    groupBySurveyId(object, key, secondary) {
        return object.reduce((result, current) => {
            return Object.assign(Object.assign({}, result), { [current.survey_id]: secondary
                    ? Object.assign(Object.assign({}, result[current.survey_id]), { [current[secondary]]: current[key] }) : [...(result[current.survey_id] || []), current[key]] });
        }, {});
    }
};
SurveysService = SurveysService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(surveys_entity_1.Survey)),
    __param(1, (0, typeorm_1.InjectRepository)(survey_media_entity_1.SurveyMedia)),
    __param(2, (0, typeorm_1.InjectRepository)(sites_entity_1.Site)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        google_cloud_service_1.GoogleCloudService])
], SurveysService);
exports.SurveysService = SurveysService;
