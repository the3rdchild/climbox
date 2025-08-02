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
var SitesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const lodash_1 = require("lodash");
const bluebird_1 = __importDefault(require("bluebird"));
const sanitize_url_1 = require("@braintree/sanitize-url");
const reef_check_surveys_entity_1 = require("../reef-check-surveys/reef-check-surveys.entity");
const luxon_extensions_1 = require("../luxon-extensions");
const sites_entity_1 = require("./sites.entity");
const daily_data_entity_1 = require("./daily-data.entity");
const users_entity_1 = require("../users/users.entity");
const historical_monthly_mean_entity_1 = require("./historical-monthly-mean.entity");
const regions_entity_1 = require("../regions/regions.entity");
const site_utils_1 = require("../utils/site.utils");
const sofar_1 = require("../utils/sofar");
const exclusion_dates_entity_1 = require("./exclusion-dates.entity");
const backfill_site_data_1 = require("../workers/backfill-site-data");
const site_applications_entity_1 = require("../site-applications/site-applications.entity");
const coordinates_1 = require("../utils/coordinates");
const sources_entity_1 = require("./sources.entity");
const collections_utils_1 = require("../utils/collections.utils");
const latest_data_entity_1 = require("../time-series/latest-data.entity");
const urls_1 = require("../utils/urls");
const check_video_streams_1 = require("../workers/check-video-streams");
const dates_1 = require("../utils/dates");
const source_type_enum_1 = require("./schemas/source-type.enum");
const time_series_entity_1 = require("../time-series/time-series.entity");
const slack_utils_1 = require("../utils/slack.utils");
const scheduled_updates_entity_1 = require("./scheduled-updates.entity");
let SitesService = SitesService_1 = class SitesService {
    constructor(sitesRepository, siteApplicationRepository, dailyDataRepository, regionRepository, exclusionDatesRepository, historicalMonthlyMeanRepository, userRepository, sourceRepository, latestDataRepository, timeSeriesRepository, scheduledUpdateRepository, reefCheckSurveyRepository, dataSource) {
        this.sitesRepository = sitesRepository;
        this.siteApplicationRepository = siteApplicationRepository;
        this.dailyDataRepository = dailyDataRepository;
        this.regionRepository = regionRepository;
        this.exclusionDatesRepository = exclusionDatesRepository;
        this.historicalMonthlyMeanRepository = historicalMonthlyMeanRepository;
        this.userRepository = userRepository;
        this.sourceRepository = sourceRepository;
        this.latestDataRepository = latestDataRepository;
        this.timeSeriesRepository = timeSeriesRepository;
        this.scheduledUpdateRepository = scheduledUpdateRepository;
        this.reefCheckSurveyRepository = reefCheckSurveyRepository;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(SitesService_1.name);
    }
    create(appParams, siteParams, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, latitude, longitude, depth } = siteParams;
            const site = yield (0, site_utils_1.createSite)(name, depth, longitude, latitude, this.regionRepository, this.sitesRepository, this.historicalMonthlyMeanRepository);
            // Elevate user to SiteManager
            if (user.adminLevel === users_entity_1.AdminLevel.Default) {
                yield this.userRepository.update(user.id, {
                    adminLevel: users_entity_1.AdminLevel.SiteManager,
                });
            }
            yield this.userRepository
                .createQueryBuilder('users')
                .relation('administeredSites')
                .of(user)
                .add(site);
            (0, backfill_site_data_1.backfillSiteData)({
                dataSource: this.dataSource,
                siteId: site.id,
            });
            const regionWarningMessage = site.region
                ? '\n:warning: *Warning*: No region was found for this site, please ask devs to enter one manually.'
                : '';
            const messageTemplate = {
                channel: process.env.SLACK_BOT_CHANNEL,
                text: `New site ${site.name} created with id=${site.id}, by ${user.fullName}${regionWarningMessage}`,
                mrkdwn: true,
            };
            // Add site to scheduled noaa location updates
            yield this.scheduledUpdateRepository.save({ site: { id: site.id } });
            yield (0, slack_utils_1.sendSlackMessage)(messageTemplate, process.env.SLACK_BOT_TOKEN);
            return this.siteApplicationRepository.save(Object.assign(Object.assign({}, appParams), { site,
                user }));
        });
    }
    find(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.sitesRepository.createQueryBuilder('site');
            if (filter.name) {
                query.andWhere('(lower(site.name) LIKE :name)', {
                    name: `%${filter.name.toLowerCase()}%`,
                });
            }
            if (filter.status) {
                query.andWhere('site.status = :status', { status: filter.status });
            }
            if (filter.regionId) {
                query.andWhere('site.region = :region', {
                    region: filter.regionId,
                });
            }
            if (filter.adminId) {
                query.innerJoin('site.admins', 'adminsAssociation', 'adminsAssociation.id = :adminId', { adminId: filter.adminId });
            }
            if (filter.hasSpotter) {
                const hasSpotter = filter.hasSpotter.toLowerCase() === 'true';
                query.andWhere(hasSpotter ? 'site.sensor_id IS NOT NULL' : 'site.sensor_id IS NULL');
            }
            const res = yield query
                .leftJoinAndSelect('site.region', 'region')
                .leftJoinAndSelect('site.sketchFab', 'sketchFab')
                .leftJoinAndSelect('site.admins', 'admins')
                .leftJoinAndSelect('site.reefCheckSites', 'reefCheckSites')
                .andWhere('display = true')
                .getMany();
            const mappedSiteData = yield (0, collections_utils_1.getCollectionData)(res, this.latestDataRepository);
            const hasHoboDataSet = yield (0, site_utils_1.hasHoboDataSubQuery)(this.sourceRepository);
            const waterQualityDataSet = yield (0, site_utils_1.getWaterQualityDataSubQuery)(this.latestDataRepository);
            const reefCheckDataSet = yield (0, site_utils_1.getReefCheckDataSubQuery)(this.reefCheckSurveyRepository);
            return res.map((site) => (Object.assign(Object.assign({}, site), { applied: site.applied, collectionData: mappedSiteData[site.id], hasHobo: hasHoboDataSet.has(site.id), waterQualitySources: waterQualityDataSet.get(site.id), reefCheckData: reefCheckDataSet[site.id] })));
        });
    }
    findOne(id) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const site = yield (0, site_utils_1.getSite)(id, this.sitesRepository, [
                'region',
                'admins',
                'historicalMonthlyMean',
                'siteApplication',
                'sketchFab',
                'reefCheckSurveys',
                'reefCheckSites',
            ], true);
            // Typeorm returns undefined instead of [] for
            // OneToMany relations, so we fix it to match OpenAPI specs:
            const surveys = site.surveys || [];
            const historicalMonthlyMean = site.historicalMonthlyMean || [];
            const videoStream = yield this.checkVideoStream(site);
            const mappedSiteData = yield (0, collections_utils_1.getCollectionData)([site], this.latestDataRepository);
            const maskedSpotterApiToken = site.spotterApiToken
                ? `****${(_a = site.spotterApiToken) === null || _a === void 0 ? void 0 : _a.slice(-4)}`
                : undefined;
            return {
                id: site.id,
                name: site.name,
                sensorId: site.sensorId,
                reefCheckSurveys: (_b = site.reefCheckSurveys) !== null && _b !== void 0 ? _b : [],
                reefCheckSites: (_c = site.reefCheckSites) !== null && _c !== void 0 ? _c : [],
                polygon: site.polygon,
                nearestNOAALocation: site.nearestNOAALocation,
                depth: site.depth,
                iframe: site.iframe,
                status: site.status,
                maxMonthlyMean: site.maxMonthlyMean,
                timezone: site.timezone,
                display: site.display,
                createdAt: site.createdAt,
                updatedAt: site.updatedAt,
                region: site.region,
                admins: site.admins,
                siteApplication: site.siteApplication,
                sketchFab: site.sketchFab,
                maskedSpotterApiToken,
                surveys,
                historicalMonthlyMean,
                videoStream,
                applied: site.applied,
                collectionData: mappedSiteData[site.id],
            };
        });
    }
    checkIframeURL(iframe) {
        if (!iframe)
            return undefined;
        const sanitizedIframeURL = (0, sanitize_url_1.sanitizeUrl)(iframe);
        const trustedHosts = ['aqualink.org'];
        try {
            const iframeAsURL = new URL(sanitizedIframeURL);
            if (iframeAsURL.protocol !== 'https:')
                throw new Error('Invalid protocol');
            if (iframeAsURL.port !== '')
                throw new Error('Invalid port');
            if (!trustedHosts.find((x) => x === iframeAsURL.hostname))
                throw new Error('Invalid hostname');
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return sanitizedIframeURL;
    }
    update(id, updateSiteDto, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((updateSiteDto.display ||
                updateSiteDto.status ||
                updateSiteDto.videoStream ||
                updateSiteDto.contactInformation) &&
                user.adminLevel !== users_entity_1.AdminLevel.SuperAdmin) {
                throw new common_1.ForbiddenException();
            }
            const { coordinates, adminIds, regionId, iframe } = updateSiteDto;
            const updateRegion = regionId !== undefined ? { region: { id: regionId } } : {};
            const updateCoordinates = coordinates
                ? {
                    polygon: (0, coordinates_1.createPoint)(coordinates.longitude, coordinates.latitude),
                }
                : {};
            const checkedIframe = this.checkIframeURL(iframe);
            const updateIframe = checkedIframe ? { iframe: checkedIframe } : {};
            const result = yield this.sitesRepository
                .update(id, Object.assign(Object.assign(Object.assign(Object.assign({}, (0, lodash_1.omit)(updateSiteDto, ['adminIds', 'coordinates', 'regionId'])), updateRegion), updateCoordinates), updateIframe))
                .catch(site_utils_1.handleDuplicateSite);
            if (coordinates) {
                this.scheduledUpdateRepository.save({ site: { id } });
            }
            if (adminIds) {
                yield this.updateAdmins(id, adminIds);
            }
            if (!result.affected) {
                throw new common_1.NotFoundException(`Site with ID ${id} not found.`);
            }
            const updated = yield this.sitesRepository.findOne({
                where: { id },
                relations: ['admins'],
            });
            return updated;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.sitesRepository.delete(id);
            if (!result.affected) {
                throw new common_1.NotFoundException(`Site with ID ${id} not found.`);
            }
        });
    }
    findDailyData(id, start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, site_utils_1.getSite)(id, this.sitesRepository);
            if ((start && !luxon_extensions_1.DateTime.fromISO(start).isValid) ||
                (end && !luxon_extensions_1.DateTime.fromISO(end).isValid)) {
                throw new common_1.BadRequestException('Start or end is not a valid date');
            }
            return this.dailyDataRepository
                .createQueryBuilder('daily_data')
                .where('site_id = :id', { id })
                .orderBy('date', 'DESC')
                .andWhere('date <= :endDate', {
                endDate: (end && new Date(end)) || new Date(),
            })
                .andWhere('date >= :startDate', {
                startDate: new Date(start || 0),
            })
                .limit(start && end ? undefined : 90)
                .getMany();
        });
    }
    findSpotterPosition(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const site = yield (0, site_utils_1.getSite)(id, this.sitesRepository, ['historicalMonthlyMean'], true);
            const isDeployed = site.status === sites_entity_1.SiteStatus.Deployed;
            const { sensorId } = site;
            if (!sensorId)
                return {
                    timestamp: undefined,
                    isDeployed,
                    position: undefined,
                };
            const sofarToken = site.spotterApiToken || process.env.SOFAR_API_TOKEN;
            const spotterLatest = yield (0, sofar_1.sofarLatest)({ sensorId, token: sofarToken });
            if (!spotterLatest) {
                return {
                    isDeployed: false,
                    timestamp: undefined,
                    position: undefined,
                };
            }
            const lastTrack = spotterLatest.track &&
                spotterLatest.track.length &&
                spotterLatest.track[spotterLatest.track.length - 1];
            const spotterData = lastTrack
                ? {
                    longitude: {
                        value: lastTrack.longitude,
                        timestamp: lastTrack.timestamp,
                    },
                    latitude: {
                        value: lastTrack.latitude,
                        timestamp: lastTrack.timestamp,
                    },
                }
                : {};
            return Object.assign({ isDeployed, timestamp: (_a = spotterData.latitude) === null || _a === void 0 ? void 0 : _a.timestamp }, (spotterData.longitude &&
                spotterData.latitude && {
                position: {
                    longitude: spotterData.longitude.value,
                    latitude: spotterData.latitude.value,
                },
            }));
        });
    }
    findLatestData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const site = yield (0, site_utils_1.getSite)(id, this.sitesRepository, [
                'historicalMonthlyMean',
            ]);
            return (0, site_utils_1.getLatestData)(site, this.latestDataRepository);
        });
    }
    getSpotterData(id, start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            const site = yield (0, site_utils_1.getSite)(id, this.sitesRepository, undefined, true);
            const { startDate, endDate } = (0, dates_1.getDefaultDates)(start, end);
            if (!site.sensorId) {
                throw new common_1.NotFoundException(`Site with ${id} has no spotter.`);
            }
            const exclusionDates = yield (0, site_utils_1.getConflictingExclusionDates)(this.exclusionDatesRepository, site.sensorId, startDate, endDate);
            const sofarToken = site.spotterApiToken || process.env.SOFAR_API_TOKEN;
            const { topTemperature, bottomTemperature } = yield (0, sofar_1.getSpotterData)(site.sensorId, sofarToken, endDate, startDate);
            return {
                topTemperature: (0, site_utils_1.filterMetricDataByDate)(exclusionDates, topTemperature) || [],
                bottomTemperature: (0, site_utils_1.filterMetricDataByDate)(exclusionDates, bottomTemperature) || [],
            };
        });
    }
    deploySpotter(id, deploySpotterDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { endDate } = deploySpotterDto;
            const site = yield (0, site_utils_1.getSite)(id, this.sitesRepository);
            if (!site.sensorId) {
                throw new common_1.BadRequestException(`Site with ID ${id} has no spotter`);
            }
            if (site.status === sites_entity_1.SiteStatus.Deployed) {
                throw new common_1.BadRequestException(`Site with ID ${id} is already deployed`);
            }
            // Run update queries concurrently
            yield Promise.all([
                this.sitesRepository.update(id, {
                    status: sites_entity_1.SiteStatus.Deployed,
                }),
                this.exclusionDatesRepository.save({
                    sensorId: site.sensorId,
                    endDate,
                }),
            ]);
        });
    }
    addExclusionDates(id, excludeSpotterDatesDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateFormat = 'LL/dd/yyyy HH:mm';
            const { startDate, endDate } = excludeSpotterDatesDto;
            const site = yield (0, site_utils_1.getSite)(id, this.sitesRepository);
            if (!site.sensorId) {
                throw new common_1.BadRequestException(`Site with ID ${id} has no spotter`);
            }
            if (startDate >= endDate) {
                throw new common_1.BadRequestException('Start date should be less than the end date');
            }
            const sources = yield this.sourceRepository.find({
                where: {
                    site: { id: site.id },
                    type: source_type_enum_1.SourceType.SPOTTER,
                },
            });
            bluebird_1.default.Promise.each(sources, (source) => __awaiter(this, void 0, void 0, function* () {
                if (!source.sensorId) {
                    throw new common_1.BadRequestException('Cannot delete spotter with missing sensorId');
                }
                this.logger.log(`Deleting time-series data for spotter ${source.sensorId} ; site ${site.id}`);
                const alreadyExists = yield this.exclusionDatesRepository.findOne({
                    where: { sensorId: source.sensorId, startDate, endDate },
                });
                if (alreadyExists) {
                    throw new common_1.ConflictException(`Exclusion period [${luxon_extensions_1.DateTime.fromJSDate(startDate).toFormat(dateFormat)}, ${luxon_extensions_1.DateTime.fromJSDate(endDate).toFormat(dateFormat)}] already exists for spotter ${source.sensorId}.`);
                }
                yield this.exclusionDatesRepository.save({
                    sensorId: source.sensorId,
                    endDate,
                    startDate,
                });
                yield this.timeSeriesRepository
                    .createQueryBuilder('time-series')
                    .where('source_id = :id', { id: source.id })
                    .andWhere('timestamp <= :endDate', {
                    endDate: new Date(endDate),
                })
                    .andWhere('timestamp >= :startDate', {
                    startDate: new Date(startDate),
                })
                    .delete()
                    .execute();
            }));
        });
    }
    getExclusionDates(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const site = yield (0, site_utils_1.getSite)(id, this.sitesRepository);
            if (!site.sensorId) {
                throw new common_1.BadRequestException(`Site with ID ${id} has no spotter`);
            }
            return this.exclusionDatesRepository.find({
                where: {
                    sensorId: site.sensorId,
                },
            });
        });
    }
    updateAdmins(id, adminIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const site = yield (0, site_utils_1.getSite)(id, this.sitesRepository, ['admins']);
            yield this.sitesRepository
                .createQueryBuilder('sites')
                .update()
                .relation('admins')
                .of(site)
                .addAndRemove(adminIds, site.admins);
        });
    }
    checkVideoStream(site) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if site has a video stream url
            if (!site.videoStream) {
                return null;
            }
            const isPlaylist = site.videoStream.includes('videoseries');
            const apiKey = process.env.FIREBASE_API_KEY;
            // Api key must be specified for the process to continue
            if (!apiKey) {
                // Log an explicit error
                this.logger.error('No google api key was defined');
                return null;
            }
            const videoId = (0, urls_1.getYouTubeVideoId)(site.videoStream, isPlaylist);
            // Video id could not be extracted, because the video stream url wan not in the correct format
            if (!videoId) {
                return null;
            }
            const rsp = yield (0, check_video_streams_1.fetchVideoDetails)([videoId], apiKey, isPlaylist);
            // Video was not found.
            if (!rsp.data.items.length) {
                return null;
            }
            const msg = (0, check_video_streams_1.getErrorMessage)(rsp.data.items[0], isPlaylist);
            // An error was returned (Video is not live, it is not public etc).
            if (msg) {
                return null;
            }
            // All checks passed, return video stream url.
            return site.videoStream;
        });
    }
    getContactInformation(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { contactInformation } = yield (0, site_utils_1.getSite)(siteId, this.sitesRepository, undefined, true);
            return { contactInformation };
        });
    }
};
SitesService = SitesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sites_entity_1.Site)),
    __param(1, (0, typeorm_1.InjectRepository)(site_applications_entity_1.SiteApplication)),
    __param(2, (0, typeorm_1.InjectRepository)(daily_data_entity_1.DailyData)),
    __param(3, (0, typeorm_1.InjectRepository)(regions_entity_1.Region)),
    __param(4, (0, typeorm_1.InjectRepository)(exclusion_dates_entity_1.ExclusionDates)),
    __param(5, (0, typeorm_1.InjectRepository)(historical_monthly_mean_entity_1.HistoricalMonthlyMean)),
    __param(6, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(7, (0, typeorm_1.InjectRepository)(sources_entity_1.Sources)),
    __param(8, (0, typeorm_1.InjectRepository)(latest_data_entity_1.LatestData)),
    __param(9, (0, typeorm_1.InjectRepository)(time_series_entity_1.TimeSeries)),
    __param(10, (0, typeorm_1.InjectRepository)(scheduled_updates_entity_1.ScheduledUpdate)),
    __param(11, (0, typeorm_1.InjectRepository)(reef_check_surveys_entity_1.ReefCheckSurvey)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], SitesService);
exports.SitesService = SitesService;
