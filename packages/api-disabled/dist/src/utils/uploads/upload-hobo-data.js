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
exports.uploadHoboData = exports.performBackfill = exports.parseCSV = void 0;
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bluebird_1 = __importDefault(require("bluebird"));
const ts_exif_parser_1 = require("ts-exif-parser");
const sync_1 = __importDefault(require("csv-parse/lib/sync"));
const luxon_extensions_1 = require("../../luxon-extensions");
const sites_entity_1 = require("../../sites/sites.entity");
const surveys_entity_1 = require("../../surveys/surveys.entity");
const survey_media_entity_1 = require("../../surveys/survey-media.entity");
const backfill_site_data_1 = require("../../workers/backfill-site-data");
const site_utils_1 = require("../site.utils");
const temperature_1 = require("../temperature");
const coordinates_1 = require("../coordinates");
const source_type_enum_1 = require("../../sites/schemas/source-type.enum");
const time_series_utils_1 = require("../time-series.utils");
const metrics_enum_1 = require("../../time-series/metrics.enum");
/**
 * Parse csv data
 * @param filePath The path to the csv file
 * @param header The headers to be used. If undefined the column will be ignored
 * @param range The amount or rows to skip
 */
const parseCSV = (filePath, header, castFunction, range = 2) => {
    // Read csv file
    const csv = fs_1.default.readFileSync(filePath);
    // Parse csv and transform it to T
    return (0, sync_1.default)(csv, {
        cast: castFunction,
        columns: header,
        fromLine: range,
    });
};
exports.parseCSV = parseCSV;
const FOLDER_PREFIX = 'Patch_Site_';
const SITE_PREFIX = 'Patch Site ';
const COLONY_COORDS_FILE = 'Colony_Coords.csv';
const COLONY_FOLDER_PREFIX = 'Col_';
const COLONY_PREFIX = 'Colony ';
const COLONY_DATA_FILE = 'Col{}_FullHOBO_zoned.csv';
const validFiles = new Set(['png', 'jpeg', 'jpg']);
const logger = new common_1.Logger('ParseHoboData');
const siteQuery = (siteRepository, polygon) => {
    return siteRepository
        .createQueryBuilder(`entity`)
        .where(`entity.polygon = ST_SetSRID(ST_GeomFromGeoJSON(:polygon), 4326)::geometry`, { polygon })
        .getOne();
};
const poiQuery = (poiRepository, polygon) => {
    return poiRepository
        .createQueryBuilder(`surveyPoints`)
        .innerJoinAndSelect('surveyPoints.site', 'site')
        .where(`surveyPoints.polygon = ST_SetSRID(ST_GeomFromGeoJSON(:polygon), 4326)::geometry`, { polygon })
        .getOne();
};
const castCsvValues = (integerColumns, floatColumns, dateColumns) => (value, context) => {
    if (!context.column) {
        return value;
    }
    if (integerColumns.includes(context.column.toString())) {
        return parseInt(value, 10);
    }
    if (floatColumns.includes(context.column.toString())) {
        return parseFloat(value);
    }
    if (dateColumns.includes(context.column.toString())) {
        return new Date(value);
    }
    return value;
};
/**
 * Handle entity duplication because of spatial key constraint
 * @param repository The repository for the entity
 * @param polygon The polygon value
 */
const handleEntityDuplicate = (repository, query, polygon) => {
    return (err) => {
        // Catch unique violation, i.e. there is already a site at this location
        if (err.code === '23505') {
            return query(repository, polygon).then((found) => {
                if (!found) {
                    throw new common_1.InternalServerErrorException('Could not fetch conflicting entry');
                }
                return found;
            });
        }
        throw err;
    };
};
/**
 * Read Coords.csv file
 * @param rootPath The path of the root of the data folder
 * @param siteIds The siteIds to be imported
 */
