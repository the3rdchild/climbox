"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWindDirection = exports.getWindSpeed = exports.getMax = void 0;
const getMax = (numbers) => {
    return numbers.length > 0 ? Math.max(...numbers) : undefined;
};
exports.getMax = getMax;
const getWindSpeed = (windEastwardVelocity, windNorhwardVelocity) => {
    return Math.sqrt(Math.pow(windNorhwardVelocity, 2) + Math.pow(windEastwardVelocity, 2));
};
exports.getWindSpeed = getWindSpeed;
const getWindDirection = (windEastwardVelocity, windNorhwardVelocity) => {
    const degree = -(Math.atan2(windNorhwardVelocity, windEastwardVelocity) * 180) / Math.PI -
        90;
    return degree >= 0 ? degree : degree + 360;
};
exports.getWindDirection = getWindDirection;
