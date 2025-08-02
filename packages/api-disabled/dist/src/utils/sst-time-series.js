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
exports.updateSST = void 0;
const common_1 = require("@nestjs/common");
const bluebird_1 = __importDefault(require("bluebird"));
const typeorm_1 = require("typeorm");
const lodash_1 = require("lodash");
const luxon_extensions_1 = require("../luxon-extensions");
const constants_1 = require("./constants");
const sofar_1 = require("./sofar");
const time_series_utils_1 = require("./time-series.utils");
const bleachingAlert_1 = require("./bleachingAlert");
const metrics_enum_1 = require("../time-series/metrics.enum");
const MAX_SOFAR_DATE_DIFF_DAYS = 7;
// Initialize Nest logger
const logger = new common_1.Logger('SSTTimeSeries');
/**
 * The daily global 5km SSTA product requires a daily climatology to calculate the daily SST anomalies.
 * Daily climatologies (DC) are derived from the monthly mean (MM) climatology via linear interpolation.
 * To achieve this, we assigned the MM value to the 15th day of each corresponding month, with the individual
 * days between these dates being derived using linear interpolation. We then calculate the SSTA product using:
 *
 * ST_anomaly = SST - DC
 *
 * where the SST is the value for the day in question, and DC is the corresponding daily climatology for that
 * day of the year.
 * */
const getSstAnomaly = (historicalMonthlyMean, satelliteTemperature) => {
    if (historicalMonthlyMean.length < 12 || !(satelliteTemperature === null || satelliteTemperature === void 0 ? void 0 : satelliteTemperature.value)) {
        return undefined;
    }
    const orderedMontlyMax = (0, lodash_1.sortBy)(historicalMonthlyMean, 'month');
    const now = luxon_extensions_1.DateTime.now().startOf('day');
    // The date of the previous value. Subtract 15 days from the current date
    // and see in which month the result falls. The date we are looking for is
    // the 15th day of this month.
    const previousDate = now.minus({ days: 15 }).set({ day: 15 }).startOf('day');
    // The date of the next value. It must fall on the next month of the previous
    // value.
    const nextDate = previousDate.plus({ months: 1 });
    // We can index `orderedMontlyMax` with `DateTime.get('month')` since it returns
    // a value between 1 and 12
    const previousValue = orderedMontlyMax[previousDate.get('month') - 1].temperature;
    const previousDistance = now.diff(previousDate, 'days').days;
    const nextValue = orderedMontlyMax[nextDate.get('month') - 1].temperature;
    const nextDistance = nextDate.diff(now, 'days').days;
    const deltaDays = previousDistance + nextDistance;
    const interpolated = previousValue * (1 - previousDistance / deltaDays) +
        nextValue * (1 - nextDistance / deltaDays);
    return satelliteTemperature.value - interpolated;
};
/**
 * Get sites entities based on the given siteIds array.
 * If an empty array was given then this function returns all sites
 * @param siteIds The siteIds to return
 * @param siteRepository The repository needed to perform the query
 * @returns A site array with all the requested sites. If no siteIds request then returns all sites available.
 */
const getSites = (siteIds, siteRepository) => {
    return siteRepository.find({
        where: siteIds.length > 0 ? { id: (0, typeorm_1.In)(siteIds) } : {},
        relations: ['historicalMonthlyMean'],
    });
};
/**
 * A function to fetch satellite temperature data and degree heating weeks from sofar,
 * calculate the sstAnomaly, dailyAlert and weeklyAlert
 * and save all above metrics to time_series table
 * @param siteIds The siteIds for which to perform the update
 * @param days How many days will this script need to backfill (1 = daily update)
 * @param repositories The needed repositories, as defined by the interface
 */
