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
exports.sendSlackMessage = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const logger = new common_1.Logger('SlackUtils');
const sendSlackMessage = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const rsp = yield axios_1.default.post('https://slack.com/api/chat.postMessage', payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const { data } = rsp;
    // Slack returns { ok: false } if an error occurs
    if (!data.ok) {
        logger.error(`Slack responded with a non-ok status. Error: '${data.error}'. Warning: '${data.warning}'.`);
    }
});
exports.sendSlackMessage = sendSlackMessage;
