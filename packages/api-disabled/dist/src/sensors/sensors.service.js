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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const typeorm_2 = require("typeorm");
const sites_entity_1 = require("../sites/sites.entity");
const surveys_entity_1 = require("../surveys/surveys.entity");
const time_series_entity_1 = require("../time-series/time-series.entity");
const site_utils_1 = require("../utils/site.utils");
const sofar_1 = require("../utils/sofar");
const coordinates_1 = require("../utils/coordinates");
const time_series_utils_1 = require("../utils/time-series.utils");
const daily_data_entity_1 = require("../sites/daily-data.entity");
const sources_entity_1 = require("../sites/sources.entity");
const source_type_enum_1 = require("../sites/schemas/source-type.enum");
const metrics_enum_1 = require("../time-series/metrics.enum");
let SensorsService = class SensorsService {
    constructor(dailyDataRepository, siteRepository, sourcesRepository, surveyRepository, timeSeriesRepository) {
        this.dailyDataRepository = dailyDataRepository;
        this.siteRepository = siteRepository;
        this.sourcesRepository = sourcesRepository;
        this.surveyRepository = surveyRepository;
        this.timeSeriesRepository = timeSeriesRepository;
    }
    findSensors() {
        return __awaiter(this, void 0, void 0, function* () {
            const sites = yield this.siteRepository.find({
                where: { sensorId: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()) },
                select: (0, site_utils_1.getAllColumns)(this.siteRepository),
            });
            // Get spotter data and add site id to distinguish them
            const spotterData = yield bluebird_1.default.map(sites, (site) => {
                if (site.sensorId === null) {
                    console.warn(`Spotter for site ${site.id} appears null.`);
                }
                const sofarToken = site.spotterApiToken || process.env.SOFAR_API_TOKEN;
                return (0, sofar_1.getSpotterData)(site.sensorId, sofarToken).then((data) => {
                    return Object.assign({ id: site.id }, data);
                });
            }, { concurrency: 10 });
            // Group spotter data by site id for easier search
            const siteIdToSpotterData = (0, lodash_1.keyBy)(spotterData, (o) => o.id);
            // Construct final response
            return sites.map((site) => {
                var _a, _b;
                const data = siteIdToSpotterData[site.id];
                const longitude = (_a = (0, sofar_1.getLatestData)(data.longitude)) === null || _a === void 0 ? void 0 : _a.value;
                const latitude = (_b = (0, sofar_1.getLatestData)(data.latitude)) === null || _b === void 0 ? void 0 : _b.value;
                const sitePosition = site.polygon;
                const { spotterApiToken } = site, rest = __rest(site, ["spotterApiToken"]);
                // If no longitude or latitude is provided by the spotter fallback to the site coordinates
                return Object.assign(Object.assign({}, rest), { applied: site.applied, sensorPosition: (0, coordinates_1.createPoint)(longitude || sitePosition.coordinates[0], latitude || sitePosition.coordinates[1]), sensorType: sites_entity_1.SensorType.SofarSpotter });
            });
        });
    }
    findSensorData(sensorId, metrics, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            metrics.forEach((metric) => {
                if (!Object.values(metrics_enum_1.Metric).includes(metric)) {
                    throw new common_1.BadRequestException(`Metrics array must be in the following format: metric1,metric2 where metric is one of ${Object.values(metrics_enum_1.Metric)}`);
                }
            });
            const site = yield (0, site_utils_1.getSiteFromSensorId)(sensorId, this.siteRepository);
            const data = yield (0, time_series_utils_1.getDataQuery)({
                timeSeriesRepository: this.timeSeriesRepository,
                siteId: site.id,
                metrics: metrics,
                start: startDate,
                end: endDate,
                hourly: false,
            });
            return (0, time_series_utils_1.groupByMetricAndSource)(data);
        });
    }
    findSensorSurveys(sensorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const site = yield (0, site_utils_1.getSiteFromSensorId)(sensorId, this.siteRepository);
            const surveyDetails = yield this.surveyRepository
                .createQueryBuilder('survey')
                .innerJoinAndSelect('survey.surveyMedia', 'surveyMedia')
                .leftJoinAndSelect('surveyMedia.surveyPoint', 'surveyPoints')
                .where('survey.site_id = :siteId', { siteId: site.id })
                .andWhere('surveyMedia.hidden = False')
                .getMany();
            return Promise.all(surveyDetails.map((survey) => __awaiter(this, void 0, void 0, function* () {
                const siteTimeSeries = yield this.getClosestTimeSeriesData(survey.diveDate, survey.siteId, [metrics_enum_1.Metric.BOTTOM_TEMPERATURE, metrics_enum_1.Metric.TOP_TEMPERATURE], [source_type_enum_1.SourceType.SPOTTER]);
                const dailyData = yield this.getClosestDailyData(survey.diveDate, survey.siteId);
                const surveyMedia = yield Promise.all(survey.surveyMedia.map((media) => __awaiter(this, void 0, void 0, function* () {
                    if (!media.surveyPointId) {
                        return media;
                    }
                    const surveyPointTimeSeries = yield this.getClosestTimeSeriesData(survey.diveDate, survey.siteId, [metrics_enum_1.Metric.BOTTOM_TEMPERATURE, metrics_enum_1.Metric.TOP_TEMPERATURE], [source_type_enum_1.SourceType.HOBO], media.surveyPointId);
                    return Object.assign(Object.assign({}, media), { sensorData: surveyPointTimeSeries });
                })));
                return Object.assign(Object.assign({}, survey), { surveyMedia, sensorData: Object.assign(Object.assign({}, siteTimeSeries), dailyData) });
            })));
        });
    }
    getClosestDailyData(diveDate, siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            // We will use this many times in our query, so we declare it as constant
            const diff = `(daily_data.date::timestamp - '${diveDate.toISOString()}'::timestamp)`;
            // We order (ascending) the data by the date difference between the date column and diveData
            // and we grab the first one, which will be the closest one
            const dailyData = yield this.dailyDataRepository
                .createQueryBuilder('daily_data')
                .where('daily_data.site_id = :siteId', { siteId })
                .andWhere(`${diff} < INTERVAL '1 d'`)
                .andWhere(`${diff} > INTERVAL '-1 d'`)
                .orderBy(`(CASE WHEN ${diff} < INTERVAL '0' THEN (-${diff}) ELSE ${diff} END)`, 'ASC')
                .getOne();
            if (!dailyData || !dailyData.satelliteTemperature) {
                return {};
            }
            // create object here to typecheck
            const ret = {
                [source_type_enum_1.SourceType.NOAA]: {
                    satelliteTemperature: {
                        value: dailyData.satelliteTemperature,
                        timestamp: dailyData.date,
                    },
                },
            };
            return ret;
        });
    }
    getClosestTimeSeriesData(diveDate, siteId, metrics, sourceTypes, surveyPointId) {
        return __awaiter(this, void 0, void 0, function* () {
            const surveyPointCondition = surveyPointId
                ? `source.survey_point_id = ${surveyPointId}`
                : 'source.survey_point_id IS NULL';
            // We will use this many times in our query, so we declare it as constant
            const diff = `(time_series.timestamp::timestamp - '${diveDate.toISOString()}'::timestamp)`;
            // First get all sources needed to avoid inner join later
            const sources = yield this.sourcesRepository
                .createQueryBuilder('source')
                .where('source.type IN (:...sourceTypes)', { sourceTypes })
                .andWhere('source.site_id = :siteId', { siteId })
                .andWhere(surveyPointCondition)
                .getMany();
            if (!sources.length) {
                return {};
            }
            // Create map from source_id to source entity
            const sourceMap = (0, lodash_1.keyBy)(sources, (source) => source.id);
            // Grab all data at an interval of +/- 24 hours around the diveDate
            // Order (descending) those data by the absolute time distance between the data and the survey diveDate
            // This way the closest data point for each metric for each source type will be the last row
            const timeSeriesData = yield this.timeSeriesRepository
                .createQueryBuilder('time_series')
                .select('time_series.timestamp', 'timestamp')
                .addSelect('time_series.value', 'value')
                .addSelect('time_series.metric', 'metric')
                .addSelect('time_series.source_id', 'source')
                .where(`${diff} < INTERVAL '1 d'`)
                .andWhere(`${diff} > INTERVAL '-1 d'`)
                .andWhere('time_series.metric IN (:...metrics)', { metrics })
                .andWhere('time_series.source_id IN (:...sourceIds)', {
                sourceIds: Object.keys(sourceMap),
            })
                .orderBy(`time_series.source_id, metric, (CASE WHEN ${diff} < INTERVAL '0' THEN (-${diff}) ELSE ${diff} END)`, 'DESC')
                .getRawMany();
            // Group the data by source id
            const groupedData = (0, lodash_1.groupBy)(timeSeriesData, (o) => o.source);
            return Object.keys(groupedData).reduce((data, key) => {
                return Object.assign(Object.assign({}, data), { 
                    // Replace source id by source using the mapped source object
                    // Keep only timestamps and value from the resulting objects
                    [sourceMap[key].type]: (0, lodash_1.mapValues)(
                    // Use key by to group the data by metric and keep only the last entry, i.e. the closest one
                    (0, lodash_1.mapKeys)((0, lodash_1.keyBy)(groupedData[key], (grouped) => grouped.metric), (_v, k) => (0, lodash_1.camelCase)(k)), (v) => ({ timestamp: v.timestamp, value: v.value })) });
            }, {});
        });
    }
};
SensorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(daily_data_entity_1.DailyData)),
    __param(1, (0, typeorm_1.InjectRepository)(sites_entity_1.Site)),
    __param(2, (0, typeorm_1.InjectRepository)(sources_entity_1.Sources)),
    __param(3, (0, typeorm_1.InjectRepository)(surveys_entity_1.Survey)),
    __param(4, (0, typeorm_1.InjectRepository)(time_series_entity_1.TimeSeries)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SensorsService);
exports.SensorsService = SensorsService;
