"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STORM_GLASS_BASE_URL = exports.sofarVariableIDs = exports.SofarModels = exports.SOFAR_LATEST_DATA_URL = exports.SOFAR_SENSOR_DATA_URL = exports.SOFAR_WAVE_DATA_URL = exports.SOFAR_MARINE_URL = exports.isTestEnv = exports.envName = void 0;
// dotenv is a dev dependency, so conditionally import it (don't need it in Prod).
try {
    // eslint-disable-next-line import/no-extraneous-dependencies, global-require
    require('dotenv').config();
}
catch (_a) {
    // Pass
}
exports.envName = process.env.NODE_ENV || 'development';
exports.isTestEnv = exports.envName === 'test';
// Environment variables (especially those used by cloud-functions)
// should NOT be exported from here (eg. "export const { SOFAR_API_TOKEN } = process.env"),
// since it will interfere with the way they are set in cloud-functions,
// causing them to be undefined.
// Sofar API urls
exports.SOFAR_MARINE_URL = 'https://api.sofarocean.com/marine-weather/v1/models/';
exports.SOFAR_WAVE_DATA_URL = 'https://api.sofarocean.com/api/wave-data';
exports.SOFAR_SENSOR_DATA_URL = 'https://api.sofarocean.com/api/sensor-data';
exports.SOFAR_LATEST_DATA_URL = 'https://api.sofarocean.com/api/latest-data';
var SofarModels;
(function (SofarModels) {
    SofarModels["NOAACoralReefWatch"] = "NOAACoralReefWatch";
    SofarModels["Wave"] = "Wave";
    SofarModels["Atmosphere"] = "Atmosphere";
})(SofarModels = exports.SofarModels || (exports.SofarModels = {}));
// Sofar variables
exports.sofarVariableIDs = {
    [SofarModels.Wave]: {
        significantWaveHeight: 'significantWaveHeight',
        meanDirection: 'meanDirection',
        meanDirectionalSpread: 'meanDirectionalSpread',
        meanPeriod: 'meanPeriod',
        peakFrequency: 'peakFrequency',
        peakDirection: 'peakDirection',
        significantWaveHeightWindWaves: 'significantWaveHeightWindWaves',
        meanDirectionWindWaves: 'meanDirectionWindWaves',
        meanDirectionalSpreadWindWaves: 'meanDirectionalSpreadWindWaves',
        peakPeriodWindWaves: 'peakPeriodWindWaves',
        significantWaveHeightFirstSwell: 'significantWaveHeightFirstSwell',
        meanDirectionFirstSwell: 'meanDirectionFirstSwell',
        meanDirectionalSpreadFirstSwell: 'meanDirectionalSpreadFirstSwell',
        peakPeriodFirstSwell: 'peakPeriodFirstSwell',
        significantWaveHeightSecondSwell: 'significantWaveHeightSecondSwell',
        meanDirectionSecondSwell: 'meanDirectionSecondSwell',
        meanDirectionalSpreadSecondSwell: 'meanDirectionalSpreadSecondSwell',
        peakPeriodSecondSwell: 'peakPeriodSecondSwell',
    },
    [SofarModels.NOAACoralReefWatch]: {
        degreeHeatingWeek: 'degreeHeatingWeek',
        analysedSeaSurfaceTemperature: 'analysedSeaSurfaceTemperature',
    },
    [SofarModels.Atmosphere]: {
        windVelocity10MeterEastward: 'windVelocity10MeterEastward',
        windVelocity10MeterNorthward: 'windVelocity10MeterNorthward',
    },
};
exports.STORM_GLASS_BASE_URL = 'https://api.stormglass.io/v2';
