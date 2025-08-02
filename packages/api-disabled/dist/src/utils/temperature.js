"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDegreeHeatingDays = exports.getHistoricalMonthlyMeans = exports.getMMM = void 0;
const GeoTIFF = __importStar(require("geotiff"));
const coordinates_1 = require("./coordinates");
const HistoricalMonthlyMeanRoot = 'https://storage.googleapis.com/reef_climatology/';
const tiffCache = new Map();
function getTiffFromCache(url) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tiffCache.has(url)) {
            tiffCache.set(url, GeoTIFF.fromUrl(url, { forceXHR: true }));
        }
        return tiffCache.get(url);
    });
}
function getValueFromTiff(tiff, long, lat) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield tiff.getImage();
        const gdalNoData = image.getGDALNoData();
        const boundingBox = image.getBoundingBox();
        const width = image.getWidth();
        const height = image.getHeight();
        const { pixelX, pixelY } = (0, coordinates_1.pointToPixel)(long, lat, boundingBox, width, height);
        const data = yield image.readRasters({
            window: [pixelX, pixelY, pixelX + 10, pixelY + 10],
        });
        const filteredData = data.map((row) => row.filter((value) => value !== gdalNoData));
        return filteredData[0][0] ? filteredData[0][0] / 100 : undefined;
    });
}
/**
 * Corals start to become stressed when the SST is 1°C warmer than the maxiumum monthly mean temperature (MMM).
 * The MMM is the highest temperature out of the monthly mean temperatures over the year (warmest summer month)
 * 1°C above the MMM is called the "bleaching threshhold"
 * When the SST is warmer than the bleaching threshold temperature, the corals will experience heat stress. This heat stress is the main cause of mass coral bleaching.
 * The HotSpot highlights the areas where the SST is above the MMM.
 * The DHW shows how much heat stress has accumulated in an area over the past 12 weeks (3 months). The units for DHW are "degree C-weeks"
 * The DHW adds up the Coral Bleaching HotSpot values whenever the temperature exceeds the bleaching threshold.
 * Bleaching Alerts:
 *      No Stress (no heat stress or bleaching is present): HotSpot of less than or equal to 0.
 *      Bleaching Watch (low-level heat stress is present): HotSpot greater than 0 but less than 1; SST below bleaching threshhold.
 *      Bleaching Warning (heat stress is accumulating, possible coral bleaching): HotSpot of 1 or greater; SST above bleaching threshold; DHW greater than 0 but less than 4.
 *      Bleaching Alert Level 1 (significant bleaching likely): HotSpot of 1 or greater; SST above bleaching threshold; DHW greater than or equal to 4 but less than 8.
 *      Bleaching Alert Level 2 (severe bleaching and significant mortality likely): HotSpot of 1 or greater; SST above bleaching threshold; DHW greater than or equal to 8.
 *
 * DHW = (1/7)*sum[1->84](HS(i) if HS(i) >= 1C)
 * */
function getMMM(long, lat) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${HistoricalMonthlyMeanRoot}sst_clim_mmm.tiff`;
        const tiff = yield getTiffFromCache(url);
        return getValueFromTiff(tiff, long, lat);
    });
}
exports.getMMM = getMMM;
function getHistoricalMonthlyMeans(long, lat) {
    return __awaiter(this, void 0, void 0, function* () {
        const HistoricalMonthlyMeanMapping = [
            'january',
            'february',
            'march',
            'april',
            'may',
            'june',
            'july',
            'august',
            'september',
            'october',
            'november',
            'december',
        ];
        return Promise.all(HistoricalMonthlyMeanMapping.map((month, index) => __awaiter(this, void 0, void 0, function* () {
            const url = `${HistoricalMonthlyMeanRoot}sst_clim_${month}.tiff`;
            const tiff = yield getTiffFromCache(url);
            return {
                month: index + 1,
                temperature: yield getValueFromTiff(tiff, long, lat),
            };
        })));
    });
}
exports.getHistoricalMonthlyMeans = getHistoricalMonthlyMeans;
/**
 * Calculates the Degree Heating Days of a site location using 12 weeks of data.
 *
 * HS = SST(daily) - MMM if SST(daily) > MMM
 * HS = 0                if SST(daily) <= MMM
 * HS > 1C               bleaching threshold
 *
 * @param {float[]}    seaSurfaceTemperatures        list of seaSurfaceTemperatures
 * @param {float}      maximumMonthlyMean            maximumMonthlyMean for this location
 *
 * @return {float}     degreeHeatingDays             Degree Heating Days
 */
function calculateDegreeHeatingDays(seaSurfaceTemperatures, maximumMonthlyMean) {
    if (seaSurfaceTemperatures.length !== 84) {
        throw new Error('Calculating Degree Heating Days requires exactly 84 days of data.');
    }
    if (!maximumMonthlyMean) {
        throw new Error('Max monthly mean is undefined');
    }
    return seaSurfaceTemperatures.reduce((sum, value) => {
        // Calculate deviation.
        const degreeDeviation = value - maximumMonthlyMean;
        // Add degree deviation for days above bleaching threshold (MMM + 1 degree).
        return sum + (degreeDeviation >= 1 ? value - maximumMonthlyMean : 0);
    }, 0);
}
exports.calculateDegreeHeatingDays = calculateDegreeHeatingDays;
