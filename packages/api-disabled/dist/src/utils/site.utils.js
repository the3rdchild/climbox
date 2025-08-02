"use strict";
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
exports.createSite = exports.getLatestData = exports.getReefCheckDataSubQuery = exports.getWaterQualityDataSubQuery = exports.hasHoboDataSubQuery = exports.getSiteFromSensorId = exports.getSiteAndSurveyPoint = exports.surveyPointBelongsToSite = exports.getSite = exports.getAllColumns = exports.excludeSpotterData = exports.filterMetricDataByDate = exports.getConflictingExclusionDates = exports.getExclusionDates = exports.handleDuplicateSite = exports.getTimezones = exports.getRegion = exports.getGoogleRegion = void 0;
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const geo_tz_1 = __importDefault(require("geo-tz"));
const coordinates_1 = require("./coordinates");
const source_type_enum_1 = require("../sites/schemas/source-type.enum");
const temperature_1 = require("./temperature");
const metrics_enum_1 = require("../time-series/metrics.enum");
const googleMapsClient = new google_maps_services_js_1.Client({});
const logger = new common_1.Logger('Site Utils');
const getLocality = (results) => {
    const localityPreference = [
        google_maps_services_js_1.AddressType.administrative_area_level_2,
        google_maps_services_js_1.AddressType.administrative_area_level_1,
        google_maps_services_js_1.AddressType.locality,
        google_maps_services_js_1.AddressType.country,
    ];
    if (results.length === 0) {
        return undefined;
    }
    const result = localityPreference.reduce((tempResult, locality) => {
        const localityResult = results.find((r) => r.types.includes(locality));
        return tempResult || localityResult;
    }, undefined);
    return result ? result.formatted_address : results[0].formatted_address;
};
const getGoogleRegion = (longitude, latitude) => __awaiter(void 0, void 0, void 0, function* () {
    return googleMapsClient
        .reverseGeocode({
        params: {
            latlng: [latitude, longitude],
            result_type: [google_maps_services_js_1.AddressType.country],
            key: process.env.GOOGLE_MAPS_API_KEY || '',
        },
    })
        .then((r) => {
        const { results } = r.data;
        return getLocality(results);
    })
        .catch((e) => {
        logger.error(e.response
            ? e.response.data.error_message
            : 'An unknown error occurred.', e);
        return undefined;
    });
});
exports.getGoogleRegion = getGoogleRegion;
const getRegion = (longitude, latitude, regionRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const country = yield (0, exports.getGoogleRegion)(longitude, latitude);
    // undefined values would result in the first database item
    // https://github.com/typeorm/typeorm/issues/2500
    const region = country
        ? yield regionRepository.findOne({ where: { name: country } })
        : null;
    if (region) {
        return region;
    }
    return country
        ? regionRepository.save({
            name: country,
            polygon: (0, coordinates_1.createPoint)(longitude, latitude),
        })
        : undefined;
});
exports.getRegion = getRegion;
const getTimezones = (latitude, longitude) => {
    return (0, geo_tz_1.default)(latitude, longitude);
};
exports.getTimezones = getTimezones;
const handleDuplicateSite = (err) => {
    // Unique Violation: A site already exists at these coordinates
    if (err.code === '23505') {
        throw new common_1.BadRequestException('A site already exists at these coordinates');
    }
    logger.error('An unexpected error occurred', err);
    throw new common_1.InternalServerErrorException('An unexpected error occurred');
};
exports.handleDuplicateSite = handleDuplicateSite;
const getExclusionDates = (exclusionDatesRepository, sensorId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!sensorId) {
        return [];
    }
    return exclusionDatesRepository
        .createQueryBuilder('exclusion')
        .where('exclusion.sensor_id = :sensorId', {
        sensorId,
    })
        .getMany();
});
exports.getExclusionDates = getExclusionDates;
const getConflictingExclusionDates = (exclusionDatesRepository, sensorId, start, end) => __awaiter(void 0, void 0, void 0, function* () {
    const allDates = yield (0, exports.getExclusionDates)(exclusionDatesRepository, sensorId);
    return allDates.filter((exclusionDate) => start <= exclusionDate.endDate &&
        (!exclusionDate.startDate || exclusionDate.startDate <= end));
});
exports.getConflictingExclusionDates = getConflictingExclusionDates;
const filterMetricDataByDate = (exclusionDates, metricData) => metricData === null || metricData === void 0 ? void 0 : metricData.filter(({ timestamp }) => 
// Filter data that do not belong at any `[startDate, endDate]` exclusion date interval
!(0, lodash_1.some)(exclusionDates, ({ startDate, endDate }) => {
    const dataDate = new Date(timestamp);
    return dataDate <= endDate && (!startDate || startDate <= dataDate);
}));
exports.filterMetricDataByDate = filterMetricDataByDate;
const excludeSpotterData = (data, exclusionDates) => {
    if (exclusionDates.length === 0) {
        return data;
    }
    return (0, lodash_1.mapValues)(data, (metricData) => (0, exports.filterMetricDataByDate)(exclusionDates, metricData));
};
exports.excludeSpotterData = excludeSpotterData;
/**
 * Returns all columns from a Entity, including "select: false"
 * @param repository The repository of the Entity
 */
