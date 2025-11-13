import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { Tuser } from './user.interface';



const userSchema = new Schema<Tuser>({
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
        validate: [validator.isEmail, 'Invalid email format'],
    },
    phoneNumber: {
        type: Number,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function (value: number) {
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
            validator: function (value: string) {
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
    isActive: { type: Boolean, default: true, },
    isDeleted: { type: Boolean, default: false, }
}, { timestamps: true, strict: 'throw' })




const userModel = mongoose.model<Tuser>('users', userSchema);

export default userModel


