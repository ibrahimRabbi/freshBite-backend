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
exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: 'dymnrefpr',
    api_key: '214554444282119',
    api_secret: 'nt7kZ5Bxs4juDmI9iIpgAMUG820'
});
const uploadImage = (imagePath, imageName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const declarImageDetail = {
            public_id: imageName,
            overwrite: true
        };
        const result = yield cloudinary_1.v2.uploader.upload(imagePath, declarImageDetail);
        fs_1.default.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
            else {
                console.log('File deleted successfully');
            }
        });
        if (!result) {
            throw new Error('Failed to host image');
        }
        return result;
    }
    catch (error) {
        throw new Error(error.message || 'Error uploading image');
    }
});
exports.uploadImage = uploadImage;
