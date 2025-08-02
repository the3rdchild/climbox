"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoint = exports.pointToPixel = exports.pointToIndex = void 0;
function pointToIndex(long, lat, boundingBox, width, height) {
    const [minLong, minLat, maxLong, maxLat] = boundingBox;
    const geoWidth = Math.abs(maxLong - minLong);
    const geoHeight = Math.abs(maxLat - minLat);
    // Normalize longitude and latitude depending on the boundingBox convention
    const tempLong = minLong >= 0
        ? (((long % 360) + 540) % 360) - 180
        : ((long + 180) % 360) - 180;
    const tempLat = minLat >= 0 ? (((lat % 180) + 270) % 180) - 90 : ((lat + 90) % 180) - 90;
    const indexLong = Math.round((Math.abs(tempLong - minLong) / geoWidth) * width);
    const indexLat = Math.round((Math.abs(tempLat - minLat) / geoHeight) * height);
    return { indexLong, indexLat };
}
exports.pointToIndex = pointToIndex;
function pointToPixel(long, lat, boundingBox, width, height) {
    const { indexLong, indexLat } = pointToIndex(long, lat, boundingBox, width, height);
    // Pixel (0, 0) is the top left corner.
    const pixelX = indexLong;
    const pixelY = height - indexLat;
    return { pixelX, pixelY };
}
exports.pointToPixel = pointToPixel;
const createPoint = (longitude, latitude, numberOfDecimals = 5) => {
    const precision = Math.pow(10, numberOfDecimals);
    return {
        type: 'Point',
        coordinates: [
            Math.round((longitude + Number.EPSILON) * precision) / precision,
            Math.round((latitude + Number.EPSILON) * precision) / precision,
        ],
    };
};
exports.createPoint = createPoint;
