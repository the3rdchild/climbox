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
exports.getBarometricDiff = exports.getValueClosestToDate = exports.getSpotterData = exports.getSofarHindcastData = exports.sofarLatest = exports.sofarWaveData = exports.sofarSensor = exports.sofarHindcast = exports.filterSofarResponse = exports.getLatestData = void 0;
/* eslint-disable no-console */
/** Utility function to access the Sofar API and retrieve relevant data. */
const lodash_1 = require("lodash");
const luxon_extensions_1 = require("../luxon-extensions");
const retry_axios_1 = __importDefault(require("./retry-axios"));
const dates_1 = require("./dates");
const constants_1 = require("./constants");
const sofar_types_1 = require("./sofar.types");
const slack_utils_1 = require("./slack.utils");
const getLatestData = (sofarValues) => {
    if (!sofarValues) {
        return undefined;
    }
    return sofarValues.reduce((max, entry) => new Date(entry.timestamp) > new Date(max.timestamp) ? entry : max, sofarValues[0]);
};
exports.getLatestData = getLatestData;
const filterSofarResponse = (responseData) => {
    return (responseData
        ? responseData.values.filter((data) => !(0, lodash_1.isNil)(data === null || data === void 0 ? void 0 : data.value) && data.value !== 9999)
        : []);
};
exports.filterSofarResponse = filterSofarResponse;
function sofarErrorHandler({ error, sensorId, sendToSlack = false, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (error.response) {
            const spotterMessagePart = sensorId ? `for spotter ${sensorId}.` : '.';
            const message = `Sofar API responded with a ${error.response.status} status ${spotterMessagePart} ${error.response.data.message}`;
            console.error(message);
            if (!sendToSlack) {
                return;
            }
            if ([401, 403].includes(error.response.status)) {
                const messageTemplate = {
                    channel: process.env.SLACK_BOT_CHANNEL,
                    text: message,
                    mrkdwn: true,
                };
                yield (0, slack_utils_1.sendSlackMessage)(messageTemplate, process.env.SLACK_BOT_TOKEN);
            }
        }
        else {
            console.error(`An error occurred accessing the Sofar API - ${error}`);
        }
    });
}
function sofarHindcast(modelId, variableID, latitude, longitude, start, end) {
    return __awaiter(this, void 0, void 0, function* () {
        return retry_axios_1.default
            .get(`${constants_1.SOFAR_MARINE_URL}${modelId}/hindcast/point`, {
            params: {
                variableIDs: [variableID],
                latitude,
                longitude,
                start,
                end,
                token: process.env.SOFAR_API_TOKEN,
            },
        })
            .then((response) => {
            // The api return an array of requested variables, but since we request one, ours it's always first
            if (!response.data.hindcastVariables[0]) {
                console.error(`No Hindcast variable '${variableID}' available for ${latitude}, ${longitude}`);
                return undefined;
            }
            return response.data.hindcastVariables[0];
        })
            .catch((error) => sofarErrorHandler({ error }));
    });
}
exports.sofarHindcast = sofarHindcast;
function sofarSensor(sensorId, token, start, end) {
    return retry_axios_1.default
        .get(constants_1.SOFAR_SENSOR_DATA_URL, {
        params: {
            spotterId: sensorId,
            startDate: start,
            endDate: end,
            token,
        },
    })
        .then((response) => response.data)
        .catch((error) => sofarErrorHandler({ error, sensorId, sendToSlack: true }));
}
exports.sofarSensor = sofarSensor;
function sofarWaveData(sensorId, token, start, end) {
    return retry_axios_1.default
        .get(constants_1.SOFAR_WAVE_DATA_URL, {
        params: {
            spotterId: sensorId,
            startDate: start,
            endDate: end,
            limit: start && end ? 500 : 100,
            token,
            includeSurfaceTempData: true,
            includeWindData: true,
            includeBarometerData: true,
        },
    })
        .then((response) => response.data)
        .catch((error) => sofarErrorHandler({ error, sensorId }));
}
exports.sofarWaveData = sofarWaveData;
function sofarLatest({ sensorId, token, }) {
    return __awaiter(this, void 0, void 0, function* () {
        return retry_axios_1.default
            .get(constants_1.SOFAR_LATEST_DATA_URL, {
            params: {
                spotterId: sensorId,
                token,
            },
        })
            .then((response) => response.data.data)
            .catch((error) => sofarErrorHandler({ error, sensorId, sendToSlack: true }));
    });
}
exports.sofarLatest = sofarLatest;
function getSofarHindcastData(modelId, variableID, latitude, longitude, endDate, hours) {
    return __awaiter(this, void 0, void 0, function* () {
        const [start, end] = (0, dates_1.getStartEndDate)(endDate, hours);
        // Get data for model and return values
        // console.time(`getSofarHindcast ${modelId}-${variableID} for lat ${latitude}`);
        const hindcastVariables = yield sofarHindcast(modelId, variableID, latitude, longitude, start, end);
        // console.timeEnd(
        //   `getSofarHindcast ${modelId}-${variableID} for lat ${latitude}`,
        // );
        // Filter out unknown values
        return (0, exports.filterSofarResponse)(hindcastVariables);
    });
}
exports.getSofarHindcastData = getSofarHindcastData;
function getSpotterData(sensorId, sofarToken, endDate, startDate) {
    return __awaiter(this, void 0, void 0, function* () {
        console.time(`getSpotterData for sensor ${sensorId}`);
        const [start, end] = endDate && !startDate
            ? (0, dates_1.getStartEndDate)(endDate)
            : [
                startDate && luxon_extensions_1.DateTime.fromJSDate(startDate).toString(),
                endDate && luxon_extensions_1.DateTime.fromJSDate(endDate).toString(),
            ];
        const { data: { waves = [], wind = [], barometerData = [], surfaceTemp = [] }, } = (yield sofarWaveData(sensorId, sofarToken, start, end)) || {
            data: sofar_types_1.EMPTY_SOFAR_WAVE_RESPONSE,
        };
        const { data: smartMooringData } = (yield sofarSensor(sensorId, sofarToken, start, end)) || { data: [] };
        const sofarSpotterSurfaceTemp = surfaceTemp.map((x) => ({
            timestamp: x.timestamp,
            value: x.degrees,
        }));
        const [sofarSignificantWaveHeight, sofarMeanPeriod, sofarMeanDirection, spotterLatitude, spotterLongitude,] = waves.reduce(([significantWaveHeights, meanPeriods, meanDirections, latitude, longitude,], data) => {
            return [
                significantWaveHeights.concat({
                    timestamp: data.timestamp,
                    value: data.significantWaveHeight,
                }),
                meanPeriods.concat({
                    timestamp: data.timestamp,
                    value: data.meanPeriod,
                }),
                meanDirections.concat({
                    timestamp: data.timestamp,
                    value: data.meanDirection,
                }),
                latitude.concat({
                    timestamp: data.timestamp,
                    value: data.latitude,
                }),
                longitude.concat({
                    timestamp: data.timestamp,
                    value: data.longitude,
                }),
            ];
        }, [[], [], [], [], []]);
        const [sofarWindSpeed, sofarWindDirection] = wind.reduce(([speed, direction], data) => {
            return [
                speed.concat({
                    timestamp: data.timestamp,
                    value: data.speed,
                }),
                direction.concat({
                    timestamp: data.timestamp,
                    value: data.direction,
                }),
            ];
        }, [[], []]);
        const spotterBarometerTop = barometerData.map((data) => ({
            timestamp: data.timestamp,
            value: data.value,
        }));
        const spotterBarometricTopDiff = getBarometricDiff(spotterBarometerTop);
        // Sofar increments sensors by distance to the spotter.
        // Sensor 1 -> top and Sensor 2 -> bottom
        const [sofarTopTemperature, sofarBottomTemperature, sofarBottomPressure] = smartMooringData.reduce(([topTemp, bottomTemp, bottomPressure], data) => {
            const { sensorPosition, unit_type: unitType } = data;
            if (sensorPosition === 1 && unitType === 'temperature') {
                return [
                    topTemp.concat({
                        timestamp: data.timestamp,
                        value: data.value,
                    }),
                    bottomTemp,
                    bottomPressure,
                ];
            }
            if (sensorPosition === 2 && unitType === 'temperature') {
                return [
                    topTemp,
                    bottomTemp.concat({
                        timestamp: data.timestamp,
                        value: data.value,
                    }),
                    bottomPressure,
                ];
            }
            if (sensorPosition === 2 && unitType === 'pressure') {
                return [
                    topTemp,
                    bottomTemp,
                    bottomPressure.concat({
                        timestamp: data.timestamp,
                        // convert micro bar to hPa
                        value: data.value / 1000,
                    }),
                ];
            }
            return [topTemp, bottomTemp, bottomPressure];
        }, [[], [], []]);
        console.timeEnd(`getSpotterData for sensor ${sensorId}`);
        return {
            topTemperature: sofarTopTemperature.filter((data) => !(0, lodash_1.isNil)(data.value)),
            bottomTemperature: sofarBottomTemperature.filter((data) => !(0, lodash_1.isNil)(data.value)),
            significantWaveHeight: sofarSignificantWaveHeight,
            waveMeanPeriod: sofarMeanPeriod,
            waveMeanDirection: sofarMeanDirection,
            windSpeed: sofarWindSpeed,
            windDirection: sofarWindDirection,
            barometerTop: spotterBarometerTop,
            barometerBottom: sofarBottomPressure.filter((data) => !(0, lodash_1.isNil)(data.value)),
            barometricTopDiff: spotterBarometricTopDiff
                ? [spotterBarometricTopDiff]
                : [],
            surfaceTemperature: sofarSpotterSurfaceTemp,
            latitude: spotterLatitude,
            longitude: spotterLongitude,
        };
    });
}
exports.getSpotterData = getSpotterData;
/** Utility function to get the closest available data given a date in UTC. */
function getValueClosestToDate(sofarValues, utcDate) {
    const timeDiff = (timestamp) => Math.abs(new Date(timestamp).getTime() - utcDate.getTime());
    return sofarValues.reduce((prevClosest, nextPoint) => timeDiff(prevClosest.timestamp) > timeDiff(nextPoint.timestamp)
        ? nextPoint
        : prevClosest).value;
}
exports.getValueClosestToDate = getValueClosestToDate;
function getBarometricDiff(spotterBarometer) {
    const lastTowPressures = spotterBarometer === null || spotterBarometer === void 0 ? void 0 : spotterBarometer.slice(-2);
    const valueDiff = (lastTowPressures === null || lastTowPressures === void 0 ? void 0 : lastTowPressures.length) === 2
        ? lastTowPressures[1].value - lastTowPressures[0].value
        : undefined;
    const spotterBarometricDiff = valueDiff
        ? {
            value: valueDiff,
            timestamp: lastTowPressures[1].timestamp,
        }
        : null;
    return spotterBarometricDiff;
}
exports.getBarometricDiff = getBarometricDiff;
