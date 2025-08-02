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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadTimeSeriesData = exports.saveBatchToTimeSeries = exports.findOrCreateSourceEntity = exports.uploadFileToGCloud = exports.convertData = exports.trimWorkSheetData = exports.getFilePathData = exports.fileFilter = void 0;
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
const lodash_1 = require("lodash");
const md5_file_1 = __importDefault(require("md5-file"));
const common_1 = require("@nestjs/common");
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const bluebird_1 = __importDefault(require("bluebird"));
const site_utils_1 = require("../site.utils");
const google_cloud_service_1 = require("../../google-cloud/google-cloud.service");
const sofar_1 = require("../sofar");
const time_series_utils_1 = require("../time-series.utils");
const metrics_enum_1 = require("../../time-series/metrics.enum");
const users_entity_1 = require("../../users/users.entity");
const google_cloud_utils_1 = require("../google-cloud.utils");
const logger = new common_1.Logger('ParseSondeData');
const ACCEPTED_FILE_TYPES = [
    {
        extension: 'xlsx',
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    {
        extension: 'csv',
        mimetype: 'text/csv',
    },
    {
        extension: 'xls',
        mimetype: 'application/vnd.ms-excel',
    },
];
const TIMEZONE_REGEX = /[+-]\d{1,2}:?\d{0,2}\b/;
const SECONDS_IN_DAY = 24 * 60 * 60;
const MISSING_LEAP_YEAR_DAY = SECONDS_IN_DAY * 1000;
const MAGIC_NUMBER_OF_DAYS = 25569;
const nonMetric = [
    'date',
    'time',
    'timestamp',
    'aqualink_site_id',
    'aqualink_survey_point_id',
    'depth',
];
const rules = [
    // Non Metrics
    { token: 'date', expression: /^Date \(MM\/DD\/YYYY\)$/ },
    { token: 'date', expression: /^Date$/ },
    { token: 'time', expression: /^Time \(HH:mm:ss\)$/ },
    { token: 'time', expression: /^Time$/ },
    { token: 'timestamp', expression: /^Date Time$/ },
    { token: 'timestamp', expression: /^Date_Time$/ },
    { token: 'aqualink_site_id', expression: /^aqualink_site_id$/ },
    {
        token: 'aqualink_survey_point_id',
        expression: /^aqualink_survey_point_id$/,
    },
    { token: 'depth', expression: /^depth$/ },
    // Default Metrics
    // should match 'Temp, °C'
    { token: metrics_enum_1.Metric.AIR_TEMPERATURE, expression: /^Temp, .*C$/ },
    // should match 'Temp °C'
    { token: metrics_enum_1.Metric.BOTTOM_TEMPERATURE, expression: /^Temp .*C$/ },
    { token: metrics_enum_1.Metric.BOTTOM_TEMPERATURE, expression: /^Temp$/ },
    { token: metrics_enum_1.Metric.WIND_SPEED, expression: /^Wind Speed, m\/s$/ },
    // should match 'Wind Direction, ø'
    { token: metrics_enum_1.Metric.WIND_DIRECTION, expression: /^Wind Direction, .*$/ },
    // Sonde Metrics
    { token: metrics_enum_1.Metric.CHOLOROPHYLL_RFU, expression: /^Chlorophyll RFU$/ },
    {
        token: metrics_enum_1.Metric.CHOLOROPHYLL_CONCENTRATION,
        expression: /^Chlorophyll ug\/L$/,
    },
    // should match 'Cond µS/cm'
    { token: metrics_enum_1.Metric.CONDUCTIVITY, expression: /^Cond .*S\/cm$/ },
    { token: metrics_enum_1.Metric.WATER_DEPTH, expression: /^Depth m$/ },
    { token: metrics_enum_1.Metric.ODO_SATURATION, expression: /^ODO % sat$/ },
    { token: metrics_enum_1.Metric.ODO_SATURATION, expression: /^DO_sat$/ },
    { token: metrics_enum_1.Metric.ODO_CONCENTRATION, expression: /^ODO mg\/L$/ },
    { token: metrics_enum_1.Metric.ODO_CONCENTRATION, expression: /^DO$/ },
    { token: metrics_enum_1.Metric.SALINITY, expression: /^Sal psu$/ },
    { token: metrics_enum_1.Metric.SALINITY, expression: /^Salinity$/ },
    // should match 'SpCond µS/cm'
    { token: metrics_enum_1.Metric.SPECIFIC_CONDUCTANCE, expression: /^SpCond .*S\/cm$/ },
    { token: metrics_enum_1.Metric.TDS, expression: /^TDS mg\/L$/ },
    { token: metrics_enum_1.Metric.TURBIDITY, expression: /^Turbidity FNU$/ },
    { token: metrics_enum_1.Metric.TURBIDITY, expression: /^Turbidity$/ },
    { token: metrics_enum_1.Metric.TOTAL_SUSPENDED_SOLIDS, expression: /^TSS mg\/L$/ },
    { token: metrics_enum_1.Metric.SONDE_WIPER_POSITION, expression: /^Wiper Position volt$/ },
    { token: metrics_enum_1.Metric.PH, expression: /^pH$/ },
    { token: metrics_enum_1.Metric.PH_MV, expression: /^pH mV$/ },
    { token: metrics_enum_1.Metric.SONDE_BATTERY_VOLTAGE, expression: /^Battery V$/ },
    { token: metrics_enum_1.Metric.SONDE_CABLE_POWER_VOLTAGE, expression: /^Cable Pwr V$/ },
    { token: metrics_enum_1.Metric.PRESSURE, expression: /^Pressure, mbar$/ },
    { token: metrics_enum_1.Metric.PRECIPITATION, expression: /^Rain, mm$/ },
    { token: metrics_enum_1.Metric.RH, expression: /^RH, %$/ },
    { token: metrics_enum_1.Metric.WIND_GUST_SPEED, expression: /^Gust Speed, m\/s$/ },
    // HUI Metrics
    { token: metrics_enum_1.Metric.NITROGEN_TOTAL, expression: /^TotalN$/ },
    { token: metrics_enum_1.Metric.PHOSPHORUS_TOTAL, expression: /^TotalP$/ },
    { token: metrics_enum_1.Metric.PHOSPHORUS, expression: /^Phosphate$/ },
    { token: metrics_enum_1.Metric.SILICATE, expression: /^Silicate$/ },
    { token: metrics_enum_1.Metric.NNN, expression: /^NNN$/ },
    { token: metrics_enum_1.Metric.AMMONIUM, expression: /^NH4$/ },
];
const fileFilter = (_, file, callback) => {
    if (!ACCEPTED_FILE_TYPES.map(({ mimetype }) => mimetype).includes(file.mimetype)) {
        callback(new common_1.BadRequestException(`Only ${ACCEPTED_FILE_TYPES.map(({ extension }) => `.${extension}`).join(', ')} files are accepted`), false);
    }
    callback(null, true);
};
exports.fileFilter = fileFilter;
const getJsDateFromExcel = (excelDate, timezone) => {
    const delta = excelDate - MAGIC_NUMBER_OF_DAYS;
    const parsed = delta * MISSING_LEAP_YEAR_DAY;
    if (timezone) {
        return new Date(`${parsed} GMT ${timezone}`);
    }
    return new Date(parsed);
};
const getTimeStamp = (index, item, mimetype, timezone) => {
    const isArray = Array.isArray(index);
    if (isArray &&
        typeof item[index[0]] === 'string' &&
        typeof item[index[1]] === 'string')
        return new Date(`${item[index[0]]} ${item[index[1]]}`);
    if (isArray) {
        const date = new Date(Date.UTC(1900, 0));
        // We get the date as days from 1900. We have to subtract 1 to exactly match the date
        date.setDate(item[index[0]] - 1 || 0);
        // in some cases 1:30:00 will be interpreted as 25:30:00. In this representation of time seconds are
        // a number from 0 to 1, so we want to keep only the first 24 hours to avoid such errors (therefore the % 1)
        date.setSeconds(Math.round(SECONDS_IN_DAY * (item[index[1]] % 1 || 0)));
        return date;
    }
    if (!isArray && mimetype === 'text/csv' && timezone)
        return new Date(`${item[index]} GMT ${timezone}`);
    if (!isArray && mimetype === 'text/csv' && !timezone)
        return new Date(item[index]);
    return getJsDateFromExcel(item[index], timezone);
};
const findTimeStampIndex = (headerToTokenMap) => {
    const timestampIndex = headerToTokenMap.findIndex((x) => x === 'timestamp');
    if (timestampIndex !== -1)
        return timestampIndex;
    const timeIndex = headerToTokenMap.findIndex((x) => x === 'time');
    const dateIndex = headerToTokenMap.findIndex((x) => x === 'date');
    if (timeIndex === -1 || dateIndex === -1) {
        throw new common_1.BadRequestException('Not current timestamp schema');
    }
    return [dateIndex, timeIndex];
};
const getFilePathData = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const workSheetsFromFile = node_xlsx_1.default.parse(filePath, { raw: true });
    const workSheetData = (_a = workSheetsFromFile[0]) === null || _a === void 0 ? void 0 : _a.data;
    const headerIndex = workSheetData === null || workSheetData === void 0 ? void 0 : workSheetData.findIndex((row) => rules.some((rule) => row.some((cell) => typeof cell === 'string' && rule.expression.test(cell))));
    const headers = workSheetData[headerIndex];
    const headerToTokenMap = headers.map((x) => { var _a; return (_a = rules.find((rule) => rule.expression.test(x))) === null || _a === void 0 ? void 0 : _a.token; });
    const importedMetrics = headerToTokenMap.filter((x) => x !== undefined && !nonMetric.includes(x));
    const ignoredHeaders = headers.filter((x, i) => headerToTokenMap[i] === undefined);
    const signature = yield (0, md5_file_1.default)(filePath);
    return {
        workSheetData,
        signature,
        ignoredHeaders,
        importedMetrics,
        headers,
        headerIndex,
        headerToTokenMap,
    };
});
exports.getFilePathData = getFilePathData;
const trimWorkSheetData = (workSheetData, headers, headerIndex) => (workSheetData !== null && workSheetData !== void 0 ? workSheetData : [])
    .slice(headerIndex + 1)
    .map((item) => {
    if (item.length === headers.length)
        return item;
    return undefined;
})
    .filter((item) => item !== undefined);
