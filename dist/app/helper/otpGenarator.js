"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtpCode = generateOtpCode;
function generateOtpCode() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}
