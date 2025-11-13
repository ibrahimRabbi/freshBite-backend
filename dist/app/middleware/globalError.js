"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config/config");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = (err === null || err === void 0 ? void 0 : err.status) || http_status_1.default.BAD_REQUEST;
    let message = (err === null || err === void 0 ? void 0 : err.message) || 'something went wrong';
    let errorSource = [{
            path: '',
            message: ''
        }];
    if ((err === null || err === void 0 ? void 0 : err.name) === 'ValidationError') {
        const placeErrorSource = Object.values(err === null || err === void 0 ? void 0 : err.errors).map((value) => {
            return {
                path: value === null || value === void 0 ? void 0 : value.path,
                message: value === null || value === void 0 ? void 0 : value.message
            };
        });
        statusCode = http_status_1.default.BAD_REQUEST;
        errorSource = placeErrorSource;
        message = 'validation error';
    }
    // Handle Mongoose Duplicate Key Error
    if (err.name === "MongoServerError" && err.code === 11000) {
        statusCode = http_status_1.default.BAD_REQUEST;
        message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    }
    if (err.name === 'CastError' || err instanceof mongoose_1.default.Error.CastError) {
        errorSource = [
            {
                path: err.path,
                message: `Invalid ID format: ${err.value}`
            }
        ];
        statusCode = http_status_1.default.BAD_REQUEST;
        message = 'Invalid ID format';
    }
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
        errorSource: errorSource,
        stack: config_1.envData.mode === "development" ? err.stack : undefined,
    });
};
exports.globalErrorHandler = globalErrorHandler;
