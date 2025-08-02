"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configService = void 0;
const swagger_1 = require("@nestjs/swagger");
const ormconfig_1 = require("../../ormconfig");
const update_site_application_dto_1 = require("../site-applications/dto/update-site-application.dto");
const update_site_with_application_dto_1 = require("../site-applications/dto/update-site-with-application.dto");
const create_site_dto_1 = require("../sites/dto/create-site.dto");
const sites_entity_1 = require("../sites/sites.entity");
const time_series_point_dto_1 = require("../time-series/dto/time-series-point.dto");
// dotenv is a dev dependency, so conditionally import it (don't need it in Prod).
try {
    // eslint-disable-next-line import/no-extraneous-dependencies, global-require
    require('dotenv').config();
}
catch (_a) {
    // Pass
}
class ConfigService {
    constructor(env) {
        this.env = env;
        this.API_URL = this.getValue('BACKEND_BASE_URL', true);
    }
    getValue(key, throwOnMissing = true) {
        const value = this.env[key];
        if (!value) {
            if (throwOnMissing) {
                throw new Error(`config error - missing env.${key}`);
            }
            else {
                return '';
            }
        }
        return value;
    }
    ensureValues(keys) {
        keys.forEach((k) => this.getValue(k, true));
        return this;
    }
    getPort() {
        return this.getValue('PORT', true);
    }
    isProduction() {
        const mode = this.getValue('NODE_ENV', false);
        return mode !== 'development';
    }
    // eslint-disable-next-line class-methods-use-this
    getTypeOrmConfig() {
        return Object.assign({}, ormconfig_1.dataSourceOptions);
    }
    // eslint-disable-next-line class-methods-use-this
    getSwaggerConfig() {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Aqualink API documentation')
            .setDescription('The Aqualink public API documentation')
            .addServer(this.API_URL)
            .addBearerAuth()
            .build();
        const documentOptions = {
            extraModels: [
                update_site_with_application_dto_1.UpdateSiteWithApplicationDto,
                update_site_application_dto_1.UpdateSiteApplicationDto,
                create_site_dto_1.CreateSiteDto,
                create_site_dto_1.CreateSiteApplicationDto,
                sites_entity_1.Site,
                time_series_point_dto_1.TimeSeriesPoint,
            ],
        };
        // Disable 'try it out' option as it will only add extra workload to the server
        // Reference: https://github.com/swagger-api/swagger-ui/issues/3725
        const customOptions = {
            swaggerOptions: {
                plugins: {
                    statePlugins: {
                        spec: { wrapSelectors: { allowTryItOutFor: () => () => false } },
                    },
                },
            },
        };
        return { config, documentOptions, customOptions };
    }
}
const configService = new ConfigService(process.env);
exports.configService = configService;
