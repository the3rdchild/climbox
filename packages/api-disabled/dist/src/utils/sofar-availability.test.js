"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coordinates_1 = require("./coordinates");
const sofar_availability_1 = require("./sofar-availability");
test('getting Sofar Wave Model availability zones', () => {
    expect(sofar_availability_1.AVAILABLE_POINTS.type).toBe('FeatureCollection');
    expect(sofar_availability_1.AVAILABLE_POINTS.features.length).toBeGreaterThanOrEqual(100);
});
test('snapping point to availability zones', () => {
    const point = (0, coordinates_1.createPoint)(150.091, -5.432);
    const validPoint = (0, sofar_availability_1.getSofarNearestAvailablePoint)(point);
    expect(validPoint).toEqual([150, -5]);
});
test('null island', () => {
    const point = (0, coordinates_1.createPoint)(0, 0);
    const validPoint = (0, sofar_availability_1.getSofarNearestAvailablePoint)(point);
    expect(validPoint).toEqual([0, 0]);
});