const updateSST = (siteIds, days, repositories) => __awaiter(void 0, void 0, void 0, function* () {
    const { siteRepository, timeSeriesRepository, sourceRepository } = repositories;
    logger.log('Fetching sites');
    // Fetch sites entities
    // eslint-disable-next-line fp/no-mutating-methods
    const sites = (yield getSites(siteIds, siteRepository)).sort((a, b) => Number(a.id) - Number(b.id));
    // Fetch sources
    const sources = yield Promise.all(sites.map((site) => {
        return (0, time_series_utils_1.getNOAASource)(site, sourceRepository);
    }));
    logger.log(`Back-filling ${sources.length} sites`);
    yield bluebird_1.default.map(sources, (source) => __awaiter(void 0, void 0, void 0, function* () {
        const { site } = source;
        const { polygon, nearestNOAALocation } = site;
        // Extract site coordinates
        const [NOAALongitude, NOAALatitude] = nearestNOAALocation
            ? nearestNOAALocation.coordinates
            : polygon.coordinates;
        const div = Math.floor(days / MAX_SOFAR_DATE_DIFF_DAYS);
        const mod = days % MAX_SOFAR_DATE_DIFF_DAYS;
        const intervals = [
            ...Array(div).fill(MAX_SOFAR_DATE_DIFF_DAYS),
            mod,
            // remove possible zero at the end due to mod (%) operation
        ].filter((x) => x !== 0);
        const data = yield bluebird_1.default.map(intervals, (interval, index) => __awaiter(void 0, void 0, void 0, function* () {
            const endDate = index !== 0
                ? // subtract 1 minute to be within the api date diff limit
                    luxon_extensions_1.DateTime.now()
                        .minus({ days: index * MAX_SOFAR_DATE_DIFF_DAYS, minutes: 1 })
                        .toString()
                : luxon_extensions_1.DateTime.now().minus({ minutes: 1 }).toString();
            const startDate = luxon_extensions_1.DateTime.now()
                .minus({ days: index * MAX_SOFAR_DATE_DIFF_DAYS + interval })
                .toString();
            const [SofarSSTRaw, sofarDegreeHeatingWeekRaw] = yield Promise.all([
                // Fetch satellite surface temperature data
                (0, sofar_1.sofarHindcast)(constants_1.SofarModels.NOAACoralReefWatch, constants_1.sofarVariableIDs[constants_1.SofarModels.NOAACoralReefWatch]
                    .analysedSeaSurfaceTemperature, NOAALatitude, NOAALongitude, startDate, endDate),
                // Fetch degree heating weeks data
                (0, sofar_1.sofarHindcast)(constants_1.SofarModels.NOAACoralReefWatch, constants_1.sofarVariableIDs[constants_1.SofarModels.NOAACoralReefWatch]
                    .degreeHeatingWeek, NOAALatitude, NOAALongitude, startDate, endDate),
            ]);
            // Filter out null values
            const sstFiltered = (0, sofar_1.filterSofarResponse)(SofarSSTRaw);
            const dhwFiltered = (0, sofar_1.filterSofarResponse)(sofarDegreeHeatingWeekRaw);
            const getDateNoTime = (x) => new Date(x || '').toDateString();
            const invalidDateKey = getDateNoTime(undefined);
            // Get latest dhw
            // There should be only one value for each date from sofar api
            const groupedDHWFiltered = (0, lodash_1.omit)((0, lodash_1.groupBy)(dhwFiltered, (x) => getDateNoTime(x.timestamp)), 
            // remove invalid date entries if any
            invalidDateKey);
            const latestDhw = Object.keys(groupedDHWFiltered).map((x) => (0, sofar_1.getLatestData)(groupedDHWFiltered[x]));
            // Get alert level
            const groupedSSTFiltered = (0, lodash_1.omit)((0, lodash_1.groupBy)(sstFiltered, (x) => getDateNoTime(x.timestamp)), 
            // remove invalid date entries if any
            invalidDateKey);
            const alertLevel = Object.keys(groupedSSTFiltered)
                .map((x) => {
                const latest = (0, sofar_1.getLatestData)(groupedSSTFiltered[x]);
                const dhw = latestDhw.find((y) => getDateNoTime(y === null || y === void 0 ? void 0 : y.timestamp) ===
                    getDateNoTime(latest === null || latest === void 0 ? void 0 : latest.timestamp));
                const alert = (0, bleachingAlert_1.calculateAlertLevel)(site.maxMonthlyMean, latest === null || latest === void 0 ? void 0 : latest.value, 
                // Calculate degree heating days
                dhw && dhw.value * 7);
                if (!alert)
                    return undefined;
                if (!latest)
                    return undefined;
                return {
                    value: alert,
                    timestamp: latest.timestamp,
                };
            })
                .filter((x) => x !== undefined);
            // Calculate the sstAnomaly
            const anomalyPerDateArray = Object.keys(groupedSSTFiltered).map((x) => {
                const filtered = groupedSSTFiltered[x];
                return (filtered
                    .map((sst) => ({
                    value: getSstAnomaly(site.historicalMonthlyMean, sst),
                    timestamp: sst.timestamp,
                }))
                    // Filter out null values
                    .filter((sstAnomalyValue) => {
                    return !(0, lodash_1.isNil)(sstAnomalyValue.value);
                }));
            });
            const anomaly = (0, lodash_1.flatten)(anomalyPerDateArray);
            const result = {
                sst: sstFiltered,
                dhw: dhwFiltered,
                sstAnomaly: anomaly,
                alert: alertLevel,
            };
            if (!result.sst.length) {
                console.error(`No Hindcast data available for site '${site.id}' for dates ${startDate} ${endDate}`);
            }
            return result;
        }), { concurrency: 100 });
        yield bluebird_1.default.map(data, ({ sst, dhw, alert, sstAnomaly }) => __awaiter(void 0, void 0, void 0, function* () {
            return Promise.all([
                (0, time_series_utils_1.insertSiteDataToTimeSeries)(sst, metrics_enum_1.Metric.SATELLITE_TEMPERATURE, source, timeSeriesRepository),
                (0, time_series_utils_1.insertSiteDataToTimeSeries)(dhw, metrics_enum_1.Metric.DHW, source, timeSeriesRepository),
                (0, time_series_utils_1.insertSiteDataToTimeSeries)(alert, metrics_enum_1.Metric.ALERT, source, timeSeriesRepository),
                (0, time_series_utils_1.insertSiteDataToTimeSeries)(sstAnomaly, metrics_enum_1.Metric.SST_ANOMALY, source, timeSeriesRepository),
            ]);
        }), { concurrency: 100 });
    }), 
    // Speed up if this is just a daily update
    // Concurrency should remain low, otherwise it will overwhelm the sofar api server
    { concurrency: days <= 5 ? 10 : 1 });
    logger.log('Back-filling weekly alert level');
    // We calculate weekly alert separately because it depends on values of alert levels across 7 days
    yield bluebird_1.default.map((0, lodash_1.times)(days), (i) => __awaiter(void 0, void 0, void 0, function* () {
        const endDate = i === 0
            ? luxon_extensions_1.DateTime.now().toString()
            : luxon_extensions_1.DateTime.now().minus({ days: i }).endOf('day').toString();
        logger.log(`Back-filling weekly alert for ${endDate}`);
        // Calculate max alert by fetching the max alert in the last 7 days
        // As timestamp it is selected the latest available timestamp
        const maxAlert = yield repositories.timeSeriesRepository
            .createQueryBuilder('time_series')
            .select('MAX(value)', 'value')
            .addSelect('source_id', 'source')
            .addSelect('MAX(timestamp)', 'timestamp')
            .where('timestamp <= :endDate::timestamp', { endDate })
            .andWhere("timestamp >= :endDate::timestamp - INTERVAL '7 days'", {
            endDate,
        })
            .andWhere('metric = :alertMetric', { alertMetric: metrics_enum_1.Metric.ALERT })
            .andWhere('source_id IN (:...sourceIds)', {
            sourceIds: sources.map((source) => source.id),
        })
            .groupBy('source_id')
            .getRawMany();
        yield repositories.timeSeriesRepository
            .createQueryBuilder('time_series')
            .insert()
            .values(maxAlert.map((data) => (Object.assign(Object.assign({}, data), { metric: metrics_enum_1.Metric.WEEKLY_ALERT }))))
            .onConflict('ON CONSTRAINT "no_duplicate_data" DO NOTHING')
            .execute();
    }), 
    // Concurrency is set to 1 to avoid read and writing the table time_series at the same time
    { concurrency: 1 });
    // Update materialized view
    yield (0, time_series_utils_1.refreshMaterializedView)(repositories.siteRepository);
});
exports.updateSST = updateSST;