const readCoordsFile = (rootPath, siteIds) => {
    // Read coords file
    const coordsFilePath = path_1.default.join(rootPath, COLONY_COORDS_FILE);
    const coordsHeaders = ['site', 'colony', 'lat', 'long'];
    const castFunction = castCsvValues(['site', 'colony'], ['lat', 'long'], []);
    return (0, exports.parseCSV)(coordsFilePath, coordsHeaders, castFunction).filter((record) => {
        return siteIds.includes(record.site);
    });
};
/**
 * Create site records
 * Calculate their position by finding the average of the coordinates of all surveyPoints in csv file
 * @param dataAsJson The json data from the csv file
 * @param siteIds The sites to be imported
 * @param regionRepository The region repository
 */
const getSiteRecords = (dataAsJson, siteIds, regionRepository) => __awaiter(void 0, void 0, void 0, function* () {
    // Group by site
    const recordsGroupedBySite = (0, lodash_1.groupBy)(dataAsJson, 'site');
    // Extract site entities and calculate position of site by averaging all each surveyPoints positions
    const sites = yield Promise.all(siteIds.map((siteId) => {
        // Filter out NaN values
        const filteredSiteCoords = recordsGroupedBySite[siteId].filter((record) => !(0, lodash_1.isNaN)(record.lat) && !(0, lodash_1.isNaN)(record.long));
        const siteRecord = filteredSiteCoords.reduce((previous, record) => {
            return Object.assign(Object.assign({}, previous), { lat: previous.lat + record.lat, long: previous.long + record.long });
        }, { site: siteId, colony: 0, lat: 0, long: 0 });
        // Calculate site position
        const point = (0, coordinates_1.createPoint)(siteRecord.long / filteredSiteCoords.length, siteRecord.lat / filteredSiteCoords.length);
        // Augment site information
        const [longitude, latitude] = point.coordinates;
        const timezones = (0, site_utils_1.getTimezones)(latitude, longitude);
        return Promise.all([
            (0, site_utils_1.getRegion)(longitude, latitude, regionRepository),
            (0, temperature_1.getMMM)(longitude, latitude),
        ]).then(([region, maxMonthlyMean]) => ({
            name: SITE_PREFIX + siteId,
            polygon: point,
            region,
            maxMonthlyMean,
            display: false,
            timezone: timezones[0],
            status: sites_entity_1.SiteStatus.Approved,
        }));
    }));
    return { recordsGroupedBySite, sites };
});
/**
 * Save site records to database or fetch already existing sites
 * @param sites The site records to be saved
 * @param user The user to associate site with
 * @param siteRepository The site repository
 * @param userRepository The user repository
 * @param historicalMonthlyMeanRepository The monthly max repository
 */
const createSites = (sites, user, siteRepository, userRepository, historicalMonthlyMeanRepository) => __awaiter(void 0, void 0, void 0, function* () {
    logger.log('Saving sites');
    const siteEntities = yield Promise.all(sites.map((site) => siteRepository
        .save(site)
        .catch(handleEntityDuplicate(siteRepository, siteQuery, site.polygon))));
    logger.log(`Saving monthly max data`);
    yield bluebird_1.default.map(siteEntities, (site) => {
        const point = site.polygon;
        const [longitude, latitude] = point.coordinates;
        return Promise.all([
            (0, temperature_1.getHistoricalMonthlyMeans)(longitude, latitude),
            historicalMonthlyMeanRepository.findOne({
                where: { site: { id: site.id } },
            }),
        ]).then(([historicalMonthlyMean, found]) => {
            if (found || !historicalMonthlyMean) {
                logger.warn(`Site ${site.id} has already monthly max data`);
                return null;
            }
            return historicalMonthlyMean.map(({ month, temperature }) => {
                return (temperature &&
                    historicalMonthlyMeanRepository.save({ site, month, temperature }));
            });
        });
    }, { concurrency: 4 });
    // Create reverse map (db.site.id => csv.site_id)
    const dbIdToCSVId = Object.fromEntries(siteEntities.map((site) => {
        if (!site.name) {
            throw new common_1.InternalServerErrorException('Site name was not defined');
        }
        const siteId = parseInt(site.name.replace(SITE_PREFIX, ''), 10);
        return [site.id, siteId];
    }));
    // Update administered sites relationship
    yield userRepository.save({
        id: user.id,
        administeredSites: user.administeredSites.concat(siteEntities),
    });
    return { siteEntities, dbIdToCSVId };
});
/**
 * Create and save site point of interest records
 * @param siteEntities The saved site entities
 * @param dbIdToCSVId The reverse map (db.site.id => csv.site_id)
 * @param recordsGroupedBySite The site records grouped by site id
 * @param rootPath The path to the root of the data folder
 * @param poiRepository The poi repository
 */
