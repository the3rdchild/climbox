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
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshMaterializedView = exports.getRandomID = exports.insertSiteDataToTimeSeries = exports.getSources = exports.getNOAASource = exports.getDataRangeQuery = exports.getDataQuery = exports.getAvailableDataDates = exports.getAvailableMetricsQuery = exports.groupByMetricAndSource = void 0;
const typeorm_1 = require("typeorm");
const source_type_enum_1 = require("../sites/schemas/source-type.enum");
const dates_1 = require("./dates");
// TODO: Revisit the response structure and simplify when we have more metrics and sources available
const groupByMetricAndSource = (data) => {
    const groupedByMetricMap = new Map();
    data.forEach((x) => {
        const item = groupedByMetricMap.get(x.metric);
        if (item !== undefined) {
            groupedByMetricMap.set(x.metric, [...item, x]);
        }
        else {
            groupedByMetricMap.set(x.metric, [x]);
        }
    });
    const entries = Array.from(groupedByMetricMap.entries());
    const groupedByPointTypeDepth = entries.map(([key, val]) => {
        const groupByMap = new Map();
        val.forEach((x) => {
            const groupByKey = `${x.surveyPointId}_${x.source}_${x.depth}`;
            const item = groupByMap.get(groupByKey);
            if (item !== undefined) {
                groupByMap.set(groupByKey, [...item, x]);
            }
            else {
                groupByMap.set(groupByKey, [x]);
            }
        });
        const values = Array.from(groupByMap.values());
        const formatted = values.map((raw) => {
            const omittedBy = raw.map((x) => {
                const { metric, source, surveyPointId, surveyPointName, depth } = x, rest = __rest(x, ["metric", "source", "surveyPointId", "surveyPointName", "depth"]);
                return rest;
            });
            // all items should have the same source, pointId and depth, since we grouped them
            const item = raw[0];
            // this should never happen
            if (!item)
                throw new Error('Empty set of (source, pointId, depth)');
            return {
                type: item.source,
                depth: item.depth,
                surveyPoint: { id: item.surveyPointId, name: item.surveyPointName },
                data: omittedBy,
            };
        });
        return [key, formatted];
    });
    return Object.fromEntries(groupedByPointTypeDepth);
};
exports.groupByMetricAndSource = groupByMetricAndSource;
const getAvailableMetricsQuery = ({ timeSeriesRepository, siteId, start: startDate, end: endDate, surveyPointId, metrics, }) => {
    const { sql: surveyPointConditionSql, params: surveyPointConditionParams } = surveyPointId
        ? {
            sql: 'AND (source.survey_point_id = :surveyPointId OR source.survey_point_id IS NULL)',
            params: { surveyPointId },
        }
        : { sql: '', params: {} };
    const query = timeSeriesRepository
        .createQueryBuilder('time_series')
        .select('metric')
        .addSelect('source.type', 'source')
        .addSelect('source.depth', 'depth')
        .distinct(true)
        .innerJoin('time_series.source', 'source', `source.site_id = :siteId ${surveyPointConditionSql}`, Object.assign({ siteId }, surveyPointConditionParams))
        .leftJoin('source.surveyPoint', 'surveyPoint');
    const withStartDate = startDate
        ? query.andWhere('timestamp >= :startDate', { startDate })
        : query;
    const withEndDate = endDate
        ? withStartDate.andWhere('timestamp <= :endDate', { endDate })
        : withStartDate;
    const withMetrics = metrics.length > 0
        ? withEndDate.andWhere('metric IN (:...metrics)', { metrics })
        : withEndDate;
    return withMetrics.getRawMany();
};
exports.getAvailableMetricsQuery = getAvailableMetricsQuery;
const getAvailableDataDates = ({ timeSeriesRepository, siteId, surveyPointId, metrics, }) => {
    const { sql: surveyPointConditionSql, params: surveyPointConditionParams } = surveyPointId
        ? {
            sql: 'AND (source.survey_point_id = :surveyPointId OR source.survey_point_id IS NULL)',
            params: { surveyPointId },
        }
        : { sql: '', params: {} };
    const query = timeSeriesRepository
        .createQueryBuilder('time_series')
        .select('min("timestamp")')
        .addSelect('max("timestamp")')
        .innerJoin('time_series.source', 'source', `source.site_id = :siteId ${surveyPointConditionSql}`, Object.assign({ siteId }, surveyPointConditionParams))
        .leftJoin('source.surveyPoint', 'surveyPoint');
    const withMetrics = metrics.length > 0
        ? query.andWhere('metric IN (:...metrics)', {
            metrics,
        })
        : query;
    return withMetrics.getRawOne();
};
exports.getAvailableDataDates = getAvailableDataDates;
const getDataQuery = ({ timeSeriesRepository, siteId, metrics, start, end, hourly, surveyPointId, csv = false, order = 'ASC', }) => {
    const { endDate, startDate } = csv
        ? { startDate: start, endDate: end }
        : (0, dates_1.getDefaultDates)(start, end);
    const { sql: surveyPointConditionSql, params: surveyPointConditionParams } = surveyPointId
        ? {
            sql: 'AND (source.survey_point_id = :surveyPointId OR source.survey_point_id IS NULL)',
            params: { surveyPointId },
        }
        : { sql: '', params: {} };
    const query = timeSeriesRepository
        .createQueryBuilder('time_series')
        .select(hourly ? 'avg(value)' : 'value', 'value')
        .addSelect('metric')
        .addSelect('source.type', 'source')
        .addSelect(hourly ? "date_trunc('hour', timestamp)" : 'timestamp', 'timestamp')
        .addSelect('source.depth', 'depth')
        .innerJoin('time_series.source', 'source', `source.site_id = :siteId ${surveyPointConditionSql}`, Object.assign({ siteId }, surveyPointConditionParams))
        .leftJoin('source.surveyPoint', 'surveyPoint')
        .addSelect('surveyPoint.id', 'surveyPointId')
        .addSelect('surveyPoint.name', 'surveyPointName');
    const withStartDate = startDate
        ? query.andWhere('timestamp >= :startDate', { startDate })
        : query;
    const withEndDate = endDate
        ? withStartDate.andWhere('timestamp <= :endDate', { endDate })
        : withStartDate;
    const withMetrics = metrics.length > 0
        ? withEndDate.andWhere('metric IN (:...metrics)', { metrics })
        : withEndDate;
    return hourly
        ? withMetrics
            .groupBy("date_trunc('hour', timestamp), metric, source.type, surveyPoint.id, source.depth")
            .orderBy("date_trunc('hour', timestamp)", order)
            .getRawMany()
        : withMetrics.orderBy('timestamp', order).getRawMany();
};
exports.getDataQuery = getDataQuery;
const getDataRangeQuery = (timeSeriesRepository, siteId, surveyPointId) => {
    const surveyPointCondition = surveyPointId
        ? `(source.survey_point_id = ${surveyPointId} OR source.survey_point_id is NULL)`
        : '1=1';
    return timeSeriesRepository
        .createQueryBuilder('time_series')
        .select('metric')
        .addSelect('source.type', 'source')
        .addSelect('source.depth', 'depth')
        .addSelect('MIN(timestamp)', 'minDate')
        .addSelect('MAX(timestamp)', 'maxDate')
        .innerJoin('time_series.source', 'source', `source.site_id = :siteId AND ${surveyPointCondition}`, { siteId })
        .leftJoin('source.surveyPoint', 'surveyPoint')
        .addSelect('surveyPoint.id', 'surveyPointId')
        .addSelect('surveyPoint.name', 'surveyPointName')
        .groupBy('metric, source.type, surveyPoint.id, source.depth')
        .orderBy('MAX(timestamp)', 'ASC')
        .getRawMany();
};
exports.getDataRangeQuery = getDataRangeQuery;
/**
 * Fetch existing NOAA sources based on the sites.
 * If the source does not exists create it.
 * @param site The site entity
 * @param sourcesRepository The repository needed to make the query
 * @returns The source found or created
 */
