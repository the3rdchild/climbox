"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceAccount = void 0;
try {
    // eslint-disable-next-line import/no-extraneous-dependencies, global-require
    require('dotenv').config();
}
catch (_a) {
    // Pass
}
exports.serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
};