const createSurveyPoints = (siteEntities, dbIdToCSVId, recordsGroupedBySite, rootPath, poiRepository) => __awaiter(void 0, void 0, void 0, function* () {
    // Create site points of interest entities for each imported site
    // Final result needs to be flattened since the resulting array is grouped by site
    const surveyPoints = siteEntities
        .map((site) => {
        const currentSiteId = dbIdToCSVId[site.id];
        const siteFolder = FOLDER_PREFIX + currentSiteId;
        return recordsGroupedBySite[currentSiteId]
            .filter((record) => {
            const colonyId = record.colony.toString().padStart(3, '0');
            const colonyFolder = COLONY_FOLDER_PREFIX + colonyId;
            const colonyFolderPath = path_1.default.join(rootPath, siteFolder, colonyFolder);
            return fs_1.default.existsSync(colonyFolderPath);
        })
            .map((record) => {
            const point = !(0, lodash_1.isNaN)(record.long) && !(0, lodash_1.isNaN)(record.lat)
                ? (0, coordinates_1.createPoint)(record.long, record.lat)
                : undefined;
            return {
                name: COLONY_PREFIX + record.colony,
                site,
                polygon: point,
            };
        });
    })
        .flat();
    logger.log('Saving site points of interest');
    const poiEntities = yield Promise.all(surveyPoints.map((poi) => poiRepository
        .save(poi)
        .catch(handleEntityDuplicate(poiRepository, poiQuery, poi.polygon))));
    return poiEntities;
});
/**
 * Create source entities
 * @param poiEntities The created poi entities
 * @param sourcesRepository The sources repository
 */
const createSources = (poiEntities, sourcesRepository) => __awaiter(void 0, void 0, void 0, function* () {
    // Create sources for each new poi
    const sources = poiEntities.map((poi) => {
        return {
            site: poi.site,
            poi,
            type: source_type_enum_1.SourceType.HOBO,
        };
    });
    logger.log('Saving sources');
    const sourceEntities = yield Promise.all(sources.map((source) => sourcesRepository
        .findOne({
        relations: ['surveyPoint', 'site'],
        where: {
            site: { id: source.site.id },
            surveyPoint: { id: source.poi.id },
            type: source.type,
        },
    })
        .then((foundSource) => {
        if (foundSource) {
            return foundSource;
        }
        return sourcesRepository.save(source);
    })));
    // Map surveyPoints to created sources. Hobo sources have a specified poi.
    return (0, lodash_1.keyBy)(sourceEntities, (o) => o.surveyPoint.id);
});
/**
 * Parse hobo csv
 * @param poiEntities The created poi entities
 * @param dbIdToCSVId The reverse map (db.site.id => csv.site_id)
 * @param rootPath The path to the root of the data folder
 * @param poiToSourceMap A object to map surveyPoints to source entities
 * @param timeSeriesRepository The time series repository
 */