exports.trimWorkSheetData = trimWorkSheetData;
const groupBySitePointDepth = ({ trimmedWorkSheetData, headerToTokenMap, siteId, surveyPointId, }) => {
    logger.log('Grouping data');
    const siteIdIndex = headerToTokenMap.findIndex((x) => x === 'aqualink_site_id');
    const surveyPointIdIndex = headerToTokenMap.findIndex((x) => x === 'aqualink_survey_point_id');
    const depthIndex = headerToTokenMap.findIndex((x) => x === 'depth');
    const groupedByMap = new Map();
    trimmedWorkSheetData.forEach((val) => {
        const rowSiteId = siteId || val[siteIdIndex] || '';
        const rowSurveyPointId = surveyPointId || val[surveyPointIdIndex] || '';
        const rowDepth = val[depthIndex] || '';
        const key = `${rowSiteId}_${rowSurveyPointId}_${rowDepth}`;
        const item = groupedByMap.get(key);
        if (item !== undefined) {
            // eslint-disable-next-line fp/no-mutating-methods -- mutating for performance, instead of spreading
            item.push(val);
        }
        else {
            groupedByMap.set(key, [val]);
        }
    });
    return Array.from(groupedByMap).map(([key, data]) => {
        const [rowSiteId, rowSurveyPointId, depth] = key.split('_');
        return {
            data,
            siteId: parseInt(rowSiteId, 10),
            surveyPointId: parseInt(rowSurveyPointId, 10) || undefined,
            depth: parseInt(depth, 10) || undefined,
        };
    });
};
const convertData = (workSheetData, headers, fileName, sourceEntity, headerToTokenMap, siteTimezone, mimetype) => {
    const timestampIndex = findTimeStampIndex(headerToTokenMap);
    const timezone = typeof timestampIndex === 'number'
        ? (0, lodash_1.first)(headers[timestampIndex].match(TIMEZONE_REGEX))
        : undefined;
    const metricHeadersMap = headerToTokenMap.reduce((acc, token, i) => {
        if (token === undefined || nonMetric.includes(token)) {
            return acc;
        }
        return Object.assign(Object.assign({}, acc), { [i]: token });
    }, {});
    const results = Array(workSheetData.length * Object.keys(metricHeadersMap).length);
    let resultsIndex = 0;
    console.time(`Get data from sheet ${fileName}`);
    workSheetData.forEach((row) => {
        const timestampDate = getTimeStamp(timestampIndex, row, mimetype, timezone);
        // This need to be done for each row to take into account daylight savings
        // and other things that may affect timezone offset in that exact date
        const offsetInMil = siteTimezone !== null
            ? getTimezoneOffset(siteTimezone, timestampDate)
            : 0;
        const timestamp = new Date(timestampDate.valueOf() - offsetInMil).toISOString();
        row.forEach((cell, i) => {
            const metric = metricHeadersMap[i];
            if (metric) {
                // eslint-disable-next-line fp/no-mutation -- mutating for performance
                results[resultsIndex++] = {
                    timestamp,
                    value: parseFloat(cell),
                    metric: metric,
                    source: sourceEntity,
                };
            }
        });
    }, []);
    console.timeEnd(`Get data from sheet ${fileName}`);
    console.time(`Remove duplicates and empty values ${fileName}`);
    const data = (0, lodash_1.uniqBy)(results.filter((valueObject) => {
        if (!(0, lodash_1.isNaN)(valueObject.value)) {
            return true;
        }
        logger.log('Excluding incompatible value:');
        logger.log(valueObject);
        return false;
    }), ({ timestamp, metric, source }) => `${timestamp}, ${metric}, ${source.id}`);
    console.timeEnd(`Remove duplicates and empty values ${fileName}`);
    return data;
};
exports.convertData = convertData;
const uploadFileToGCloud = (dataUploadsRepository, signature, sources, fileName, filePath, minDate, maxDate, importedHeaders) => __awaiter(void 0, void 0, void 0, function* () {
    logger.warn(`Uploading file to google cloud: ${fileName}`);
    const uploadExists = yield dataUploadsRepository.findOne({
        where: {
            signature,
        },
    });
    if (uploadExists) {
        common_1.Logger.warn(`${fileName}: A file upload named '${uploadExists.file}' with the same data already exists`);
        return uploadExists;
    }
    // Initialize google cloud service, to be used for media upload
    const googleCloudService = new google_cloud_service_1.GoogleCloudService();
    // Note this may fail. It would still return a location, but the file may not have been uploaded
    const fileLocation = googleCloudService.uploadFileAsync(filePath, sources.length === 1 ? sources[0] : 'multi_source', google_cloud_utils_1.GoogleCloudDir.DATA_UPLOADS, 'data_upload');
    const dataUploadsFile = yield dataUploadsRepository.save({
        file: fileName,
        signature,
        sensorTypes: sources,
        minDate,
        maxDate,
        metrics: importedHeaders,
        fileLocation,
    });
    return dataUploadsFile;
});
exports.uploadFileToGCloud = uploadFileToGCloud;
const findOrCreateSourceEntity = ({ site, sourceType, surveyPoint, depth, sourcesRepository, }) => __awaiter(void 0, void 0, void 0, function* () {
    const existingSourceEntity = yield sourcesRepository.findOne({
        relations: ['surveyPoint', 'site'],
        where: {
            site: { id: site.id },
            surveyPoint: { id: surveyPoint === null || surveyPoint === void 0 ? void 0 : surveyPoint.id },
            type: sourceType,
            depth,
        },
    });
    const sourceEntity = existingSourceEntity ||
        (yield sourcesRepository.save({
            type: sourceType,
            site,
            surveyPoint,
            depth,
        }));
    return sourceEntity;
});
exports.findOrCreateSourceEntity = findOrCreateSourceEntity;
const saveBatchToTimeSeries = (data, timeSeriesRepository, batchSize = 100) => {
    logger.log(`Saving time series data in batches of ${batchSize}`);
    const inserts = (0, lodash_1.chunk)(data, batchSize).map((batch) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield timeSeriesRepository
                .createQueryBuilder('time_series')
                .insert()
                .values(batch)
                // If there's a conflict, replace data with the new value.
                // onConflict is deprecated, but updating it is tricky.
                // See https://github.com/typeorm/typeorm/issues/8731?fbclid=IwAR2Obg9eObtGNRXaFrtKvkvvVSWfvjtHpFu-VEM47yg89SZcPpxEcZOmcLw
                .onConflict('ON CONSTRAINT "no_duplicate_data" DO UPDATE SET "value" = excluded.value')
                .execute();
        }
        catch (err) {
            console.warn('The following batch failed to upload:\n', batch);
            console.error(err);
        }
        return true;
    }));
    // Return insert promises and print progress updates
    const actionsLength = inserts.length;
    return bluebird_1.default.Promise.each(inserts, (props, idx) => {
        logger.log(`Saved ${idx + 1} out of ${actionsLength} batches`);
    });
};
exports.saveBatchToTimeSeries = saveBatchToTimeSeries;
function getTimezoneOffset(timezone, date) {
    try {
        const timezoneDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
        return timezoneDate.valueOf() - date.valueOf();
    }
    catch (_a) {
        return 0;
    }
}
const createEntitiesAndConvert = ({ workSheetData, siteId, surveyPointId, headers, fileName, headerToTokenMap, sourceType, repositories, depth, mimetype, siteTimezone, }) => __awaiter(void 0, void 0, void 0, function* () {
    const [site, surveyPoint] = yield Promise.all([
        (0, site_utils_1.getSite)(siteId, repositories.siteRepository),
        surveyPointId
            ? repositories.surveyPointRepository.findOneBy({
                id: surveyPointId,
            })
            : undefined,
    ]);
    if (surveyPoint) {
        yield (0, site_utils_1.surveyPointBelongsToSite)(site.id, surveyPoint.id, repositories.surveyPointRepository);
    }
    const sourceEntity = yield (0, exports.findOrCreateSourceEntity)({
        site,
        sourceType,
        surveyPoint: surveyPoint || null,
        depth,
        sourcesRepository: repositories.sourcesRepository,
    });
    const data = (0, exports.convertData)(workSheetData, headers, fileName, sourceEntity, headerToTokenMap, siteTimezone ? site.timezone : null, mimetype);
    return { data, sourceEntity, site, surveyPoint };
});
const uploadPerSiteAndPoint = ({ data, site, surveyPoint, repositories, dataUploadsFileEntity, }) => __awaiter(void 0, void 0, void 0, function* () {
    const dataAsTimeSeriesNoDiffs = data.map((x) => {
        return {
            timestamp: x.timestamp,
            value: x.value,
            metric: x.metric,
            source: x.source,
            dataUpload: dataUploadsFileEntity,
        };
    });
    const barometricPressures = dataAsTimeSeriesNoDiffs.filter((x) => x.metric === metrics_enum_1.Metric.BAROMETRIC_PRESSURE_TOP);
    const pressuresBySource = (0, lodash_1.groupBy)(barometricPressures, 'source.site.id');
    const barometricDiffs = Object.entries(pressuresBySource).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([key, pressures]) => {
        // eslint-disable-next-line fp/no-mutating-methods
        const sortedPressures = pressures.sort((a, b) => {
            if (a.timestamp > b.timestamp)
                return 1;
            if (a.timestamp < b.timestamp)
                return -1;
            return 0;
        });
        const valueDiff = (0, sofar_1.getBarometricDiff)(sortedPressures);
        return valueDiff !== null
            ? {
                timestamp: valueDiff.timestamp,
                value: valueDiff.value,
                metric: metrics_enum_1.Metric.BAROMETRIC_PRESSURE_TOP_DIFF,
                source: sortedPressures[1].source,
                dataUpload: dataUploadsFileEntity,
            }
            : undefined;
    });
    const filteredDiffs = barometricDiffs.filter((x) => x !== undefined);
    const dataAsTimeSeries = [...dataAsTimeSeriesNoDiffs, ...filteredDiffs];
    // Data is too big to added with one bulk insert so we batch the upload.
    console.time(`Loading into DB site: ${site.id}, surveyPoint: ${surveyPoint === null || surveyPoint === void 0 ? void 0 : surveyPoint.id}`);
    yield (0, exports.saveBatchToTimeSeries)(dataAsTimeSeries, repositories.timeSeriesRepository);
    console.timeEnd(`Loading into DB site: ${site.id}, surveyPoint: ${surveyPoint === null || surveyPoint === void 0 ? void 0 : surveyPoint.id}`);
    const minDate = (0, lodash_1.get)((0, lodash_1.minBy)(dataAsTimeSeries, (item) => new Date((0, lodash_1.get)(item, 'timestamp')).getTime()), 'timestamp');
    const maxDate = (0, lodash_1.get)((0, lodash_1.maxBy)(dataAsTimeSeries, (item) => new Date((0, lodash_1.get)(item, 'timestamp')).getTime()), 'timestamp');
    try {
        // This will fail on file re upload
        yield repositories.dataUploadsSitesRepository.save({
            dataUpload: dataUploadsFileEntity,
            site,
            surveyPoint,
            minDate,
            maxDate,
        });
    }
    catch (error) {
        logger.warn((error === null || error === void 0 ? void 0 : error.message) || error);
    }
    logger.log('loading complete');
});
const uploadTimeSeriesData = ({ user, filePath, fileName, siteId, surveyPointId, sourceType, repositories, multiSiteUpload, failOnWarning, mimetype, siteTimezone, }) => __awaiter(void 0, void 0, void 0, function* () {
    console.time(`Upload data file ${fileName}`);
    if (!multiSiteUpload && !siteId) {
        throw new common_1.BadRequestException('SiteId is undefined');
    }
    const { workSheetData, signature, ignoredHeaders, importedMetrics, headers, headerIndex, headerToTokenMap, } = yield (0, exports.getFilePathData)(filePath);
    if (failOnWarning && ignoredHeaders.length > 0) {
        throw new common_1.BadRequestException(`${fileName}: The columns ${ignoredHeaders
            .map((header) => header.replace(/\r?\n|\r/g, ''))
            .join(', ')} are not configured for import yet and cannot be uploaded.`);
    }
    const siteInfo = headerToTokenMap.findIndex((x) => x === 'aqualink_survey_point_id' || x === 'aqualink_site_id') > -1;
    if (!multiSiteUpload && siteInfo)
        throw new common_1.BadRequestException('File can not include aqualink site information, in this type of request');
    if (multiSiteUpload) {
        // user should never be undefined here since this is a protected endpoint
        if (!user)
            throw new common_1.InternalServerErrorException();
        const siteIdIndex = headerToTokenMap.findIndex((x) => x === 'aqualink_site_id');
        if (siteIdIndex < 0)
            throw new common_1.BadRequestException(`no 'aqualink_site_id' column specified`);
        const ids = workSheetData
            .map((x) => x[siteIdIndex])
            .filter((x) => !Number.isNaN(Number(x)));
        const uniqueIds = [...new Map(ids.map((x) => [x, x])).keys()];
        const isSiteAdmin = uniqueIds.length > 0
            ? yield repositories.siteRepository
                .createQueryBuilder('site')
                .innerJoin('site.admins', 'admins', 'admins.id = :userId', {
                userId: user.id,
            })
                .andWhere('site.id IN (:...siteIds)', { siteIds: uniqueIds })
                .getMany()
            : [];
        const isSuperAdmin = user.adminLevel === users_entity_1.AdminLevel.SuperAdmin;
        if (isSiteAdmin.length !== uniqueIds.length && !isSuperAdmin) {
            throw new common_1.BadRequestException(`Invalid values for 'aqualink_site_id'`);
        }
    }
    const trimmed = (0, exports.trimWorkSheetData)(workSheetData, headers, headerIndex);
    const groupedData = groupBySitePointDepth({
        trimmedWorkSheetData: trimmed,
        headerToTokenMap,
        siteId,
        surveyPointId,
    });
    const converted = yield Promise.all(groupedData.map((x) => {
        return createEntitiesAndConvert({
            workSheetData: x.data,
            siteId: x.siteId,
            surveyPointId: x.surveyPointId,
            depth: x.depth,
            headers,
            fileName,
            headerToTokenMap,
            sourceType,
            repositories,
            mimetype,
            siteTimezone,
        });
    }));
    const allDataCombined = converted.map((x) => x.data).flat();
    const minDate = (0, lodash_1.get)((0, lodash_1.minBy)(allDataCombined, (item) => new Date((0, lodash_1.get)(item, 'timestamp')).getTime()), 'timestamp');
    const maxDate = (0, lodash_1.get)((0, lodash_1.maxBy)(allDataCombined, (item) => new Date((0, lodash_1.get)(item, 'timestamp')).getTime()), 'timestamp');
    const dataUploadsFile = yield (0, exports.uploadFileToGCloud)(repositories.dataUploadsRepository, signature, [sourceType], fileName, filePath, minDate, maxDate, importedMetrics);
    yield Promise.all(converted.map((x) => {
        var _a;
        return uploadPerSiteAndPoint({
            data: x.data,
            site: x.site,
            surveyPoint: (_a = x.surveyPoint) !== null && _a !== void 0 ? _a : undefined,
            repositories,
            dataUploadsFileEntity: dataUploadsFile,
        });
    }));
    (0, time_series_utils_1.refreshMaterializedView)(repositories.dataUploadsRepository);
    console.timeEnd(`Upload data file ${fileName}`);
    return ignoredHeaders;
});
exports.uploadTimeSeriesData = uploadTimeSeriesData;
