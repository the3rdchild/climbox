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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const luxon_1 = require("luxon");
const sites_entity_1 = require("../sites/sites.entity");
const surveys_entity_1 = require("../surveys/surveys.entity");
const latest_data_entity_1 = require("../time-series/latest-data.entity");
const typeorm_2 = require("typeorm");
const users_entity_1 = require("../users/users.entity");
const dates_1 = require("../utils/dates");
const site_applications_entity_1 = require("../site-applications/site-applications.entity");
const csv_utils_1 = require("../utils/csv-utils");
const monitoring_entity_1 = require("./monitoring.entity");
function escapeLikeString(raw) {
    return raw.replace(/[\\%_]/g, '\\$&');
}
let MonitoringService = class MonitoringService {
    constructor(monitoringRepository, siteRepository, surveyRepository, latestDataRepository, siteApplicationRepository) {
        this.monitoringRepository = monitoringRepository;
        this.siteRepository = siteRepository;
        this.surveyRepository = surveyRepository;
        this.latestDataRepository = latestDataRepository;
        this.siteApplicationRepository = siteApplicationRepository;
    }
    getMetricsForSites({ siteIds, skipAdminCheck, user, aggregationPeriod, startDate, endDate, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(siteIds.map((querySiteId) => __awaiter(this, void 0, void 0, function* () {
                if (!skipAdminCheck) {
                    // this should never occur
                    if (!user)
                        throw new common_1.InternalServerErrorException('');
                    if (user.adminLevel === users_entity_1.AdminLevel.SiteManager) {
                        const isSiteAdmin = yield this.siteRepository
                            .createQueryBuilder('site')
                            .innerJoin('site.admins', 'admins', 'admins.id = :userId', {
                            userId: user.id,
                        })
                            .andWhere('site.id = :querySiteId', { querySiteId })
                            .getOne();
                        if (!isSiteAdmin)
                            throw new common_1.ForbiddenException();
                    }
                }
                const queryBase = this.monitoringRepository.createQueryBuilder('monitoring');
                const withAggregate = aggregationPeriod
                    ? queryBase.select(`date_trunc('${aggregationPeriod}', monitoring."timestamp")`, 'date')
                    : queryBase.select('monitoring.site_id', 'siteId');
                withAggregate
                    .addSelect('SUM(CASE WHEN user_id IS NULL THEN 1 ELSE 0 END)::int', 'totalRequests')
                    .addSelect('COUNT(monitoring.user_id)::int', 'registeredUserRequests')
                    .addSelect('COUNT(uass.users_id)::int', 'siteAdminRequests')
                    .addSelect(`SUM(CASE WHEN monitoring.metric = 'time_series_request' AND user_id IS NULL THEN 1 ELSE 0 END)::int`, 'timeSeriesRequests')
                    .addSelect(`SUM(CASE WHEN monitoring.metric = 'csv_download' AND user_id IS NULL THEN 1 ELSE 0 END)::int`, 'CSVDownloadRequests')
                    .innerJoin('site', 's', 'monitoring.site_id = s.id')
                    .leftJoin('users_administered_sites_site', 'uass', 'monitoring.site_id = uass.site_id  AND monitoring.user_id = uass.users_id')
                    .andWhere('monitoring.site_id = :querySiteId', {
                    querySiteId,
                });
                const withStartDate = startDate
                    ? withAggregate.andWhere('monitoring."timestamp" >= :startDate', {
                        startDate,
                    })
                    : withAggregate;
                const withEndDate = endDate
                    ? withStartDate.andWhere('monitoring."timestamp" <= :endDate', {
                        endDate,
                    })
                    : withStartDate;
                const groupAndOrderBy = aggregationPeriod
                    ? 'monitoring.site_id, date'
                    : 'monitoring.site_id';
                const [metrics, site] = yield Promise.all([
                    withEndDate
                        .groupBy(groupAndOrderBy)
                        .orderBy(groupAndOrderBy)
                        .getRawMany(),
                    this.siteRepository.findOne({
                        where: { id: querySiteId },
                    }),
                ]);
                // This should never happen since we validate siteIds
                if (!site)
                    throw new common_1.InternalServerErrorException();
                return {
                    siteId: site.id,
                    siteName: site.name,
                    data: metrics,
                };
            })));
        });
    }
    postMonitoringMetric({ metric, siteId }, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.monitoringRepository.save({
                metric,
                user,
                site: { id: siteId },
            });
        });
    }
    getMonitoringStats({ siteIds, spotterId, monthly, start, end, csv }, user, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (siteIds && spotterId) {
                throw new common_1.BadRequestException('Invalid parameters: Only one of siteIds or spotterId can be provided, not both');
            }
            if (!(siteIds === null || siteIds === void 0 ? void 0 : siteIds.length) && !spotterId) {
                throw new common_1.BadRequestException('Invalid parameters: One of siteIds or spotterId must be provided');
            }
            const spotterSite = spotterId
                ? yield this.siteRepository.findOne({
                    where: { sensorId: spotterId },
                })
                : null;
            if (spotterSite === null && spotterId) {
                throw new common_1.BadRequestException('Invalid value for parameter: spotterId');
            }
            const querySiteIds = siteIds || [spotterSite.id];
            if (start && end && start.toISOString() > end.toISOString()) {
                throw new common_1.BadRequestException(`Invalid Dates: start date can't be after end date`);
            }
            const { startDate, endDate } = (0, dates_1.getDefaultDates)(start === null || start === void 0 ? void 0 : start.toISOString(), end === null || end === void 0 ? void 0 : end.toISOString());
            const aggregationPeriod = monthly ? 'month' : 'week';
            if (!csv) {
                res.send(yield this.getMetricsForSites({
                    siteIds: querySiteIds,
                    skipAdminCheck: false,
                    user,
                    aggregationPeriod,
                    startDate,
                    endDate,
                }));
                return;
            }
            const filename = 'site_metrics.csv';
            const getRows = (startDateRows, endDateRows) => __awaiter(this, void 0, void 0, function* () {
                const data = yield this.getMetricsForSites({
                    siteIds: querySiteIds,
                    skipAdminCheck: false,
                    user,
                    aggregationPeriod,
                    startDate: startDateRows,
                    endDate: endDateRows,
                });
                return data
                    .map((x) => {
                    return x.data.map((y) => (Object.assign(Object.assign({ siteId: x.siteId, siteName: x.siteName }, y), { date: y.date && luxon_1.DateTime.fromJSDate(y.date).toISO() })));
                })
                    .flat();
            });
            (0, csv_utils_1.ReturnCSV)({ startDate, endDate, res, filename, getRows });
        });
    }
    getMonitoringLastMonth(getMonitoringLastMonthDto, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { csv } = getMonitoringLastMonthDto;
            const prevMonth = luxon_1.DateTime.now().minus({ month: 1 }).toJSDate();
            const sitesWithSpotter = yield this.siteRepository.find({
                where: { sensorId: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()) },
                select: ['id'],
            });
            if (!csv) {
                res.send(yield this.getMetricsForSites({
                    siteIds: sitesWithSpotter.map((x) => x.id),
                    skipAdminCheck: true,
                    user: undefined,
                    aggregationPeriod: undefined,
                    startDate: prevMonth,
                    endDate: undefined,
                }));
                return;
            }
            const filename = 'monthly_report.csv';
            const getRows = (startDateRows, endDateRows) => __awaiter(this, void 0, void 0, function* () {
                const data = yield this.getMetricsForSites({
                    siteIds: sitesWithSpotter.map((x) => x.id),
                    skipAdminCheck: true,
                    user: undefined,
                    aggregationPeriod: undefined,
                    startDate: startDateRows,
                    endDate: endDateRows,
                });
                return data
                    .map((x) => {
                    if (x.data.length === 0)
                        return { siteId: x.siteId, siteName: x.siteName };
                    return x.data.map((y) => (Object.assign({ siteId: x.siteId, siteName: x.siteName }, y)));
                })
                    .flat();
            });
            (0, csv_utils_1.ReturnCSV)({
                startDate: prevMonth,
                endDate: new Date(),
                res,
                filename,
                getRows,
            });
        });
    }
    surveysReport() {
        return this.surveyRepository
            .createQueryBuilder('survey')
            .select('survey.site_id', 'siteId')
            .addSelect('survey.id', 'surveyId')
            .addSelect('survey.dive_date', 'diveDate')
            .addSelect('survey.updated_at', 'updatedAt')
            .addSelect('s.name', 'siteName')
            .addSelect('u.email', 'userEmail')
            .addSelect('u.full_name', 'userFullName')
            .addSelect('COUNT(sm.id)::int', 'surveyMediaCount')
            .leftJoin('site', 's', 'survey.site_id = s.id')
            .leftJoin('users', 'u', 'survey.user_id = u.id')
            .leftJoin('survey_media', 'sm', 'sm.survey_id = survey.id')
            .groupBy('survey.site_id, survey.id, survey.dive_date, survey.updated_at, s.id, s.name, u.email, u.full_name')
            .getRawMany();
    }
    SitesOverview({ siteId, siteName, spotterId, adminEmail, adminUsername, organization, status, }) {
        const latestDataSubQuery = this.latestDataRepository
            .createQueryBuilder('latest_data')
            .select('DISTINCT ON (latest_data.site_id) latest_data.site_id, latest_data.timestamp')
            .where(`latest_data.source = 'spotter'`)
            .orderBy('latest_data.site_id')
            .addOrderBy('latest_data.timestamp', 'DESC');
        const surveysCountSubQuery = this.surveyRepository
            .createQueryBuilder('survey')
            .select('survey.site_id', 'site_id')
            .addSelect('COUNT(*)', 'count')
            .groupBy('survey.site_id');
        const applicationSubQuery = this.siteApplicationRepository
            .createQueryBuilder('application')
            .select('application.site_id', 'site_id')
            .addSelect('u.full_name', 'full_name')
            .addSelect('u.organization', 'organization')
            .addSelect('u.email', 'email')
            .innerJoin('users', 'u', 'application.user_id = u.id');
        const baseQuery = this.siteRepository
            .createQueryBuilder('site')
            .select('site.id', 'siteId')
            .addSelect('site.name', 'siteName')
            .addSelect('ARRAY_AGG(u.organization) || ARRAY_AGG(application.organization)', 'organizations')
            .addSelect('ARRAY_AGG(u.full_name) || ARRAY_AGG(application.full_name)', 'adminNames')
            .addSelect('ARRAY_AGG(u.email) || ARRAY_AGG(application.email)', 'adminEmails')
            .addSelect('site.status', 'status')
            .addSelect('site.depth', 'depth')
            .addSelect('site.sensor_id', 'spotterId')
            .addSelect('site.video_stream', 'videoStream')
            .addSelect('site.updated_at', 'updatedAt')
            .addSelect('latest_data.timestamp', 'lastDataReceived')
            .addSelect('COALESCE(surveys_count.count, 0)', 'surveysCount')
            .addSelect('site.contact_information', 'contactInformation')
            .addSelect('site.created_at', 'createdAt')
            .leftJoin('users_administered_sites_site', 'uass', 'uass.site_id = site.id')
            .leftJoin('users', 'u', 'uass.users_id = u.id')
            .leftJoin(`(${latestDataSubQuery.getQuery()})`, 'latest_data', 'latest_data.site_id = site.id')
            .leftJoin(`(${surveysCountSubQuery.getQuery()})`, 'surveys_count', 'surveys_count.site_id = site.id')
            .leftJoin(`(${applicationSubQuery.getQuery()})`, 'application', 'application.site_id = site.id');
        const withSiteId = siteId
            ? baseQuery.andWhere('site.id = :siteId', { siteId })
            : baseQuery;
        const withSiteName = siteName
            ? withSiteId.andWhere('site.name ILIKE :siteName', {
                siteName: `%${escapeLikeString(siteName)}%`,
            })
            : withSiteId;
        const withSpotterId = spotterId
            ? withSiteName.andWhere('site.sensor_id = :spotterId', { spotterId })
            : withSiteName;
        const withAdminEmail = adminEmail
            ? withSpotterId.andWhere('u.email ILIKE :adminEmail', {
                adminEmail: `%${escapeLikeString(adminEmail)}%`,
            })
            : withSpotterId;
        const withAdminUserName = adminUsername
            ? withAdminEmail.andWhere('u.full_name ILIKE :adminUsername', {
                adminUsername: `%${escapeLikeString(adminUsername)}%`,
            })
            : withAdminEmail;
        const withOrganization = organization
            ? withAdminUserName.andWhere('u.organization ILIKE :organization', {
                organization: `%${escapeLikeString(organization)}%`,
            })
            : withAdminUserName;
        const withStatus = status
            ? withOrganization.andWhere('site.status = :status', { status })
            : withOrganization;
        const ret = withStatus
            .groupBy('site.id')
            .addGroupBy('site.name')
            .addGroupBy('site.status')
            .addGroupBy('site.depth')
            .addGroupBy('site.sensor_id')
            .addGroupBy('site.video_stream')
            .addGroupBy('site.updated_at')
            .addGroupBy('latest_data.timestamp')
            .addGroupBy('surveys_count.count')
            .addGroupBy('site.contact_information');
        return ret.getRawMany();
    }
    getSitesStatus() {
        return this.siteRepository
            .createQueryBuilder('site')
            .select('COUNT(*)', 'totalSites')
            .addSelect("COUNT(*) FILTER (WHERE site.status = 'deployed')", 'deployed')
            .addSelect('COUNT(*) FILTER (WHERE site.display)', 'displayed')
            .addSelect("COUNT(*) FILTER (WHERE site.status = 'maintenance')", 'maintenance')
            .addSelect("COUNT(*) FILTER (WHERE site.status = 'shipped')", 'shipped')
            .addSelect("COUNT(*) FILTER (WHERE site.status = 'end_of_life')", 'endOfLife')
            .addSelect("COUNT(*) FILTER (WHERE site.status = 'lost')", 'lost')
            .getRawOne();
    }
};
MonitoringService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(monitoring_entity_1.Monitoring)),
    __param(1, (0, typeorm_1.InjectRepository)(sites_entity_1.Site)),
    __param(2, (0, typeorm_1.InjectRepository)(surveys_entity_1.Survey)),
    __param(3, (0, typeorm_1.InjectRepository)(latest_data_entity_1.LatestData)),
    __param(4, (0, typeorm_1.InjectRepository)(site_applications_entity_1.SiteApplication)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MonitoringService);
exports.MonitoringService = MonitoringService;
