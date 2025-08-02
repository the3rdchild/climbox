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
exports.ReturnCSV = void 0;
const path_1 = require("path");
// https://github.com/adaltas/node-csv/issues/372
// eslint-disable-next-line import/no-unresolved
const sync_1 = require("csv-stringify/sync");
const fs_1 = require("fs");
const luxon_1 = require("luxon");
const crypto_1 = require("crypto");
function ReturnCSV({ res, startDate, endDate, getRows, filename, }) {
    return __awaiter(this, void 0, void 0, function* () {
        // Make sure filename contains only valid ascii characters and not " or <
        // for using in 'Content-Disposition' header
        if (!/^(?!.*["<])[\x20-\x7F]*$/.test(filename)) {
            throw new Error('Invalid filename');
        }
        const minDate = luxon_1.DateTime.fromJSDate(startDate).startOf('hour');
        const maxDate = luxon_1.DateTime.fromJSDate(endDate).startOf('hour');
        const monthChunkSize = 6;
        const createChunks = (curr, acc) => {
            if (curr.diff(minDate, 'months').months < monthChunkSize)
                return [...acc, { end: curr.minus({ milliseconds: 1 }), start: minDate }];
            const next = curr.minus({ months: monthChunkSize });
            const item = { end: curr.minus({ milliseconds: 1 }), start: next };
            return createChunks(next, [...acc, item]);
        };
        const chunks = createChunks(maxDate, []);
        const tempFileName = (0, path_1.join)(process.cwd(), (0, crypto_1.randomBytes)(8).toString('hex'));
        const fd = (0, fs_1.openSync)(tempFileName, 'w');
        try {
            // eslint-disable-next-line fp/no-mutation, no-plusplus
            for (let i = 0; i < chunks.length; i++) {
                const first = i === 0;
                // we want this not to run in parallel, that's why it is ok here to disable no-await-in-loop
                // eslint-disable-next-line no-await-in-loop
                const rows = yield getRows(chunks[i].start.toJSDate(), chunks[i].end.toJSDate());
                const csvLines = (0, sync_1.stringify)(rows, { header: first });
                (0, fs_1.writeSync)(fd, csvLines);
            }
            (0, fs_1.closeSync)(fd);
            const readStream = (0, fs_1.createReadStream)(tempFileName);
            res.set({
                'Content-Disposition': `attachment; filename=${filename}`,
            });
            res.set({
                'Access-Control-Expose-Headers': 'Content-Disposition',
            });
            readStream.pipe(res);
            readStream.on('end', () => {
                (0, fs_1.unlinkSync)(tempFileName);
            });
        }
        catch (error) {
            console.error(error);
            (0, fs_1.unlinkSync)(tempFileName);
            res.status(500).send();
        }
    });
}
exports.ReturnCSV = ReturnCSV;
