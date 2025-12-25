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
exports.getMyProfileController = exports.changePasswordController = exports.updateProfileController = exports.resetPasswordController = exports.verifyOtpController = exports.forgetPasswordController = exports.signInController = void 0;
const catchAsync_1 = require("../../helper/catchAsync");
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("./auth.service");
const user_model_1 = __importDefault(require("../user/user.model"));
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
exports.resetPasswordController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const resetPassword = yield user_model_1.default.findByIdAndUpdate((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.userId, { password: (_b = req.body) === null || _b === void 0 ? void 0 : _b.newPassword }, { new: true, runValidators: true, context: 'query' });
    if (!resetPassword) {
        throw new Error('faild to update password');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: "profile has been updated",
        data: resetPassword
    });
}));
exports.updateProfileController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const updating = yield (0, auth_service_1.updateUserServices)(req);
    if (!updating) {
        throw new Error('faild to update profile');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: "profile has been updated",
        data: updating
    });
}));
exports.changePasswordController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const findUser = yield user_model_1.default.findById((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id).select('password');
    if (!findUser) {
        throw new Error('something went erong');
    }
    if ((findUser === null || findUser === void 0 ? void 0 : findUser.password) !== ((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.currentPassword)) {
        throw new Error('invalid current password');
    }
    const updatePassword = yield user_model_1.default.findByIdAndUpdate(findUser === null || findUser === void 0 ? void 0 : findUser._id, { password: (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.newPassword }, { new: true, runValidators: true, context: 'query' });
    if (!updatePassword) {
        throw new Error('faild to update password');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'password has been changed',
        data: updatePassword
    });
}));
exports.getMyProfileController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'profile retrived successfully',
        data: req.user
    });
}));
