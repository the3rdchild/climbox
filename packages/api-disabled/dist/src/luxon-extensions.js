"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTime = void 0;
const luxon_1 = require("luxon");
Object.defineProperty(exports, "DateTime", { enumerable: true, get: function () { return luxon_1.DateTime; } });
// eslint-disable-next-line fp/no-mutation, func-names
luxon_1.DateTime.prototype.toISOString = function () {
    return this.toJSDate().toISOString();
};
