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
exports.getChildController = exports.createChildController = exports.subscriptionController = exports.deleteUserController = exports.getAllUserController = exports.getSingleUserController = exports.createUserController = void 0;
const user_services_1 = require("./user.services");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../helper/catchAsync");
const user_model_1 = __importDefault(require("./user.model"));
const subs_model_1 = __importDefault(require("../subscription/subs.model"));
const slugGenerator_1 = require("../../helper/slugGenerator");
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
exports.subscriptionController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const subscription = yield subs_model_1.default.findById((_a = req.body) === null || _a === void 0 ? void 0 : _a.id);
    if (!subscription) {
        throw new Error('subscription plan not found');
    }
    //  const durationObj = {
    //     monthly: 30,
    //     weekly: 7,
    //     yearly: 365,
    // } as const;
    // type DurationType = keyof typeof durationObj;
    // const durationType: DurationType = (req.body.durationType as DurationType) || 'monthly';
    const value = {
        expiredAt: new Date(Date.now() + (subscription === null || subscription === void 0 ? void 0 : subscription.duration) * 24 * 60 * 60 * 1000),
        planType: subscription === null || subscription === void 0 ? void 0 : subscription.plan,
        subscriptionStatus: 'active',
        transectionId: req.body.transectionId || null
    };
    const findingUser = yield user_model_1.default.findByIdAndUpdate((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id, value, { new: true, runValidators: true, context: 'query' });
    if (!findingUser) {
        throw new Error('faild to updated user');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'user deleted successfully',
        data: findingUser
    });
}));
exports.createChildController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.planType) !== 'family') {
        throw new Error('only family plan user can create child account');
    }
    if (((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.subscriptionStatus) !== 'active') {
        throw new Error('your subscription is not active');
    }
    const data = Object.assign(Object.assign({}, req === null || req === void 0 ? void 0 : req.body), { fullName: `${(_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.fullName} - child account`, phoneNumber: (_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d.phoneNumber, role: 'user', planType: (_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e.planType, expiredAt: (_f = req === null || req === void 0 ? void 0 : req.user) === null || _f === void 0 ? void 0 : _f.expiredAt, subscriptionStatus: (_g = req === null || req === void 0 ? void 0 : req.user) === null || _g === void 0 ? void 0 : _g.subscriptionStatus, parentId: (_h = req === null || req === void 0 ? void 0 : req.user) === null || _h === void 0 ? void 0 : _h._id, slug_id: (0, slugGenerator_1.generateSlugId)() });
    const createChild = yield user_model_1.default.create(data);
    if (!createChild) {
        throw new Error('faild to create child account');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'user created successfully',
        data: createChild
    });
}));
exports.getChildController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.planType) !== 'family') {
        throw new Error('only family plan user can retrive child account');
    }
    if (((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.subscriptionStatus) !== 'active') {
        throw new Error('your subscription is not active');
    }
    const getChild = yield user_model_1.default.find({ parentId: (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c._id, isDeleted: { $ne: true } });
    if (!getChild) {
        throw new Error('faild to create child account');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'user created successfully',
        data: getChild
    });
}));
