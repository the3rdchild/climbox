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
exports.addWindWaveData = exports.getForecastData = void 0;
const common_1 = require("@nestjs/common");
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const luxon_extensions_1 = require("../luxon-extensions");
const source_type_enum_1 = require("../sites/schemas/source-type.enum");
const wind_wave_data_types_1 = require("../wind-wave-data/wind-wave-data.types");
const constants_1 = require("./constants");
const math_1 = require("./math");
const sofar_1 = require("./sofar");
const sofar_availability_1 = require("./sofar-availability");
const logger = new common_1.Logger('hindcastWindWaveData');
const dataLabels = [
    [
        'significantWaveHeight',
        wind_wave_data_types_1.WindWaveMetric.SIGNIFICANT_WAVE_HEIGHT,
        source_type_enum_1.SourceType.SOFAR_MODEL,
    ],
    [
        'waveMeanDirection',
        wind_wave_data_types_1.WindWaveMetric.WAVE_MEAN_DIRECTION,
        source_type_enum_1.SourceType.SOFAR_MODEL,
    ],
    ['waveMeanPeriod', wind_wave_data_types_1.WindWaveMetric.WAVE_MEAN_PERIOD, source_type_enum_1.SourceType.SOFAR_MODEL],
    ['windDirection', wind_wave_data_types_1.WindWaveMetric.WIND_DIRECTION, source_type_enum_1.SourceType.GFS],
    ['windSpeed', wind_wave_data_types_1.WindWaveMetric.WIND_SPEED, source_type_enum_1.SourceType.GFS],
];
const getTodayYesterdayDates = () => {
    const date = new Date();
    const yesterdayDate = new Date(date);
    yesterdayDate.setDate(date.getDate() - 1);
    const today = date.toISOString();
    const yesterday = yesterdayDate.toISOString();
    return { today, yesterday };
};
const getForecastData = (latitude, longitude) => __awaiter(void 0, void 0, void 0, function* () {
    const { today, yesterday } = getTodayYesterdayDates();
    const hindcastOptions = [
        [
            constants_1.SofarModels.Wave,
            constants_1.sofarVariableIDs[constants_1.SofarModels.Wave].significantWaveHeight,
        ],
        [constants_1.SofarModels.Wave, constants_1.sofarVariableIDs[constants_1.SofarModels.Wave].meanDirection],
        [constants_1.SofarModels.Wave, constants_1.sofarVariableIDs[constants_1.SofarModels.Wave].meanPeriod],
        [
            constants_1.SofarModels.Atmosphere,
            constants_1.sofarVariableIDs[constants_1.SofarModels.Atmosphere].windVelocity10MeterEastward,
        ],
        [
            constants_1.SofarModels.Atmosphere,
            constants_1.sofarVariableIDs[constants_1.SofarModels.Atmosphere].windVelocity10MeterNorthward,
        ],
    ];
    const response = yield Promise.all(hindcastOptions.map(([sofarModel, sofarVariableId]) => {
        return (0, sofar_1.sofarHindcast)(sofarModel, sofarVariableId, latitude, longitude, yesterday, today);
    }));
    const [significantWaveHeight, waveMeanDirection, waveMeanPeriod, windVelocity10MeterEastward, windVelocity10MeterNorthward,] = response.map((x) => {
        if (!x || x.values.length < 1)
            return undefined;
        return x.values[x.values.length - 1]; // latest available forecast in the past
    });
    // Calculate wind speed and direction from velocity
    const windNorthwardVelocity = windVelocity10MeterNorthward === null || windVelocity10MeterNorthward === void 0 ? void 0 : windVelocity10MeterNorthward.value;
    const windEastwardVelocity = windVelocity10MeterEastward === null || windVelocity10MeterEastward === void 0 ? void 0 : windVelocity10MeterEastward.value;
    const sameTimestamps = (windVelocity10MeterEastward === null || windVelocity10MeterEastward === void 0 ? void 0 : windVelocity10MeterEastward.timestamp) ===
        (windVelocity10MeterNorthward === null || windVelocity10MeterNorthward === void 0 ? void 0 : windVelocity10MeterNorthward.timestamp);
    const windSpeed = windNorthwardVelocity && windEastwardVelocity && sameTimestamps
        ? {
            timestamp: windVelocity10MeterNorthward === null || windVelocity10MeterNorthward === void 0 ? void 0 : windVelocity10MeterNorthward.timestamp,
            value: (0, math_1.getWindSpeed)(windEastwardVelocity, windNorthwardVelocity),
        }
        : undefined;
    const windDirection = windNorthwardVelocity && windEastwardVelocity && sameTimestamps
        ? {
            timestamp: windVelocity10MeterNorthward === null || windVelocity10MeterNorthward === void 0 ? void 0 : windVelocity10MeterNorthward.timestamp,
            value: (0, math_1.getWindDirection)(windEastwardVelocity, windNorthwardVelocity),
        }
        : undefined;
    return {
        significantWaveHeight,
        waveMeanDirection,
        waveMeanPeriod,
        windSpeed,
        windDirection,
    };
});
exports.getForecastData = getForecastData;
/**
 * Fetch spotter and wave data from sofar and save them on time_series table
 * @param siteIds The siteIds for which to perform the update
 * @param connection An active typeorm connection object
 * @param repositories The needed repositories, as defined by the interface
 */
const addWindWaveData = (siteIds, repositories) => __awaiter(void 0, void 0, void 0, function* () {
    logger.log('Fetching sites');
    // Fetch all sites
    const sites = yield repositories.siteRepository.find({
        where: Object.assign({}, (siteIds.length > 0 ? { id: (0, typeorm_1.In)(siteIds) } : {})),
    });
    const { today } = getTodayYesterdayDates();
    logger.log('Saving wind & wave forecast data');
    yield bluebird_1.default.map(sites, (site) => __awaiter(void 0, void 0, void 0, function* () {
        const { polygon } = site;
        const [longitude, latitude] = (0, sofar_availability_1.getSofarNearestAvailablePoint)(polygon);
        logger.log(`Saving wind & wave forecast data for ${site.id} at ${latitude} - ${longitude}`);
        const forecastData = yield (0, exports.getForecastData)(latitude, longitude);
        // Save wind wave data to forecast_data
        yield Promise.all(
        // eslint-disable-next-line array-callback-return, consistent-return
        dataLabels.map(([dataLabel, metric, source]) => {
            const sofarValue = forecastData[dataLabel];
            if (!(0, lodash_1.isNil)(sofarValue === null || sofarValue === void 0 ? void 0 : sofarValue.value) && !Number.isNaN(sofarValue === null || sofarValue === void 0 ? void 0 : sofarValue.value)) {
                return repositories.hindcastRepository
                    .createQueryBuilder('forecast_data')
                    .insert()
                    .values([
                    {
                        site,
                        timestamp: luxon_extensions_1.DateTime.fromISO(sofarValue.timestamp)
                            .startOf('minute')
                            .toJSDate(),
                        metric,
                        source,
                        value: sofarValue.value,
                        updatedAt: today,
                    },
                ])
                    .onConflict(`ON CONSTRAINT "one_row_per_site_per_metric_per_source" DO UPDATE SET "timestamp" = excluded."timestamp", "updated_at" = excluded."updated_at", "value" = excluded."value"`)
                    .execute();
            }
        }));
    }), { concurrency: 10 });
    logger.log('Completed updating hindcast data');
});
exports.addWindWaveData = addWindWaveData;
