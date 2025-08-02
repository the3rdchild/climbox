"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultDates = exports.getStartEndDate = void 0;
const luxon_extensions_1 = require("../luxon-extensions");
function getStartEndDate(endDate, hours = 24) {
    const endMoment = luxon_extensions_1.DateTime.fromJSDate(endDate);
    const startMoment = endMoment.minus({ hours });
    return [startMoment.toString(), endMoment.toString()];
}
exports.getStartEndDate = getStartEndDate;
// Util function to get the [startDate, endDate] time interval for time series data.
// If no value for endDate is passed, then we define endDate as "now".
// If no value for startDate is passed, then we define startDate as three months before the endDate.
function getDefaultDates(start, end) {
    const endDate = end ? new Date(end) : new Date();
    const startDate = start
        ? new Date(start)
        : new Date(new Date(endDate).setMonth(endDate.getMonth() - 3));
    return { startDate, endDate };
}
exports.getDefaultDates = getDefaultDates;
