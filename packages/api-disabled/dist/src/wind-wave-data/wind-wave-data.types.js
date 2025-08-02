"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindWaveMetric = void 0;
const metrics_enum_1 = require("../time-series/metrics.enum");
// This enum should always be a subset of Metric enum
var WindWaveMetric;
(function (WindWaveMetric) {
    WindWaveMetric["SIGNIFICANT_WAVE_HEIGHT"] = "significant_wave_height";
    WindWaveMetric["WAVE_MEAN_DIRECTION"] = "wave_mean_direction";
    WindWaveMetric["WAVE_MEAN_PERIOD"] = "wave_mean_period";
    WindWaveMetric["WIND_SPEED"] = "wind_speed";
    WindWaveMetric["WIND_DIRECTION"] = "wind_direction";
})(WindWaveMetric = exports.WindWaveMetric || (exports.WindWaveMetric = {}));