const parseHoboData = (poiEntities, dbIdToCSVId, rootPath, poiToSourceMap, timeSeriesRepository) => __awaiter(void 0, void 0, void 0, function* () {
    // Parse hobo data
    const parsedData = poiEntities.map((poi) => {
        const colonyId = poi.name.split(' ')[1].padStart(3, '0');
        const dataFile = COLONY_DATA_FILE.replace('{}', colonyId);
        const colonyFolder = COLONY_FOLDER_PREFIX + colonyId;
        const siteFolder = FOLDER_PREFIX + dbIdToCSVId[poi.site.id];
        const filePath = path_1.default.join(rootPath, siteFolder, colonyFolder, dataFile);
        const headers = [undefined, 'id', 'dateTime', 'bottomTemperature'];
        const castFunction = castCsvValues(['id'], ['bottomTemperature'], ['dateTime']);
        return (0, exports.parseCSV)(filePath, headers, castFunction).map((data) => ({
            timestamp: data.dateTime,
            value: data.bottomTemperature,
            source: poiToSourceMap[poi.id],
            metric: metrics_enum_1.Metric.BOTTOM_TEMPERATURE,
        }));
    });
    // Find the earliest date of data
    const startDates = parsedData.reduce((acc, data) => {
        const minimum = (0, lodash_1.minBy)(data, (o) => o.timestamp);
        if (!minimum) {
            return acc;
        }
        return acc.concat(minimum);
    }, []);
    const groupedStartedDates = (0, lodash_1.keyBy)(startDates, (o) => o.source.site.id);
    // Start a backfill for each site
    const siteDiffDays = Object.keys(groupedStartedDates).map((siteId) => {
        const startDate = groupedStartedDates[siteId];
        if (!startDate) {
            return [parseInt(siteId, 10), 0];
        }
        const start = luxon_extensions_1.DateTime.fromJSDate(startDate.timestamp);
        const end = luxon_extensions_1.DateTime.now();
        const diff = Math.min(end.diff(start, 'days').days, 200);
        return [startDate.source.site.id, diff];
    });
    const bottomTemperatureData = parsedData.flat();
    // Data are to much to added with one bulk insert
    // So we need to break them in batches
    const batchSize = 1000;
    logger.log(`Saving time series data in batches of ${batchSize}`);
    const inserts = (0, lodash_1.chunk)(bottomTemperatureData, batchSize).map((batch) => {
        return timeSeriesRepository
            .createQueryBuilder('time_series')
            .insert()
            .values(batch)
            .onConflict('ON CONSTRAINT "no_duplicate_data" DO NOTHING')
            .execute();
    });
    // Return insert promises and print progress updates
    const actionsLength = inserts.length;
    yield bluebird_1.default.Promise.each(inserts, (props, idx) => {
        logger.log(`Saved ${idx + 1} out of ${actionsLength} batches`);
    });
    return siteDiffDays;
});
/**
 * Upload site photos and create for each image a new survey and an associated survey media
 * As diveDate the creation date of the image will be used
 * @param poiEntities The create poi entities
 * @param dbIdToCSVId The reverse map (db.site.id => csv.site_id)
 * @param rootPath The path to the root of the data folder
 * @param googleCloudService The google cloud service instance
 * @param user A user to associate the surveys with
 * @param surveyRepository The survey repository
 * @param surveyMediaRepository The survey media repository
 */
