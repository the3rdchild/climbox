"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWindWaveTimeSeriesUpdate = exports.runSpotterTimeSeriesUpdate = void 0;
const forecast_data_entity_1 = require("../wind-wave-data/forecast-data.entity");
const exclusion_dates_entity_1 = require("../sites/exclusion-dates.entity");
const sites_entity_1 = require("../sites/sites.entity");
const sources_entity_1 = require("../sites/sources.entity");
const time_series_entity_1 = require("../time-series/time-series.entity");
const spotter_time_series_1 = require("../utils/spotter-time-series");
const hindcast_wind_wave_1 = require("../utils/hindcast-wind-wave");
// since this is hourly run we want to only take the latest data.
const DAYS_OF_SPOTTER_DATA = 1;
function runSpotterTimeSeriesUpdate(dataSource, skipDistanceCheck) {
    return (0, spotter_time_series_1.addSpotterData)([], DAYS_OF_SPOTTER_DATA, {
        siteRepository: dataSource.getRepository(sites_entity_1.Site),
        sourceRepository: dataSource.getRepository(sources_entity_1.Sources),
        timeSeriesRepository: dataSource.getRepository(time_series_entity_1.TimeSeries),
        exclusionDatesRepository: dataSource.getRepository(exclusion_dates_entity_1.ExclusionDates),
    }, skipDistanceCheck);
}
exports.runSpotterTimeSeriesUpdate = runSpotterTimeSeriesUpdate;
function runWindWaveTimeSeriesUpdate(dataSource) {
    return (0, hindcast_wind_wave_1.addWindWaveData)([], {
        siteRepository: dataSource.getRepository(sites_entity_1.Site),
        hindcastRepository: dataSource.getRepository(forecast_data_entity_1.ForecastData),
    });
}
exports.runWindWaveTimeSeriesUpdate = runWindWaveTimeSeriesUpdate;