const getNOAASource = (site, sourcesRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return sourcesRepository
        .findOne({
        where: {
            site: { id: site.id },
            type: source_type_enum_1.SourceType.NOAA,
            surveyPoint: (0, typeorm_1.IsNull)(),
        },
        relations: ['site', 'site.historicalMonthlyMean'],
    })
        .then((source) => {
        // If source exists return it
        if (source) {
            return source;
        }
        // Else create it and return the created entity
        return sourcesRepository.save({
            site,
            type: source_type_enum_1.SourceType.NOAA,
        });
    });
});
exports.getNOAASource = getNOAASource;
/**
 * Fetches the spotter sources based on the site.
 * If no such source exists, it creates it
 * @param sites The selected site
 * @param type The SourceType
 * @param sourceRepository The necessary repository to perform the query
 * @returns The requested source entity
 */
const getSources = (sites, type, sourceRepository) => {
    return sites.map((site) => sourceRepository
        .findOne({
        relations: ['site'],
        where: {
            site: { id: site.id },
            surveyPoint: (0, typeorm_1.IsNull)(),
            type,
            sensorId: type === source_type_enum_1.SourceType.SPOTTER && site.sensorId !== null
                ? site.sensorId
                : (0, typeorm_1.IsNull)(),
        },
    })
        .then((source) => {
        // If the source exists return it
        if (source) {
            return source;
        }
        // Else create it and return the created entity
        return sourceRepository.save({
            site,
            type,
            sensorId: type === source_type_enum_1.SourceType.SPOTTER ? site.sensorId : undefined,
        });
    }));
};
exports.getSources = getSources;
const insertSiteDataToTimeSeries = (data, metric, NOAASource, timeSeriesRepository) => {
    if (data.length === 0) {
        return null;
    }
    return timeSeriesRepository
        .createQueryBuilder('time_series')
        .insert()
        .values(data.map((dataPoint) => (Object.assign(Object.assign({}, dataPoint), { source: NOAASource, metric }))))
        .onConflict('ON CONSTRAINT "no_duplicate_data" DO NOTHING')
        .execute();
};
exports.insertSiteDataToTimeSeries = insertSiteDataToTimeSeries;
const getRandomID = (length = 7) => (Math.random() + 1).toString(36).substring(length);
exports.getRandomID = getRandomID;
const refreshMaterializedView = (repository) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, exports.getRandomID)();
    // eslint-disable-next-line no-console
    console.time(`Refresh Materialized View ${id}`);
    yield repository.query('REFRESH MATERIALIZED VIEW latest_data');
    // eslint-disable-next-line no-console
    console.timeEnd(`Refresh Materialized View ${id}`);
});
exports.refreshMaterializedView = refreshMaterializedView;
