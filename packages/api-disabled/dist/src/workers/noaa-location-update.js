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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOAALocationUpdate = void 0;
const typeorm_1 = require("typeorm");
const scheduled_updates_entity_1 = require("../sites/scheduled-updates.entity");
const sites_entity_1 = require("../sites/sites.entity");
const noaa_availability_utils_1 = require("../utils/noaa-availability-utils");
function NOAALocationUpdate(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        const scheduledUpdateRepository = connection.getRepository(scheduled_updates_entity_1.ScheduledUpdate);
        const siteRepository = connection.getRepository(sites_entity_1.Site);
        const updates = yield scheduledUpdateRepository.find({ relations: ['site'] });
        if (updates.length === 0)
            return;
        const availability = (0, noaa_availability_utils_1.getAvailabilityMapFromFile)();
        yield (0, noaa_availability_utils_1.updateNOAALocations)(updates.map((x) => x.site), availability, siteRepository);
        yield scheduledUpdateRepository.delete({ id: (0, typeorm_1.In)(updates.map((x) => x.id)) });
    });
}
exports.NOAALocationUpdate = NOAALocationUpdate;
