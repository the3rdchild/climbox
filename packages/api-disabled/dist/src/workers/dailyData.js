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
exports.runDailyUpdate = exports.getSitesDailyData = exports.getSitesIdsWithoutDataForDate = exports.getMaxAlert = exports.getWeeklyAlertLevel = exports.getDailyData = exports.getDegreeHeatingDays = void 0;
/** Worker to process daily data for all sites. */
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const bluebird_1 = __importDefault(require("bluebird"));
const luxon_1 = require("luxon");
const common_1 = require("@nestjs/common");
const sites_entity_1 = require("../sites/sites.entity");
const daily_data_entity_1 = require("../sites/daily-data.entity");
const math_1 = require("../utils/math");
const sofar_1 = require("../utils/sofar");
const temperature_1 = require("../utils/temperature");
const constants_1 = require("../utils/constants");
const bleachingAlert_1 = require("../utils/bleachingAlert");
const site_utils_1 = require("../utils/site.utils");
function getDegreeHeatingDays(latitude, longitude, endOfDate, maxMonthlyMean) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // TODO - Get data for the past 84 days.
            const seaSurfaceTemperatures = [];
            return {
                value: (0, temperature_1.calculateDegreeHeatingDays)(seaSurfaceTemperatures, maxMonthlyMean),
                timestamp: endOfDate.toISOString(),
            };
        }
        catch (_a) {
            const degreeHeatingWeek = yield (0, sofar_1.getSofarHindcastData)(constants_1.SofarModels.NOAACoralReefWatch, constants_1.sofarVariableIDs[constants_1.SofarModels.NOAACoralReefWatch].degreeHeatingWeek, latitude, longitude, endOfDate, 96);
            // Check if there are any data returned
            // Grab the last one and convert it to degreeHeatingDays
            const latestDegreeHeatingWeek = (0, sofar_1.getLatestData)(degreeHeatingWeek);
            return (latestDegreeHeatingWeek && {
                value: latestDegreeHeatingWeek.value * 7,
                timestamp: latestDegreeHeatingWeek.timestamp,
            });
        }
    });
}
exports.getDegreeHeatingDays = getDegreeHeatingDays;
function getDailyData(site, endOfDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const { polygon, maxMonthlyMean, nearestNOAALocation } = site;
        const [NOAALongitude, NOAALatitude] = nearestNOAALocation
            ? nearestNOAALocation.coordinates
            : polygon.coordinates;
        const [degreeHeatingDays, satelliteTemperatureData] = yield Promise.all([
            // Calculate Degree Heating Days
            // Calculating Degree Heating Days requires exactly 84 days of data.
            getDegreeHeatingDays(NOAALatitude, NOAALongitude, endOfDate, maxMonthlyMean),
            (0, sofar_1.getSofarHindcastData)(constants_1.SofarModels.NOAACoralReefWatch, constants_1.sofarVariableIDs[constants_1.SofarModels.NOAACoralReefWatch]
                .analysedSeaSurfaceTemperature, NOAALatitude, NOAALongitude, endOfDate, 96),
        ]);
        // Get satelliteTemperature
        const latestSatelliteTemperature = satelliteTemperatureData && (0, sofar_1.getLatestData)(satelliteTemperatureData);
        const satelliteTemperature = latestSatelliteTemperature && latestSatelliteTemperature.value;
        const dailyAlertLevel = (0, bleachingAlert_1.calculateAlertLevel)(maxMonthlyMean, satelliteTemperature, degreeHeatingDays === null || degreeHeatingDays === void 0 ? void 0 : degreeHeatingDays.value);
        return {
            site: { id: site.id },
            date: endOfDate,
            dailyAlertLevel,
            satelliteTemperature,
            degreeHeatingDays: degreeHeatingDays === null || degreeHeatingDays === void 0 ? void 0 : degreeHeatingDays.value,
        };
    });
}
exports.getDailyData = getDailyData;
function hasNoData(data) {
    return Object.values((0, lodash_1.omit)(data, 'site', 'date')).every(lodash_1.isUndefined);
}
function getWeeklyAlertLevel(dailyDataRepository, date, site) {
    return __awaiter(this, void 0, void 0, function* () {
        const pastWeek = new Date(date);
        pastWeek.setDate(pastWeek.getDate() - 6);
        const query = yield dailyDataRepository
            .createQueryBuilder('dailyData')
            .select('MAX(dailyData.dailyAlertLevel)', 'weeklyAlertLevel')
            .andWhere('dailyData.date >= :pastWeek', { pastWeek })
            .andWhere('dailyData.date <= :date', { date })
            .andWhere('dailyData.site = :site', { site: site.id })
            .getRawOne();
        return (0, lodash_1.isNumber)(query.weeklyAlertLevel) ? query.weeklyAlertLevel : undefined;
    });
}
exports.getWeeklyAlertLevel = getWeeklyAlertLevel;
function getMaxAlert(dailyAlertLevel, weeklyAlertLevel) {
    return (0, math_1.getMax)([weeklyAlertLevel, dailyAlertLevel].filter(lodash_1.isNumber));
}
exports.getMaxAlert = getMaxAlert;
function getSitesIdsWithoutDataForDate(dataSource, date, siteIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = dataSource
            .getRepository(sites_entity_1.Site)
            .createQueryBuilder('s')
            .select('s.id', 'id')
            .where(`NOT EXISTS (
        SELECT 1
        FROM daily_data dd
        WHERE dd.site_id = s.id
        AND dd.date = :date
      )`, { date });
        if (siteIds === null || siteIds === void 0 ? void 0 : siteIds.length) {
            query.andWhere('s.id IN (:...siteIds)', { siteIds });
        }
        return (yield query.getRawMany()).map((site) => site.id);
    });
}
exports.getSitesIdsWithoutDataForDate = getSitesIdsWithoutDataForDate;
/* eslint-disable no-console */
function getSitesDailyData(dataSource, endOfDate, siteIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const siteRepository = dataSource.getRepository(sites_entity_1.Site);
        const dailyDataRepository = dataSource.getRepository(daily_data_entity_1.DailyData);
        const allSites = yield siteRepository.find(Object.assign(Object.assign({}, (siteIds && siteIds.length > 0
            ? {
                where: {
                    id: (0, typeorm_1.In)(siteIds),
                },
            }
            : {})), { select: (0, site_utils_1.getAllColumns)(siteRepository) }));
        const start = new Date();
        common_1.Logger.log(`Updating ${allSites.length} sites for ${endOfDate.toDateString()}.`);
        yield bluebird_1.default.map(allSites, (site) => __awaiter(this, void 0, void 0, function* () {
            const dailyDataInput = yield getDailyData(site, endOfDate);
            // If no data returned from the update function, skip
            if (hasNoData(dailyDataInput)) {
                common_1.Logger.log(`No data has been fetched. Skipping ${site.id}...`);
                return;
            }
            // Calculate weekly alert level
            const weeklyAlertLevel = yield getWeeklyAlertLevel(dailyDataRepository, endOfDate, site);
            const entity = dailyDataRepository.create(Object.assign(Object.assign({}, dailyDataInput), { weeklyAlertLevel: getMaxAlert(dailyDataInput.dailyAlertLevel, weeklyAlertLevel) }));
            try {
                // Try to save daily data entity
                yield dailyDataRepository.save(entity);
            }
            catch (err) {
                // Update instead of insert
                if ((0, lodash_1.get)(err, 'constraint') === 'no_duplicated_date') {
                    const filteredData = (0, lodash_1.omitBy)(entity, lodash_1.isNil);
                    yield dailyDataRepository
                        .createQueryBuilder('dailyData')
                        .update()
                        .where('site_id = :site_id', { site_id: site.id })
                        .andWhere('Date(date) = Date(:date)', { date: entity.date })
                        .set(filteredData)
                        .execute();
                }
                else {
                    console.error(`Error updating data for Site ${site.id} & ${endOfDate.toDateString()}: ${err}.`);
                }
            }
        }), { concurrency: 8 });
        common_1.Logger.log(`Updated ${allSites.length} sites in ${(new Date().valueOf() - start.valueOf()) / 1000} seconds`);
    });
}
exports.getSitesDailyData = getSitesDailyData;
function runDailyUpdate(dataSource) {
    return __awaiter(this, void 0, void 0, function* () {
        const today = luxon_1.DateTime.utc().endOf('day');
        const yesterday = today.set({ day: today.day - 1 });
        console.log(`Daily Update for data ending on ${yesterday.day}`);
        try {
            yield getSitesDailyData(dataSource, yesterday.toJSDate());
            console.log('Completed daily update.');
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.runDailyUpdate = runDailyUpdate;
