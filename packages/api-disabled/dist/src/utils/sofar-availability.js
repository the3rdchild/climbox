"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSofarNearestAvailablePoint = exports.AVAILABLE_POINTS = void 0;
const turf_1 = require("@turf/turf");
const sofar_availability_points_1 = __importDefault(require("./sofar-availability-points"));
exports.AVAILABLE_POINTS = {
    type: 'FeatureCollection',
    features: sofar_availability_points_1.default.map((coordinate) => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: coordinate,
        },
    })),
};
function getSofarNearestAvailablePoint(point) {
    // deconstructing number[] into [number, number] in order to make typescript compiler happy
    const [longitude, latitude] = (0, turf_1.nearestPoint)(point, exports.AVAILABLE_POINTS).geometry
        .coordinates;
    const poly = {
        type: 'Polygon',
        coordinates: [
            [
                [
                    ((180 + longitude - 0.25) % 360) - 180,
                    ((90 + latitude + 0.25) % 180) - 90,
                ],
                [
                    ((180 + longitude - 0.25) % 360) - 180,
                    ((90 + latitude - 0.25) % 180) - 90,
                ],
                [
                    ((180 + longitude + 0.25) % 360) - 180,
                    ((90 + latitude - 0.25) % 180) - 90,
                ],
                [
                    ((180 + longitude + 0.25) % 360) - 180,
                    ((90 + latitude + 0.25) % 180) - 90,
                ],
                // first again
                [
                    ((180 + longitude - 0.25) % 360) - 180,
                    ((90 + latitude + 0.25) % 180) - 90,
                ],
            ],
        ],
    };
    const pointCoordinates = point.coordinates;
    return (0, turf_1.booleanPointInPolygon)(point, poly)
        ? pointCoordinates
        : [longitude, latitude];
}
exports.getSofarNearestAvailablePoint = getSofarNearestAvailablePoint;
