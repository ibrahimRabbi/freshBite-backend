import mongoose, { Schema } from "mongoose";
import { TsignIn } from "./auth.interface";
import validator from 'validator';

const signInSchema = new Schema<TsignIn>({

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'this user already exist'],
        validate: [validator.isEmail, 'Invalid email format'],
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
    remember: { type: Boolean, required: true, default: true }

}, { timestamps: true, strict: 'throw' })




const signModel = mongoose.model<TsignIn>('users', signInSchema);

export default signModel