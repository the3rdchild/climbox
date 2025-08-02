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
const dailyData_1 = require("./dailyData");
test('It processes Sofar API for daily data.', () => __awaiter(void 0, void 0, void 0, function* () {
    jest.setTimeout(60000);
    const date = new Date('2024-08-31');
    date.setUTCHours(23, 59, 59, 999);
    const site = {
        id: 1,
        name: null,
        polygon: {
            type: 'Polygon',
            coordinates: [-122.699036598, 37.893756314],
        },
        sensorId: 'SPOT-300434063450120',
        depth: null,
        maxMonthlyMean: 22,
        status: 0,
        videoStream: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        timezone: 'Etc/GMT+12',
    };
    const values = yield (0, dailyData_1.getDailyData)(site, date);
    const expected = {
        site: { id: 1 },
        date,
        dailyAlertLevel: 0,
        degreeHeatingDays: 15.397786264922775,
        satelliteTemperature: 15.419691827607394,
    };
    expect(values).toEqual(expected);
}));
