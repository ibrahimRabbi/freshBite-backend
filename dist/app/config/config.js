"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envData = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.envData = {
    port: process.env.PORT,
    mode: process.env.NODE_ENV,
    secretKey: process.env.SECRET_KEY,
    databaseUrl: process.env.DATABASE_URL,
    email: process.env.EMAIL,
    emailPassword: process.env.EMAIL_PASSWORD
};
