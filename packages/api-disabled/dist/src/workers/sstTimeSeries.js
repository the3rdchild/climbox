"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSSTTimeSeriesUpdate = void 0;
const sites_entity_1 = require("../sites/sites.entity");
const sources_entity_1 = require("../sites/sources.entity");
const time_series_entity_1 = require("../time-series/time-series.entity");
const sst_time_series_1 = require("../utils/sst-time-series");
// we want to backfill at least 3 days ago, since the
// hindcast api has available data only from 2 days ago and before.
const SST_BACKFILL_DAYS = 4;
function runSSTTimeSeriesUpdate(dataSource) {
    return (0, sst_time_series_1.updateSST)([], SST_BACKFILL_DAYS, {
        siteRepository: dataSource.getRepository(sites_entity_1.Site),
        timeSeriesRepository: dataSource.getRepository(time_series_entity_1.TimeSeries),
        sourceRepository: dataSource.getRepository(sources_entity_1.Sources),
    });
}
exports.runSSTTimeSeriesUpdate = runSSTTimeSeriesUpdate;
