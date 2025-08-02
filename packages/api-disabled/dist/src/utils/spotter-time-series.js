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
exports.addSpotterData = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const bluebird_1 = __importDefault(require("bluebird"));
const turf_1 = require("@turf/turf");
const luxon_extensions_1 = require("../luxon-extensions");
const sofar_1 = require("./sofar");
const sofar_types_1 = require("./sofar.types");
const source_type_enum_1 = require("../sites/schemas/source-type.enum");
const site_utils_1 = require("./site.utils");
const time_series_utils_1 = require("./time-series.utils");
const metrics_enum_1 = require("../time-series/metrics.enum");
const MAX_DISTANCE_FROM_SITE = 50;
const logger = new common_1.Logger('SpotterTimeSeries');
/**
 * Fetches the exclusion dates for the selected sources.
 * @param sources The selected sources
 * @param exclusionDatesRepository The necessary repository to perform the query
 * @returns The requested exclusion date entities
 */
const getSpotterExclusionDates = (sources, exclusionDatesRepository) => sources.map((source) => {
    var _a;
    return exclusionDatesRepository.find({
        where: {
            sensorId: (_a = source.sensorId) !== null && _a !== void 0 ? _a : (0, typeorm_1.IsNull)(),
        },
    });
});
/**
 * Save data on time_series table
 * @param batch The batch of data to save
 * @param source The source of the data
 * @param metric The metric of data
 * @param timeSeriesRepository The needed repository to perform the query
 * @returns An InsertResult
 */
const saveDataBatch = (batch, source, metric, timeSeriesRepository) => {
    // TODO - Filter out nil values
    return timeSeriesRepository
        .createQueryBuilder('time_series')
        .insert()
        .values(batch.map((data) => ({
        metric,
        value: data.value,
        timestamp: luxon_extensions_1.DateTime.fromISO(data.timestamp)
            .startOf('minute')
            .toJSDate(),
        source,
    })))
        .onConflict('ON CONSTRAINT "no_duplicate_data" DO NOTHING')
        .execute();
};
/**
 * Fetch spotter and wave data from sofar and save them on time_series table
 * @param siteIds The siteIds for which to perform the update
 * @param days How many days will this script need to backfill (1 = daily update)
 * @param repositories The needed repositories, as defined by the interface
 */