function getAllColumns(repository) {
    return repository.metadata.columns.map((col) => col.propertyName);
}
exports.getAllColumns = getAllColumns;
const getSite = (siteId, siteRepository, relations, includeAll = false) => __awaiter(void 0, void 0, void 0, function* () {
    const site = yield siteRepository.findOne(Object.assign({ where: { id: siteId }, relations }, (includeAll ? { select: getAllColumns(siteRepository) } : {})));
    if (!site) {
        throw new common_1.NotFoundException(`Site with id ${siteId} does not exist`);
    }
    return site;
});
exports.getSite = getSite;
const surveyPointBelongsToSite = (siteId, pointId, surveyPointRepository) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const surveyPoint = yield surveyPointRepository.findOne({
        where: { id: pointId },
    });
    if (((_a = surveyPoint === null || surveyPoint === void 0 ? void 0 : surveyPoint.siteId) === null || _a === void 0 ? void 0 : _a.toString()) !== siteId.toString()) {
        throw new common_1.BadRequestException(`Survey point with id ${surveyPoint === null || surveyPoint === void 0 ? void 0 : surveyPoint.id} does not belong to site with id ${siteId}.`);
    }
});
exports.surveyPointBelongsToSite = surveyPointBelongsToSite;
const getSiteAndSurveyPoint = (siteId, surveyPointId, siteRepository, surveyPointRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const site = yield (0, exports.getSite)(siteId, siteRepository);
    const surveyPoint = yield surveyPointRepository.findOne({
        where: { id: surveyPointId },
    });
    if (!surveyPoint) {
        throw new common_1.NotFoundException(`Survey point with id ${surveyPointId} does not exist`);
    }
    yield (0, exports.surveyPointBelongsToSite)(site.id, surveyPoint.id, surveyPointRepository);
    return { site, surveyPoint };
});
exports.getSiteAndSurveyPoint = getSiteAndSurveyPoint;
const getSiteFromSensorId = (sensorId, siteRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const site = yield siteRepository.findOne({ where: { sensorId } });
    if (!site) {
        throw new common_1.NotFoundException(`No site exists with sensor ID ${sensorId}`);
    }
    return site;
});
exports.getSiteFromSensorId = getSiteFromSensorId;
const hasHoboDataSubQuery = (sourceRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const hasHoboData = yield sourceRepository
        .createQueryBuilder('sources')
        .select('site_id', 'siteId')
        .where(`type = '${source_type_enum_1.SourceType.HOBO}'`)
        .groupBy('site_id')
        .getRawMany();
    const hasHoboDataSet = new Set();
    hasHoboData.forEach((row) => {
        hasHoboDataSet.add(row.siteId);
    });
    return hasHoboDataSet;
});
exports.hasHoboDataSubQuery = hasHoboDataSubQuery;
const getWaterQualityDataSubQuery = (latestDataRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const latestData = yield latestDataRepository
        .createQueryBuilder('water_quality_data')
        .select('site_id', 'siteId')
        .addSelect('metric')
        .addSelect('source')
        .where(`source in ('${source_type_enum_1.SourceType.HUI}', '${source_type_enum_1.SourceType.SONDE}')`)
        .getRawMany();
    const sondeMetrics = [
        metrics_enum_1.Metric.ODO_CONCENTRATION,
        metrics_enum_1.Metric.CHOLOROPHYLL_CONCENTRATION,
        metrics_enum_1.Metric.PH,
        metrics_enum_1.Metric.SALINITY,
        metrics_enum_1.Metric.TURBIDITY,
    ];
    const waterQualityDataSet = new Map();
    Object.entries((0, lodash_1.groupBy)(latestData, (o) => o.siteId)).forEach(([siteId, data]) => {
        let sondeMetricsCount = 0;
        const id = Number(siteId);
        waterQualityDataSet.set(id, []);
        data.forEach((siteData) => {
            if (siteData.source === 'hui') {
                // eslint-disable-next-line fp/no-mutating-methods
                waterQualityDataSet.get(id).push('hui');
            }
            if (sondeMetrics.includes(siteData.metric)) {
                // eslint-disable-next-line fp/no-mutation
                sondeMetricsCount += 1;
                if (sondeMetricsCount >= 3) {
                    // eslint-disable-next-line fp/no-mutating-methods
                    waterQualityDataSet.get(id).push('sonde');
                }
            }
        });
    });
    return waterQualityDataSet;
});
exports.getWaterQualityDataSubQuery = getWaterQualityDataSubQuery;
/**
 * Get all reef check related data like organisms and substrates spotted each site
 * This information is intented to be used to filter sites
 */
