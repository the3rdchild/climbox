"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMimetype = exports.mimetypes = void 0;
exports.mimetypes = {
    image: ['image/jpeg', 'image/png', 'image/tiff'],
    video: ['video/x-msvideo', 'video/mpeg'],
};
function validateMimetype(mimetype) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(exports.mimetypes)) {
        const belongs = value.findIndex((m) => m === mimetype) !== -1;
        if (belongs) {
            return key;
        }
    }
    return undefined;
}
exports.validateMimetype = validateMimetype;
