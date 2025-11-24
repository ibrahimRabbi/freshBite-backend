"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [3, 'Full name must be at least 3 characters'],
        maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'this user already exist'],
        validate: [validator_1.default.isEmail, 'Invalid email format'],
    },
    phoneNumber: {
        type: Number,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function (value) {
                return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(value.toString());
            },
            message: 'Invalid phone number format',
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
            'Password must include uppercase, lowercase, number, and special character'
        ],
        select: false
    },
    profileImage: {
        type: String,
        default: 'https://res.cloudinary.com/dymnrefpr/image/upload/v1757822614/qzvkz2mczodyvwasqtlk.jpg',
        validate: {
            validator: function (value) {
                return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/.test(value);
            },
            message: 'Invalid profile image URL',
        },
    },
    planType: {
        type: String,
        enum: {
            values: ['premium', 'family', 'guest', 'trial'],
            message: '{VALUE} is invalid subscription plan',
        },
        default: 'guest',
    },
    transectionId: { type: String, default: null },
    expiredAt: { type: Date, default: null },
    subscriptionStatus: {
        type: String,
        enum: {
            values: ['active', 'inactive'],
            message: '{VALUE} is invalid subscription status',
        },
        default: 'inactive',
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: {
            values: ['user', 'admin'],
            message: '{VALUE} is not valid role',
        },
        default: 'user'
    },
    slug_id: {
        type: String,
        required: [true, 'Slug ID is required'],
        unique: [true, 'this user already exist.'],
        minlength: [6, 'Slug ID must be at least 5 characters'],
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    parentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users', default: 'parent' },
    isActive: { type: Boolean, default: true, },
    isDeleted: { type: Boolean, default: false, }
}, { timestamps: true, strict: 'throw' });
const userModel = mongoose_1.default.model('users', userSchema);
exports.default = userModel;
