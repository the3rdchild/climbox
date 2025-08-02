"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCreateSiteBody = exports.ApiUpdateSiteApplicationBody = exports.ApiFileUpload = exports.ApiPointProperty = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_site_application_dto_1 = require("../site-applications/dto/update-site-application.dto");
const update_site_with_application_dto_1 = require("../site-applications/dto/update-site-with-application.dto");
const create_site_dto_1 = require("../sites/dto/create-site.dto");
const api_schemas_1 = require("./api-schemas");
const ApiPointProperty = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiProperty)(api_schemas_1.PointSchema));
};
exports.ApiPointProperty = ApiPointProperty;
const ApiFileUpload = () => {
    const maxFileSizeMB = process.env.STORAGE_MAX_FILE_SIZE_MB
        ? parseInt(process.env.STORAGE_MAX_FILE_SIZE_MB, 10)
        : 1;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    description: `The image to upload (image/jpeg, image/png, image/tiff). Max size: ${maxFileSizeMB}MB`,
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }));
};
exports.ApiFileUpload = ApiFileUpload;
const ApiUpdateSiteApplicationBody = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                site: {
                    $ref: (0, swagger_1.getSchemaPath)(update_site_with_application_dto_1.UpdateSiteWithApplicationDto),
                },
                siteApplication: {
                    $ref: (0, swagger_1.getSchemaPath)(update_site_application_dto_1.UpdateSiteApplicationDto),
                },
            },
        },
    }));
};
exports.ApiUpdateSiteApplicationBody = ApiUpdateSiteApplicationBody;
const ApiCreateSiteBody = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                site: {
                    $ref: (0, swagger_1.getSchemaPath)(create_site_dto_1.CreateSiteDto),
                },
                siteApplication: {
                    $ref: (0, swagger_1.getSchemaPath)(create_site_dto_1.CreateSiteApplicationDto),
                },
            },
        },
    }));
};
exports.ApiCreateSiteBody = ApiCreateSiteBody;
