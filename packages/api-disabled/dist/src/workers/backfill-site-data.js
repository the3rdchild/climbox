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
exports.backfillSiteData = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const common_1 = require("@nestjs/common");
const luxon_1 = require("luxon");
const dailyData_1 = require("./dailyData");
const logger = new common_1.Logger('Backfill Worker');
function run(siteId, days, dataSource) {
    return __awaiter(this, void 0, void 0, function* () {
        const backlogArray = Array.from(Array(days).keys());
        const today = luxon_1.DateTime.utc().endOf('day');
        // eslint-disable-next-line fp/no-mutating-methods
        yield bluebird_1.default.mapSeries(backlogArray.reverse(), (past) => __awaiter(this, void 0, void 0, function* () {
            const date = today.set({ day: today.day - past - 1 });
            try {
                yield (0, dailyData_1.getSitesDailyData)(dataSource, date.toJSDate(), [siteId]);
            }
            catch (error) {
                logger.error(error);
            }
        }));
    });
}
const backfillSiteData = ({ dataSource, siteId, days = 90, }) => __awaiter(void 0, void 0, void 0, function* () {
    logger.log(`Starting backfill data for site ${siteId}`);
    yield run(siteId, days, dataSource);
    logger.log(`Finished backfill data for site ${siteId}`);
});
exports.backfillSiteData = backfillSiteData;
