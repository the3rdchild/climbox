"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.heatStressTracker = exports.getCollectionData = void 0;
const lodash_1 = __importStar(require("lodash"));
const source_type_enum_1 = require("../sites/schemas/source-type.enum");
const getCollectionData = (sites, latestDataRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const siteIds = sites.map((site) => site.id);
    if (!siteIds.length) {
        return {};
    }
    // Get latest data
    const latestData = yield latestDataRepository
        .createQueryBuilder('latest_data')
        .select('id')
        .addSelect('timestamp')
        .addSelect('value')
        .addSelect('site_id', 'siteId')
        .addSelect('survey_point_id', 'surveyPointId')
        .addSelect('metric')
        .addSelect('source')
        .where('site_id IN (:...siteIds)', { siteIds })
        .andWhere('source != :hoboSource', { hoboSource: source_type_enum_1.SourceType.HOBO })
        .getRawMany();
    // Map data to each site and map each site's data to the CollectionDataDto
    return (0, lodash_1.default)(latestData)
        .groupBy((o) => o.siteId)
        .mapValues((data) => data.reduce((acc, siteData) => {
        return Object.assign(Object.assign({}, acc), { [(0, lodash_1.camelCase)(siteData.metric)]: siteData.value });
    }, {}))
        .toJSON();
});
exports.getCollectionData = getCollectionData;
exports.heatStressTracker = {
    name: 'Heat Stress Tracker',
    sites: [],
    siteIds: [],
    isPublic: true,
};
