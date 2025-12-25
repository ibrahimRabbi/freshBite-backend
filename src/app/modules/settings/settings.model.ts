import mongoose, { Schema } from "mongoose";
import { TSetting } from "./settings.interface";

const settingSchema = new Schema<TSetting>({
    setting_title: {
        type: String,
        enum: {
            values: ['privacy policy', 'terms and conditions', 'about us'],
            message: '{VALUE} is not a valid setting title'
        },
        required: true, unique: true
    },
    value: { type: String, default: '', required: true },
}, {timestamps: true,})

export const SettingsModel = mongoose.model<TSetting>('Settings', settingSchema);