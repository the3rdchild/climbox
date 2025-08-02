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
exports.updateNOAALocations = exports.updateNOAALocation = exports.getAvailabilityMapFromFile = exports.createAndSaveCompactFile = void 0;
/* eslint-disable react/destructuring-assignment */
/* eslint-disable fp/no-mutating-methods */
/* eslint-disable no-plusplus */
/* eslint-disable fp/no-mutation */
const common_1 = require("@nestjs/common");
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const coordinates_1 = require("./coordinates");
const AVAILABILITY_FILE = (0, path_1.join)(__dirname, '../../assets/noaa-availability');
const MAX_SEARCH_DEPTH = 1000; // This will give us around 120km of range between the site and the nearest point
function createAndSaveCompactFile(worldMap) {
    common_1.Logger.log('Creating word map binary file...');
    const buffer = []; // this will have 7200 * 3200 / 8 entries
    const chunkSize = 8; // bytes
    for (let i = 0; i < 7200; i++) {
        for (let j = 0; j < 3600; j += chunkSize) {
            const chunk = worldMap[i].slice(j, j + chunkSize);
            const byte = parseInt(chunk
                .map((x) => Boolean(x))
                .map((x) => Number(x))
                .join(''), 2);
            buffer.push(byte);
        }
    }
    fs_1.default.writeFileSync(AVAILABILITY_FILE, new Uint8Array(buffer));
}
exports.createAndSaveCompactFile = createAndSaveCompactFile;
function getAvailabilityMapFromFile() {
    common_1.Logger.log('Getting world mask from local file...');
    const file = fs_1.default.readFileSync(AVAILABILITY_FILE, { flag: 'r' });
    const worldMap = [];
    let i = 0;
    let j = 0;
    const bytes = Array.from(file);
    bytes.forEach((byte) => {
        if (j === 0)
            worldMap[i] = [];
        worldMap[i].push(...Array.from(`00000000${byte.toString(2)}`.slice(-8)).map((x) => Number(x)));
        i += Math.floor((j + 1) / (3600 / 8));
        j = (j + 1) % (3600 / 8);
    });
    return worldMap;
}
exports.getAvailabilityMapFromFile = getAvailabilityMapFromFile;
function BFS(visited, stack, worldMap, count = 0) {
    if (count > MAX_SEARCH_DEPTH) {
        throw new Error('Maximum search depth exceeded');
    }
    const head = stack.shift();
    if (!head)
        return null;
    if (visited.has(`${head.lon},${head.lat}`))
        return BFS(visited, stack, worldMap, count);
    if (Boolean(worldMap[head.lon][head.lat]) === false)
        return [head.lon, head.lat];
    visited.set(`${head.lon},${head.lat}`, true);
    const up = { lon: (head.lon + 1) % 7200, lat: head.lat };
    const down = { lon: (head.lon + 1) % 7200, lat: head.lat };
    const right = { lon: head.lon, lat: (head.lat + 1) % 3200 };
    const left = { lon: head.lon, lat: (head.lat - 1) % 3200 };
    if (!visited.has(`${up.lon},${up.lat}`))
        stack.push(up);
    if (!visited.has(`${down.lon},${down.lat}`))
        stack.push(down);
    if (!visited.has(`${right.lon},${right.lat}`))
        stack.push(right);
    if (!visited.has(`${left.lon},${left.lat}`))
        stack.push(left);
    return BFS(visited, stack, worldMap, count + 1);
}
function getNearestAvailablePoint(longitude, latitude, worldMap) {
    return __awaiter(this, void 0, void 0, function* () {
        const lonIndex = Math.round((180 + longitude) / 0.05);
        const latIndex = Math.round((90 + latitude) / 0.05);
        const visited = new Map();
        const stack = [{ lon: lonIndex, lat: latIndex }];
        const result = BFS(visited, stack, worldMap);
        if (result === null)
            throw new Error('Did not find nearest point!');
        return [
            Number((result[0] * 0.05 - 180).toFixed(3)),
            Number((result[1] * 0.05 - 90).toFixed(3)),
        ];
    });
}
function updateNOAALocation(site, worldMap, siteRepository) {
    return __awaiter(this, void 0, void 0, function* () {
        const { polygon, id } = site;
        const [longitude, latitude] = polygon.coordinates;
        try {
            const [NOAALongitude, NOAALatitude] = yield getNearestAvailablePoint(longitude, latitude, worldMap);
            yield siteRepository.save({
                id,
                nearestNOAALocation: (0, coordinates_1.createPoint)(NOAALongitude, NOAALatitude),
            });
            common_1.Logger.log(`Updated site ${id} (${longitude}, ${latitude}) -> (${NOAALongitude}, ${NOAALatitude}) `);
            return null;
        }
        catch (error) {
            const failedSite = { id, longitude, latitude, error: error.message };
            common_1.Logger.warn(`Could not get nearest point for site id: ${site.id}, (lon, lat): (${longitude}, ${latitude})`);
            return failedSite;
        }
    });
}
exports.updateNOAALocation = updateNOAALocation;
function updateNOAALocations(sites, worldMap, siteRepository) {
    return __awaiter(this, void 0, void 0, function* () {
        common_1.Logger.log(`Updating ${sites.length} sites...`);
        const failedSites = (yield Promise.all(sites.map((site) => updateNOAALocation(site, worldMap, siteRepository)))).filter((site) => site !== null);
        if (failedSites.length > 0) {
            common_1.Logger.warn(`Failed to process ${failedSites.length} sites:`);
            failedSites.forEach((site) => {
                if (!site)
                    return;
                common_1.Logger.warn(`- Site ${site.id}: (${site.longitude}, ${site.latitude}) - ${site.error}`);
            });
            common_1.Logger.warn(`Failed to process ${failedSites.map((x) => x === null || x === void 0 ? void 0 : x.id).join(', ')}`);
        }
        return failedSites;
    });
}
exports.updateNOAALocations = updateNOAALocations;