const getReefCheckDataSubQuery = (reefCheckSurveyRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const organisms = yield reefCheckSurveyRepository
        .createQueryBuilder('survey')
        .select('survey.site_id', 'siteId')
        .addSelect('json_agg(distinct rco.organism)', 'organism')
        .leftJoin('reef_check_organism', 'rco', 'rco.survey_id = survey.id')
        .where('(rco.s1 + rco.s2 + rco.s3 + rco.s4) > 0')
        .addGroupBy('survey.site_id')
        .getRawMany();
    const substrates = yield reefCheckSurveyRepository
        .createQueryBuilder('survey')
        .select('survey.site_id', 'siteId')
        .addSelect('json_agg(distinct substrate_code)', 'substrate')
        .leftJoin('reef_check_substrate', 'rcs', 'survey_id = survey.id')
        .where('(rcs.s1 + rcs.s2 + rcs.s3 + rcs.s4) > 0')
        .addGroupBy('survey.site_id')
        .getRawMany();
    const impact = yield reefCheckSurveyRepository
        .createQueryBuilder('survey')
        .select('survey.site_id', 'siteId')
        .addSelect('json_agg(distinct overall_anthro_impact)', 'impact')
        .addGroupBy('survey.site_id')
        .getRawMany();
    return (0, lodash_1.merge)((0, lodash_1.keyBy)(organisms, 'siteId'), (0, lodash_1.keyBy)(substrates, 'siteId'), (0, lodash_1.keyBy)(impact, 'siteId'));
});
exports.getReefCheckDataSubQuery = getReefCheckDataSubQuery;
const getLatestData = (site, latestDataRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return latestDataRepository.findBy({
        site: { id: site.id },
    });
});
exports.getLatestData = getLatestData;
const createSite = (name, depth, longitude, latitude, regionRepository, sitesRepository, historicalMonthlyMeanRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const region = yield (0, exports.getRegion)(longitude, latitude, regionRepository);
    const maxMonthlyMean = yield (0, temperature_1.getMMM)(longitude, latitude);
    const historicalMonthlyMeans = yield (0, temperature_1.getHistoricalMonthlyMeans)(longitude, latitude);
    const timezones = (0, exports.getTimezones)(latitude, longitude);
    const site = yield sitesRepository
        .save({
        name,
        region,
        polygon: (0, coordinates_1.createPoint)(longitude, latitude),
        maxMonthlyMean,
        timezone: timezones[0],
        display: false,
        depth,
    })
        .catch(exports.handleDuplicateSite);
    if (!maxMonthlyMean) {
        logger.warn(`Max Monthly Mean appears to be null for Site ${site.id} at (lat, lon): (${latitude}, ${longitude}) `);
    }
    yield Promise.all(historicalMonthlyMeans.map(({ month, temperature }) => __awaiter(void 0, void 0, void 0, function* () {
        return (temperature &&
            historicalMonthlyMeanRepository.insert({
                site,
                month,
                temperature,
            }));
    })));
    return site;
});
exports.createSite = createSite;
