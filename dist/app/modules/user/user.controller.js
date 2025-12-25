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
exports.deleteUserController = exports.getAllUserController = exports.getSavedUserController = exports.saveduserController = exports.blockUserController = exports.matchUserController = exports.getSingleUserController = exports.subscriptionController = exports.imageUploadController = exports.signUpOtpController = exports.createUserController = void 0;
const user_services_1 = require("./user.services");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../helper/catchAsync");
const user_model_1 = __importDefault(require("./user.model"));
const subs_model_1 = __importDefault(require("../subscription/subs.model"));
const imageUploader_1 = require("../../helper/imageUploader");
const mongoose_1 = __importDefault(require("mongoose"));
exports.createUserController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const createUser = yield (0, user_services_1.createUserServices)(req === null || req === void 0 ? void 0 : req.body);
    if (!createUser) {
        throw new Error('faild to create user');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'has been sent verification code to your email',
        verificationToken: createUser
    });
}));
exports.signUpOtpController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const createUser = yield (0, user_services_1.signUpOtpServices)(req);
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
exports.imageUploadController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!req.files || Object.keys(req.files).length === 0) {
        throw new Error('please provide an image');
    }
    const imageNamePrefix = `${(_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.title}_${Math.random().toString().split('.')[1]}`;
    const Imagefiles = Array.isArray(req === null || req === void 0 ? void 0 : req.files) ? req.files : ((_b = req === null || req === void 0 ? void 0 : req.files) === null || _b === void 0 ? void 0 : _b.images) || [];
    const imageUrls = yield Promise.all(Imagefiles.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, imageUploader_1.uploadImage)(file === null || file === void 0 ? void 0 : file.path, `${imageNamePrefix}`);
        return result.secure_url;
    })));
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'image uploaded successfully',
        data: imageUrls
    });
}));
exports.subscriptionController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const subscription = yield subs_model_1.default.findById((_a = req.body) === null || _a === void 0 ? void 0 : _a.id);
    if (!subscription) {
        throw new Error('subscription plan not found');
    }
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
exports.getSingleUserController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const findingUser = yield user_model_1.default.findById((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
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
exports.matchUserController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const myInformation = req === null || req === void 0 ? void 0 : req.user;
    const findingUser = yield user_model_1.default.find({
        isDeleted: { $ne: true },
        blockedUsers: { $nin: [myInformation === null || myInformation === void 0 ? void 0 : myInformation._id] },
        blockedMe: { $nin: [myInformation === null || myInformation === void 0 ? void 0 : myInformation._id] },
        gender: { $ne: myInformation === null || myInformation === void 0 ? void 0 : myInformation.gender },
        age: { $lte: myInformation === null || myInformation === void 0 ? void 0 : myInformation.age }, //will do modify later for better matching
        orientation: myInformation === null || myInformation === void 0 ? void 0 : myInformation.orientation,
        relationshipStatus: myInformation === null || myInformation === void 0 ? void 0 : myInformation.relationshipStatus,
    });
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
exports.blockUserController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const blockingUser = yield user_model_1.default.findByIdAndUpdate((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, { $addToSet: { blockedUsers: req.body.userId } }, { new: true, runValidators: true, context: 'query', session });
        if (!blockingUser) {
            throw new Error('Failed to block user');
        }
        const updateUserBlockedMe = yield user_model_1.default.findByIdAndUpdate((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.userId, { $addToSet: { blockedMe: (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c._id } }, { new: true, runValidators: true, context: 'query', session });
        if (!updateUserBlockedMe) {
            throw new Error('Failed to update blocked user');
        }
        yield session.commitTransaction();
        yield session.endSession();
        res.status(http_status_1.default.OK).json({
            success: true,
            status: http_status_1.default.OK,
            message: 'User blocked successfully',
            data: blockingUser
        });
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
}));
exports.saveduserController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const echeckExisting = yield user_model_1.default.findOne({ savedUser: { $in: [req.body.userId] } });
    if (echeckExisting) {
        throw new Error('user already saved');
    }
    const savedUser = yield user_model_1.default.findByIdAndUpdate((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, { $push: { savedUser: req.body.userId } }, { new: true, runValidators: true, context: 'query' });
    if (!savedUser) {
        throw new Error('faild to saved user');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'Saved successfully',
        data: savedUser
    });
}));
exports.getSavedUserController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const savedUser = yield user_model_1.default.findById((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id).populate('savedUser').select('savedUser -_id');
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'user Saved successfully',
        data: savedUser
    });
}));
exports.getAllUserController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const queryData = {
        gender: { $ne: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.gender },
        isDeleted: { $ne: true },
        blockedUsers: { $nin: [(_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id] },
        blockedMe: { $nin: [(_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c._id] },
    };
    if ((_d = req === null || req === void 0 ? void 0 : req.query) === null || _d === void 0 ? void 0 : _d.distance) {
        const distance = parseInt((_e = req === null || req === void 0 ? void 0 : req.query) === null || _e === void 0 ? void 0 : _e.distance);
        if (!isNaN(distance)) {
            queryData.address = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: (_g = (_f = req.user) === null || _f === void 0 ? void 0 : _f.address) === null || _g === void 0 ? void 0 : _g.coordinates
                    },
                    $maxDistance: distance
                }
            };
        }
    }
    if (((_h = req === null || req === void 0 ? void 0 : req.query) === null || _h === void 0 ? void 0 : _h.startAgerange) && ((_j = req === null || req === void 0 ? void 0 : req.query) === null || _j === void 0 ? void 0 : _j.endAgerange)) {
        const startAge = parseInt((_k = req === null || req === void 0 ? void 0 : req.query) === null || _k === void 0 ? void 0 : _k.startAgerange);
        const endAge = parseInt((_l = req === null || req === void 0 ? void 0 : req.query) === null || _l === void 0 ? void 0 : _l.endAgerange);
        if (!isNaN(startAge) && !isNaN(endAge)) {
            queryData.age = { $gte: startAge, $lte: endAge };
        }
    }
    const findingUser = yield user_model_1.default.find(queryData);
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
// export const singleImageUploadController: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     if (!req.file) {
//         throw new Error('please provide an image')
//     }
//     const uploaded = await uploadImage(req.file?.path as string, 'profile_images')
//     if (!uploaded) {
//         throw new Error('faild to upload image')
//     }
//     res.status(status.OK).json({
//         success: true,
//         status: status.OK,
//         message: 'image uploaded successfully',
//         data: uploaded?.secure_url
//     })
// })
