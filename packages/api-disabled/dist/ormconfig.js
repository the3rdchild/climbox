"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const path_1 = require("path");
const typeorm_1 = require("typeorm");
const constants_1 = require("./src/utils/constants");
// If we have a DATABASE_URL, use that
// If the node_env is set to test then use the TEST_DATABASE_URL instead.
// If no TEST_DATABASE_URL is defined then use the same connection as on development but use database TEST_POSTGRES_DATABASE
const prefix = constants_1.isTestEnv ? 'TEST_' : '';
const databaseUrl = process.env[`${prefix}DATABASE_URL`];
const dataSourceInfo = databaseUrl
    ? { url: databaseUrl }
    : Object.assign(Object.assign({ host: process.env.POSTGRES_HOST || 'localhost', port: (process.env.POSTGRES_PORT &&
            parseInt(process.env.POSTGRES_PORT, 10)) ||
            5432, database: process.env[`${prefix}POSTGRES_DATABASE`] || 'postgres' }, (process.env.POSTGRES_USER && {
        username: process.env.POSTGRES_USER,
    })), (process.env.POSTGRES_PASSWORD && {
        password: process.env.POSTGRES_PASSWORD,
    }));
exports.dataSourceOptions = Object.assign(Object.assign({ type: 'postgres' }, dataSourceInfo), { 
    // We don't want to auto-synchronize production data - we should deliberately run migrations.
    synchronize: false, logging: false, logger: 'advanced-console', namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(), entities: [
        // Needed to get a TS context on entity imports.
        // See
        // https://stackoverflow.com/questions/59435293/typeorm-entity-in-nestjs-cannot-use-import-statement-outside-a-module
        (0, path_1.join)(__dirname, 'src/**', '*.entity.ts'),
        (0, path_1.join)(__dirname, 'src/**', '*.entity.js'),
    ], migrations: [(0, path_1.join)(__dirname, 'migration/**', '*.ts')] });
exports.default = new typeorm_1.DataSource(exports.dataSourceOptions);
