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
exports.verifyOtpController = exports.forgetPasswordController = exports.signInController = void 0;
const catchAsync_1 = require("../../helper/catchAsync");
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("./auth.service");
exports.signInController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const signin = yield (0, auth_service_1.signInService)(req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: "sign in successfully",
        token: signin
    });
}));
exports.forgetPasswordController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationToken = yield (0, auth_service_1.forgetPasswordService)(req);
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: "we have sent email verification code to your email",
        verificationToken
    });
}));
exports.verifyOtpController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyOtp = yield (0, auth_service_1.verifyOtpServices)(req);
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: "otp verified successfully",
    });
}));