const uploadSitePhotos = (poiEntities, dbIdToCSVId, rootPath, googleCloudService, user, surveyRepository, surveyMediaRepository) => __awaiter(void 0, void 0, void 0, function* () {
    // Find and images and extract their metadata
    const imageData = poiEntities
        .map((poi) => {
        const colonyId = poi.name.split(' ')[1].padStart(3, '0');
        const colonyFolder = COLONY_FOLDER_PREFIX + colonyId;
        const siteFolder = FOLDER_PREFIX + dbIdToCSVId[poi.site.id];
        const colonyFolderPath = path_1.default.join(rootPath, siteFolder, colonyFolder);
        const contents = fs_1.default.readdirSync(colonyFolderPath);
        const images = contents.filter((f) => {
            const ext = path_1.default.extname(f).toLowerCase().replace('.', '');
            return validFiles.has(ext);
        });
        return images.map((image) => {
            const data = ts_exif_parser_1.ExifParserFactory.create(fs_1.default.readFileSync(path_1.default.join(colonyFolderPath, image))).parse();
            const createdDate = data.tags && data.tags.CreateDate
                ? luxon_extensions_1.DateTime.fromSeconds(data.tags.CreateDate).toJSDate()
                : luxon_extensions_1.DateTime.now().toJSDate();
            return {
                imagePath: path_1.default.join(colonyFolderPath, image),
                site: poi.site,
                poi,
                createdDate,
            };
        });
    })
        .flat();
    logger.log('Upload photos to google cloud');
    const imageLength = imageData.length;
    const surveyMedia = yield bluebird_1.default.each(imageData.map((image) => googleCloudService
        .uploadFileSync(image.imagePath, 'image')
        .then((url) => {
        const survey = {
            site: image.site,
            user,
            diveDate: image.createdDate,
            weatherConditions: surveys_entity_1.WeatherConditions.NoData,
        };
        return surveyRepository.save(survey).then((surveyEntity) => {
            return {
                url,
                featured: true,
                hidden: false,
                type: survey_media_entity_1.MediaType.Image,
                surveyPoint: image.poi,
                surveyId: surveyEntity,
                metadata: JSON.stringify({}),
                observations: survey_media_entity_1.Observations.NoData,
            };
        });
    })), (data, idx) => {
        logger.log(`${idx + 1} images uploaded out of ${imageLength}`);
        return data;
    });
    logger.log('Saving survey media');
    yield surveyMediaRepository.save(surveyMedia);
});
const performBackfill = (siteDiffDays, dataSource) => {
    siteDiffDays.forEach(([siteId, diff]) => {
        logger.log(`Performing backfill for site ${siteId} for ${diff} days`);
        (0, backfill_site_data_1.backfillSiteData)({
            siteId,
            days: diff,
            dataSource,
        });
    });
};
exports.performBackfill = performBackfill;
// Upload hobo data
// Returns a object with keys the db site ids and values the corresponding imported site ids
const uploadHoboData = (rootPath, email, googleCloudService, repositories, dataSource) => __awaiter(void 0, void 0, void 0, function* () {
    // Grab user and check if they exist
    const user = yield repositories.userRepository.findOne({
        where: { email: email.toLowerCase() },
        relations: ['administeredSites'],
    });
    if (!user) {
        logger.error(`No user was found with email ${email}`);
        throw new common_1.BadRequestException('User was not found');
    }
    const siteSet = fs_1.default
        .readdirSync(rootPath)
        .filter((f) => {
        // File must be directory and be in Patch_Site_{site_id} format
        return (fs_1.default.statSync(path_1.default.join(rootPath, f)).isDirectory() &&
            f.includes(FOLDER_PREFIX));
    })
        .map((siteFolder) => {
        return parseInt(siteFolder.replace(FOLDER_PREFIX, ''), 10);
    });
    const dataAsJson = readCoordsFile(rootPath, siteSet);
    const { recordsGroupedBySite, sites } = yield getSiteRecords(dataAsJson, siteSet, repositories.regionRepository);
    const { siteEntities, dbIdToCSVId } = yield createSites(sites, user, repositories.siteRepository, repositories.userRepository, repositories.historicalMonthlyMeanRepository);
    const poiEntities = yield createSurveyPoints(siteEntities, dbIdToCSVId, recordsGroupedBySite, rootPath, repositories.surveyPointRepository);
    const poiToSourceMap = yield createSources(poiEntities, repositories.sourcesRepository);
    const surveyPointsGroupedBySite = (0, lodash_1.groupBy)(poiEntities, (poi) => poi.site.id);
    const siteDiffArray = yield bluebird_1.default.map(Object.values(surveyPointsGroupedBySite), (surveyPoints) => parseHoboData(surveyPoints, dbIdToCSVId, rootPath, poiToSourceMap, repositories.timeSeriesRepository), { concurrency: 1 });
    yield bluebird_1.default.map(Object.values(surveyPointsGroupedBySite), (surveyPoints) => uploadSitePhotos(surveyPoints, dbIdToCSVId, rootPath, googleCloudService, user, repositories.surveyRepository, repositories.surveyMediaRepository), { concurrency: 1 });
    (0, exports.performBackfill)(siteDiffArray.flat(), dataSource);
    // Update materialized view
    (0, time_series_utils_1.refreshMaterializedView)(repositories.dataUploadsRepository);
    return dbIdToCSVId;
});
exports.uploadHoboData = uploadHoboData;
