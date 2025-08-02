"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = require("./math");
test('It calculates direction properly from velocity.', () => {
    // We use the meteorological convention - the direction the wind is "COMING FROM".
    // getWindDirection(windEastwardVelocity: number, windNorhwardVelocity)
    const eastWindDirection = (0, math_1.getWindDirection)(-1, 0);
    expect(eastWindDirection).toEqual(90);
    const northWindDirection = (0, math_1.getWindDirection)(0, -1);
    expect(northWindDirection).toEqual(0);
    const northEastWindDirection = (0, math_1.getWindDirection)(-1, -1);
    expect(northEastWindDirection).toEqual(45);
    const northWestWindDirection = (0, math_1.getWindDirection)(1, -1);
    expect(northWestWindDirection).toEqual(315);
});
