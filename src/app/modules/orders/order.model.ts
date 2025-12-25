import mongoose, { Schema } from 'mongoose';
import { Torder } from './order.interface';

const orderSchema = new Schema<Torder>({
    senderId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Sender ID is required'],
        ref: 'users',
    },
    reciverId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Receiver ID is required'],
        ref: 'users', 
    },
    productId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Product ID is required'],
        ref: 'stores', 
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true, strict: 'throw' });

const orderModel = mongoose.model<Torder>('orders', orderSchema);

export default orderModel;