import mongoose, { Schema } from 'mongoose';
import { Tsubscription } from './subs.interface';

const subscriptionSchema = new Schema<Tsubscription>({
    plan: {
        type: String,
        enum: {
            values: ['premium', 'basic', 'trial'],
            message: '{VALUE} is invalid subscription plan',
        },
        required: [true, 'Subscription plan is required'],
    },
    duration: {
        type: Number,
        enum: {
            values: [7, 30, 365],
            message: '{VALUE} is invalid subscription duration',
        },
        required: [true, 'Subscription duration is required'],
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Price cannot be negative'],
    },
   features: {
        type: [String],
        required: [true, 'Subscription description is required'],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true, strict: 'throw' });

const subscriptionModel = mongoose.model<Tsubscription>('Subscription', subscriptionSchema);

export default subscriptionModel;