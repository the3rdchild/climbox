"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var TimeSeriesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSeriesService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const fs_1 = require("fs");
const typeorm_2 = require("typeorm");
const bluebird_1 = __importDefault(require("bluebird"));
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const monitoring_entity_1 = require("../monitoring/monitoring.entity");
const monitoring_metric_enum_1 = require("../monitoring/schemas/monitoring-metric.enum");
const csv_utils_1 = require("../utils/csv-utils");
const luxon_extensions_1 = require("../luxon-extensions");
const time_series_entity_1 = require("./time-series.entity");
const time_series_utils_1 = require("../utils/time-series.utils");
const sites_entity_1 = require("../sites/sites.entity");
const site_survey_points_entity_1 = require("../site-survey-points/site-survey-points.entity");
const sources_entity_1 = require("../sites/sources.entity");
const upload_sheet_data_1 = require("../utils/uploads/upload-sheet-data");
const source_type_enum_1 = require("../sites/schemas/source-type.enum");
const data_uploads_entity_1 = require("../data-uploads/data-uploads.entity");
const site_utils_1 = require("../utils/site.utils");
const data_uploads_sites_entity_1 = require("../data-uploads/data-uploads-sites.entity");
const DATE_FORMAT = 'yyyy_MM_dd';
let TimeSeriesService = TimeSeriesService_1 = class TimeSeriesService {
    constructor(timeSeriesRepository, siteRepository, surveyPointRepository, sourcesRepository, dataUploadsRepository, dataUploadsSitesRepository, monitoringRepository) {
        this.timeSeriesRepository = timeSeriesRepository;
        this.siteRepository = siteRepository;
        this.surveyPointRepository = surveyPointRepository;
        this.sourcesRepository = sourcesRepository;
        this.dataUploadsRepository = dataUploadsRepository;
        this.dataUploadsSitesRepository = dataUploadsSitesRepository;
        this.monitoringRepository = monitoringRepository;
        this.logger = new common_1.Logger(TimeSeriesService_1.name);
    }
    findSurveyPointData(surveyPointDataDto, metrics, startDate, endDate, hourly) {
        return __awaiter(this, void 0, void 0, function* () {
            const { siteId, surveyPointId } = surveyPointDataDto;
            const data = yield (0, time_series_utils_1.getDataQuery)({
                timeSeriesRepository: this.timeSeriesRepository,
                siteId,
                metrics,
                start: startDate,
                end: endDate,
                hourly,
                surveyPointId,
            });
            return (0, time_series_utils_1.groupByMetricAndSource)(data);
        });
    }
    findSiteData(siteDataDto, metrics, startDate, endDate, hourly) {
        return __awaiter(this, void 0, void 0, function* () {
            const { siteId } = siteDataDto;
            this.monitoringRepository.save({
                site: { id: siteId },
                metric: monitoring_metric_enum_1.MonitoringMetric.TimeSeriesRequest,
            });
            const data = yield (0, time_series_utils_1.getDataQuery)({
                timeSeriesRepository: this.timeSeriesRepository,
                siteId,
                metrics,
                start: startDate,
                end: endDate,
                hourly,
            });
            return (0, time_series_utils_1.groupByMetricAndSource)(data);
        });
    }
    findSiteDataCsv(res, siteDataDto, metrics, startDate, endDate, hourly) {
        return __awaiter(this, void 0, void 0, function* () {
            const { siteId } = siteDataDto;
            this.monitoringRepository.save({
                site: { id: siteId },
                metric: monitoring_metric_enum_1.MonitoringMetric.CSVDownload,
            });
            const uniqueMetrics = yield (0, time_series_utils_1.getAvailableMetricsQuery)({
                timeSeriesRepository: this.timeSeriesRepository,
                siteId,
                start: startDate,
                end: endDate,
                metrics,
            });
            const headerKeys = [
                'timestamp',
                ...uniqueMetrics.map((x) => {
                    const depth = x.depth ? `_${x.depth}` : '';
                    return `${x.metric}_${x.source}${depth}`;
                }),
            ];
            const emptyRow = Object.fromEntries(headerKeys.map((x) => [x, undefined]));
            const { min, max } = (yield (0, time_series_utils_1.getAvailableDataDates)({
                timeSeriesRepository: this.timeSeriesRepository,
                siteId,
                metrics,
            })) || { min: new Date(), max: new Date() };
            const minDate = luxon_extensions_1.DateTime.fromISO(startDate || min.toISOString()).startOf('hour');
            const maxDate = luxon_extensions_1.DateTime.fromISO(endDate || max.toISOString()).startOf('hour');
            const filename = `data_site_${siteId}_${minDate.toFormat(DATE_FORMAT)}_${maxDate.toFormat(DATE_FORMAT)}.csv`;
            const getRows = (startDateRows, endDateRows) => __awaiter(this, void 0, void 0, function* () {
                const data = yield (0, time_series_utils_1.getDataQuery)({
                    timeSeriesRepository: this.timeSeriesRepository,
                    siteId,
                    metrics,
                    start: startDateRows.toISOString(),
                    end: endDateRows.toISOString(),
                    hourly,
                    csv: true,
                    order: 'DESC',
                });
                const metricSourceAsKey = data.map((x) => {
                    const depth = x.depth ? `_${x.depth}` : '';
                    return {
                        key: `${x.metric}_${x.source}${depth}`,
                        value: x.value,
                        timestamp: x.timestamp,
                    };
                });
                const groupedByTimestamp = metricSourceAsKey.reduce((acc, curr) => {
                    const key = curr.timestamp.toISOString();
                    const accValue = acc[key];
                    if (typeof accValue === 'object') {
                        // eslint-disable-next-line fp/no-mutating-methods
                        accValue.push(curr);
                    }
                    else {
                        // eslint-disable-next-line fp/no-mutation
                        acc[key] = [curr];
                    }
                    return acc;
                }, {});
                return Object.entries(groupedByTimestamp).map(([timestamp, values]) => values.reduce((acc, curr) => {
                    // eslint-disable-next-line fp/no-mutation
                    acc[curr.key] = curr.value;
                    // eslint-disable-next-line fp/no-mutation
                    acc.timestamp = timestamp;
                    return acc;
                }, structuredClone(emptyRow)));
            });
            (0, csv_utils_1.ReturnCSV)({
                res,
                startDate: minDate.toJSDate(),
                endDate: maxDate.toJSDate(),
                filename,
                getRows,
            });
        });
    }
    findSurveyPointDataRange(surveyPointDataRangeDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { siteId, surveyPointId } = surveyPointDataRangeDto;
            yield (0, site_utils_1.surveyPointBelongsToSite)(siteId, surveyPointId, this.surveyPointRepository);
            const data = yield (0, time_series_utils_1.getDataRangeQuery)(this.timeSeriesRepository, siteId, surveyPointId);
            return (0, time_series_utils_1.groupByMetricAndSource)(data);
        });
    }
    findSiteDataRange(siteDataRangeDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { siteId } = siteDataRangeDto;
            const data = yield (0, time_series_utils_1.getDataRangeQuery)(this.timeSeriesRepository, siteId);
            return (0, time_series_utils_1.groupByMetricAndSource)(data);
        });
    }
    uploadData({ user, sensor, files, multiSiteUpload, surveyPointDataRangeDto, failOnWarning, siteTimezone, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sensor && !Object.values(source_type_enum_1.SourceType).includes(sensor)) {
                throw new common_1.BadRequestException(`Field 'sensor' is required and must have one of the following values: ${Object.values(source_type_enum_1.SourceType).join(', ')}`);
            }
            const { siteId, surveyPointId } = surveyPointDataRangeDto || {};
            if (!(files === null || files === void 0 ? void 0 : files.length)) {
                throw new common_1.BadRequestException('The upload must contain at least one file');
            }
            const uploadResponse = yield bluebird_1.default.Promise.map(files, ({ path, originalname, mimetype }) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const ignoredHeaders = yield (0, upload_sheet_data_1.uploadTimeSeriesData)({
                        user,
                        multiSiteUpload,
                        filePath: path,
                        fileName: originalname,
                        siteId,
                        surveyPointId,
                        sourceType: sensor,
                        repositories: {
                            siteRepository: this.siteRepository,
                            sourcesRepository: this.sourcesRepository,
                            surveyPointRepository: this.surveyPointRepository,
                            timeSeriesRepository: this.timeSeriesRepository,
                            dataUploadsRepository: this.dataUploadsRepository,
                            dataUploadsSitesRepository: this.dataUploadsSitesRepository,
                        },
                        failOnWarning,
                        mimetype: mimetype,
                        siteTimezone,
                    });
                    return { file: originalname, ignoredHeaders, error: null };
                }
                catch (err) {
                    const error = err;
                    return {
                        file: originalname,
                        ignoredHeaders: null,
                        error: error.message,
                    };
                }
                finally {
                    // Remove file once its processing is over
                    (0, fs_1.unlinkSync)(path);
                }
            }), {
                concurrency: 1,
            });
            return uploadResponse;
        });
    }
    getSampleUploadFiles(surveyPointDataRangeDto) {
        const { source } = surveyPointDataRangeDto;
        switch (source) {
            case source_type_enum_1.SourceType.HOBO:
                return (0, fs_1.createReadStream)((0, path_1.join)(process.cwd(), 'src/utils/uploads/hobo_data.csv'));
            case source_type_enum_1.SourceType.METLOG:
                return (0, fs_1.createReadStream)((0, path_1.join)(process.cwd(), 'src/utils/uploads/metlog_data_simple.csv'));
            case source_type_enum_1.SourceType.SONDE:
                return (0, fs_1.createReadStream)((0, path_1.join)(process.cwd(), 'src/utils/uploads/sonde_data_simple.csv'));
            case source_type_enum_1.SourceType.HUI:
                return (0, fs_1.createReadStream)((0, path_1.join)(process.cwd(), 'src/utils/uploads/hui_data.csv'));
            default:
                throw new common_1.NotFoundException(`Example upload file for source ${source} not found`);
        }
    }
};
TimeSeriesService = TimeSeriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(time_series_entity_1.TimeSeries)),
    __param(1, (0, typeorm_1.InjectRepository)(sites_entity_1.Site)),
    __param(2, (0, typeorm_1.InjectRepository)(site_survey_points_entity_1.SiteSurveyPoint)),
    __param(3, (0, typeorm_1.InjectRepository)(sources_entity_1.Sources)),
    __param(4, (0, typeorm_1.InjectRepository)(data_uploads_entity_1.DataUploads)),
    __param(5, (0, typeorm_1.InjectRepository)(data_uploads_sites_entity_1.DataUploadsSites)),
    __param(6, (0, typeorm_1.InjectRepository)(monitoring_entity_1.Monitoring)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TimeSeriesService);
exports.TimeSeriesService = TimeSeriesService;
