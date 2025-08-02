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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stormGlassGetWeather = void 0;
const retry_axios_1 = __importDefault(require("./retry-axios"));
const constants_1 = require("./constants");
function stormGlassGetWeather({ latitude, longitude, params, source, start, end, raw = false, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const queryParams = Object.assign(Object.assign(Object.assign({ lat: latitude, lng: longitude, params: params.join(',') }, (source && {
            source: Array.isArray(source) ? source.join(',') : source,
        })), (start && { start })), (end && { end }));
        return retry_axios_1.default
            .get(`${constants_1.STORM_GLASS_BASE_URL}/weather/point`, {
            headers: {
                Authorization: process.env.STORMGLASS_API_KEY,
            },
            params: queryParams,
        })
            .then((response) => {
            if (raw)
                return response.data;
            return response.data.hours[0];
        })
            .then((data) => {
            if (raw)
                return data;
            const { time } = data, other = __rest(data, ["time"]);
            const entries = Object.entries(other).map((prop) => {
                const arrValues = Object.values(prop[1]);
                const sum = arrValues.reduce((a, b) => a + b, 0);
                const avgValue = sum / arrValues.length;
                return [
                    prop[0],
                    {
                        timestamp: time,
                        value: avgValue,
                    },
                ];
            });
            return Object.fromEntries(entries);
        })
            .catch((error) => {
            if (error.response) {
                console.error(`StormGlass API /weather/point responded with a ${error.response.status} status. ${error.response.data.message}`);
            }
            else {
                console.error(`An error occurred accessing the StormGlass API /weather/point - ${error}`);
            }
        });
    });
}
exports.stormGlassGetWeather = stormGlassGetWeather;
