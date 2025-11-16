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
exports.deleteUserController = exports.getAllUserController = exports.getSingleUserController = exports.createUserController = void 0;
const user_services_1 = require("./user.services");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../helper/catchAsync");
const user_model_1 = __importDefault(require("./user.model"));
exports.createUserController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const createUser = yield (0, user_services_1.createUserServices)(req === null || req === void 0 ? void 0 : req.body);
    if (!createUser) {
        throw new Error('faild to create user');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'user created successfully',
        token: createUser
    });
}));
exports.getSingleUserController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        throw new Error('unauthorized access');
    }
    const findingUser = yield user_model_1.default.findById((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id);
    if (!findingUser) {
        throw new Error('user not found');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'user retrived successfully',
        data: findingUser
    });
}));
exports.getAllUserController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        throw new Error('unauthorized access');
    }
    const findingUser = yield user_model_1.default.find({ isDeleted: { $ne: true } });
    if (!findingUser) {
        throw new Error('user not found');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'all user retrived successfully',
        data: findingUser
    });
}));
exports.deleteUserController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        throw new Error('unauthorized access');
    }
    const findingUser = yield user_model_1.default.findByIdAndUpdate((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id, { isDeleted: true }, { new: true, runValidators: true, context: 'query' });
    if (!findingUser) {
        throw new Error('faild to deleted user');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'user deleted successfully',
        data: findingUser
    });
}));
