"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileFilter = void 0;
const common_1 = require("@nestjs/common");
const mimetypes_1 = require("./mimetypes");
function fileFilter(validTypes) {
    return (req, file, callback) => {
        const type = (0, mimetypes_1.validateMimetype)(file.mimetype);
        const isValid = validTypes.findIndex((t) => t === type) !== -1;
        if (!isValid) {
            return callback(new common_1.BadRequestException(`Invalid file type ${file.mimetype}.`), false);
        }
        return callback(null, true);
    };
}
exports.fileFilter = fileFilter;
