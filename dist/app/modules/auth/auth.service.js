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
exports.updateUserServices = exports.verifyOtpServices = exports.forgetPasswordService = exports.signInService = void 0;
const config_1 = require("../../config/config");
const user_model_1 = __importDefault(require("../user/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otpGenarator_1 = require("../../helper/otpGenarator");
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailTemplete_1 = require("../../helper/emailTemplete");
const signInService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const checkExistancy = yield user_model_1.default.findOne({ email: payload.email }).select('name email gender password role isDeleted');
    if (!checkExistancy) {
        throw new Error('user is not exist');
    }
    if (checkExistancy.password !== payload.password) {
        throw new Error('invalid password');
    }
    if (checkExistancy.isDeleted) {
        throw new Error('unthorized user');
    }
    const credentials = {
        name: checkExistancy.name,
        email: checkExistancy.email,
        gender: checkExistancy.gender,
        role: checkExistancy.role,
    };
    if (payload.remember) {
        const accessToken = jsonwebtoken_1.default.sign(credentials, config_1.envData.secretKey, { expiresIn: '12d' });
        return accessToken;
    }
    else {
        const accessToken = jsonwebtoken_1.default.sign(credentials, config_1.envData.secretKey, { expiresIn: '1d' });
        return accessToken;
    }
});
exports.signInService = signInService;
const forgetPasswordService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const checkBefore = yield user_model_1.default.findOne({
        email: { $eq: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.email },
        isDeleted: { $ne: true }
    });
    if (!checkBefore) {
        throw new Error('user not found');
    }
    const otpCode = (0, otpGenarator_1.generateOtpCode)();
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: config_1.envData.email,
            pass: config_1.envData.emailPassword
        }
    });
    const send = yield transporter.sendMail({
        from: {
            name: 'Rumblle',
            address: config_1.envData.email
        },
        to: req.body.email,
        subject: 'Rumble email verification code--Sign Up',
        text: '',
        html: (0, emailTemplete_1.templeteString)(req.body.email, otpCode)
    });
    if (!send.response) {
        throw new Error('faild to send email');
    }
    const credentials = {
        name: checkBefore.name,
        userId: checkBefore === null || checkBefore === void 0 ? void 0 : checkBefore._id,
        otpCode: otpCode
    };
    const verificationToken = jsonwebtoken_1.default.sign(credentials, config_1.envData.secretKey, { expiresIn: '3m' });
    return verificationToken;
});
exports.forgetPasswordService = forgetPasswordService;
const verifyOtpServices = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("Unauthorized: No token provided");
        }
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            throw new Error("Unauthorized: No token provided");
        }
        const decodeUser = jsonwebtoken_1.default.verify(token, config_1.envData.secretKey);
        if (!decodeUser) {
            throw new Error('unauthorized user');
        }
        if ((decodeUser === null || decodeUser === void 0 ? void 0 : decodeUser.otpCode) !== ((_b = req.body) === null || _b === void 0 ? void 0 : _b.otpCode)) {
            throw new Error('invalid otp');
        }
        return decodeUser === null || decodeUser === void 0 ? void 0 : decodeUser.userId;
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new Error("otp code expierd");
        }
        throw new Error(err);
    }
});
exports.verifyOtpServices = verifyOtpServices;
const updateUserServices = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // const data = JSON.parse(req?.body.data)
    var _a;
    // const imageNamePrefix = `${req?.user?.name}_${Math.random().toString().split('.')[1]}`;
    // const imagePath = req.file?.path;
    // if (imagePath) {
    //     const result = await uploadImage(imagePath, imageNamePrefix);
    //     data.profileImage = result.secure_url;
    // }
    const updating = yield user_model_1.default.findByIdAndUpdate((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, req === null || req === void 0 ? void 0 : req.body, { new: true, runValidators: true, context: 'query' });
    if (!updating) {
        throw new Error('faild to update user');
    }
    const credentials = {
        name: updating.name,
        email: updating.email,
        role: updating.role,
        gender: updating.gender
    };
    const accessToken = jsonwebtoken_1.default.sign(credentials, config_1.envData.secretKey, { expiresIn: '12d' });
    return accessToken;
});
exports.updateUserServices = updateUserServices;
