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
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const sofar_1 = require("./sofar");
test('It processes Sofar API for daily data.', () => __awaiter(void 0, void 0, void 0, function* () {
    jest.setTimeout(30000);
    const values = yield (0, sofar_1.getSofarHindcastData)('NOAACoralReefWatch', 'analysedSeaSurfaceTemperature', -3.5976336810301888, -178.0000002552476, new Date('2024-08-31'));
    expect(values).toEqual([
        { timestamp: '2024-08-30T12:00:00.000Z', value: 29.509984820290786 },
    ]);
}));
test('It processes Sofar Spotter API for daily data.', () => __awaiter(void 0, void 0, void 0, function* () {
    jest.setTimeout(30000);
    const values = yield (0, sofar_1.getSpotterData)('SPOT-300434063450120', process.env.SOFAR_API_TOKEN, new Date('2020-09-02'));
    expect(values.bottomTemperature.length).toEqual(144);
    expect(values.topTemperature.length).toEqual(144);
}));
test('it process Sofar Hindcast API for wind-wave data', () => __awaiter(void 0, void 0, void 0, function* () {
    jest.setTimeout(30000);
    const now = new Date();
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(now.getDate() - 1);
    const today = now.toISOString();
    const yesterday = yesterdayDate.toISOString();
    const response = yield (0, sofar_1.sofarHindcast)(constants_1.SofarModels.Wave, constants_1.sofarVariableIDs[constants_1.SofarModels.Wave].significantWaveHeight, -3.5976336810301888, -178.0000002552476, yesterday, today);
    const values = response === null || response === void 0 ? void 0 : response.values[0];
    expect(new Date(values === null || values === void 0 ? void 0 : values.timestamp).getTime()).toBeLessThanOrEqual(now.getTime());
}));
test('it process Sofar Wave Date API for surface temperature', () => __awaiter(void 0, void 0, void 0, function* () {
    jest.setTimeout(30000);
    const now = new Date();
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(now.getDate() - 1);
    const today = now.toISOString();
    const yesterday = yesterdayDate.toISOString();
    const response = yield (0, sofar_1.sofarWaveData)('SPOT-1519', process.env.SOFAR_API_TOKEN, yesterday, today);
    const values = response && response.data.waves.length;
    expect(values).toBeGreaterThan(0);
}));
