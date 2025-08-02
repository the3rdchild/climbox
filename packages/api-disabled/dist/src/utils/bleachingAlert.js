"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAlertLevel = void 0;
const lodash_1 = require("lodash");
/**
 * Calculating bleaching alert level based on NOAA defintions:
 * available at https://coralreefwatch.noaa.gov/subscriptions/vs.php
 * @param maxMonthlyMean
 * @param satelliteTemperature
 * @param degreeHeatingDays
 */
const calculateAlertLevel = (maxMonthlyMean, satelliteTemperature, degreeHeatingDays) => {
    const hotSpot = satelliteTemperature &&
        maxMonthlyMean &&
        satelliteTemperature - maxMonthlyMean;
    switch (true) {
        case (0, lodash_1.isNil)(hotSpot):
            return undefined;
        case (0, lodash_1.isNumber)(hotSpot) && hotSpot <= 0:
            return 0;
        case (0, lodash_1.isNumber)(hotSpot) && hotSpot < 1:
            return 1;
        // Hotspot >=1 or nil past this point, start dhw checks.
        case (0, lodash_1.isNil)(degreeHeatingDays):
            return 0;
        case (0, lodash_1.inRange)(degreeHeatingDays, 0, 4 * 7):
            return 2;
        case (0, lodash_1.inRange)(degreeHeatingDays, 4 * 7, 8 * 7):
            return 3;
        case degreeHeatingDays >= 8 * 7:
            return 4;
        default:
            return undefined;
    }
};
exports.calculateAlertLevel = calculateAlertLevel;