const addSpotterData = (siteIds, days, repositories, skipDistanceCheck = false) => __awaiter(void 0, void 0, void 0, function* () {
    logger.log('Fetching sites');
    // Fetch all sites
    const sites = yield repositories.siteRepository.find({
        where: Object.assign(Object.assign({}, (siteIds.length > 0 ? { id: (0, typeorm_1.In)(siteIds) } : {})), { sensorId: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) }),
        select: ['id', 'sensorId', 'spotterApiToken', 'polygon'],
    });
    logger.log('Fetching sources');
    // Fetch sources
    const spotterSources = yield Promise.all((0, time_series_utils_1.getSources)(sites, source_type_enum_1.SourceType.SPOTTER, repositories.sourceRepository));
    const exclusionDates = yield Promise.all(getSpotterExclusionDates(spotterSources, repositories.exclusionDatesRepository));
    // Create a map from the siteIds to the source entities
    const siteToSource = Object.fromEntries(spotterSources.map((source) => [source.site.id, source]));
    const sensorToExclusionDates = Object.fromEntries(exclusionDates
        .filter((exclusionDate) => { var _a; return (_a = exclusionDate === null || exclusionDate === void 0 ? void 0 : exclusionDate[0]) === null || _a === void 0 ? void 0 : _a.sensorId; })
        .map((exclusionDate) => [exclusionDate[0].sensorId, exclusionDate]));
    logger.log('Saving spotter data');
    yield bluebird_1.default.map(sites, (site) => bluebird_1.default.map((0, lodash_1.times)(days), (i) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const startDate = luxon_extensions_1.DateTime.now()
            .minus({ days: i })
            .startOf('day')
            .toJSDate();
        const endDate = luxon_extensions_1.DateTime.now()
            .minus({ days: i })
            .endOf('day')
            .toJSDate();
        if (!site.sensorId) {
            return sofar_types_1.DEFAULT_SPOTTER_DATA_VALUE;
        }
        const sensorExclusionDates = (0, lodash_1.get)(sensorToExclusionDates, site.sensorId, []);
        const sofarToken = site.spotterApiToken || process.env.SOFAR_API_TOKEN;
        // Fetch spotter and wave data from sofar
        const spotterData = yield (0, sofar_1.getSpotterData)(site.sensorId, sofarToken, endDate, startDate).then((data) => (0, site_utils_1.excludeSpotterData)(data, sensorExclusionDates));
        if (!skipDistanceCheck &&
            ((_a = spotterData === null || spotterData === void 0 ? void 0 : spotterData.latitude) === null || _a === void 0 ? void 0 : _a.length) &&
            ((_b = spotterData === null || spotterData === void 0 ? void 0 : spotterData.longitude) === null || _b === void 0 ? void 0 : _b.length)) {
            // Check if spotter is within specified distance from its site, else don't return any data.
            const dist = (0, turf_1.distance)(site.polygon.coordinates, [spotterData.longitude[0].value, spotterData.latitude[0].value], { units: 'kilometers' });
            if (dist > MAX_DISTANCE_FROM_SITE) {
                logger.warn(`Spotter is over ${MAX_DISTANCE_FROM_SITE}km from site ${site.id}. Data will not be saved.`);
                return sofar_types_1.DEFAULT_SPOTTER_DATA_VALUE;
            }
        }
        return spotterData;
    }), { concurrency: 100 })
        .then((spotterData) => {
        const dataLabels = [
            ['topTemperature', metrics_enum_1.Metric.TOP_TEMPERATURE],
            ['bottomTemperature', metrics_enum_1.Metric.BOTTOM_TEMPERATURE],
            ['significantWaveHeight', metrics_enum_1.Metric.SIGNIFICANT_WAVE_HEIGHT],
            ['waveMeanDirection', metrics_enum_1.Metric.WAVE_MEAN_DIRECTION],
            ['waveMeanPeriod', metrics_enum_1.Metric.WAVE_MEAN_PERIOD],
            ['windDirection', metrics_enum_1.Metric.WIND_DIRECTION],
            ['windSpeed', metrics_enum_1.Metric.WIND_SPEED],
            ['barometerTop', metrics_enum_1.Metric.BAROMETRIC_PRESSURE_TOP],
            ['barometerBottom', metrics_enum_1.Metric.BAROMETRIC_PRESSURE_BOTTOM],
            ['barometricTopDiff', metrics_enum_1.Metric.BAROMETRIC_PRESSURE_TOP_DIFF],
            ['surfaceTemperature', metrics_enum_1.Metric.SURFACE_TEMPERATURE],
        ];
        // Save data to time_series
        return Promise.all(spotterData
            .map((dailySpotterData) => dataLabels.map(([spotterDataLabel, metric]) => saveDataBatch(dailySpotterData[spotterDataLabel], // We know that there would not be any undefined values here
        siteToSource[site.id], metric, repositories.timeSeriesRepository)))
            .flat());
    })
        .then(() => {
        // After each successful execution, log the event
        const startDate = luxon_extensions_1.DateTime.now()
            .minus({ days: days - 1 })
            .startOf('day');
        const endDate = luxon_extensions_1.DateTime.now().endOf('day');
        logger.debug(`Spotter data updated for ${site.sensorId} between ${startDate} and ${endDate}`);
    }), { concurrency: 1 });
    // Update materialized view
    yield (0, time_series_utils_1.refreshMaterializedView)(repositories.siteRepository);
});
exports.addSpotterData = addSpotterData;
