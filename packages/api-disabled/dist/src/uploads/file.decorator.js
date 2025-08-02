"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignName = exports.getRandomName = void 0;
const path = __importStar(require("path"));
const lodash_1 = require("lodash");
const mimetypes_1 = require("./mimetypes");
const getRandomName = (folder, prefix, file, type) => {
    const extension = path.extname(file);
    const randomString = (0, lodash_1.times)(16, () => (0, lodash_1.random)(15).toString(16)).join('');
    const fullname = `${prefix}-${type}-${randomString}${extension}`;
    return path.join(folder, fullname);
};
exports.getRandomName = getRandomName;
function assignName(folder, prefix) {
    return (req, file, callback) => {
        const type = (0, mimetypes_1.validateMimetype)(file.mimetype);
        const relativePath = (0, exports.getRandomName)(folder, prefix, file.originalname, type);
        return callback(null, relativePath);
    };
}
exports.assignName = assignName;
