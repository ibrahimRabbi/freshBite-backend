import mongoose, { Schema } from 'mongoose';
import { TStore } from './store.interface';

const storeSchema = new Schema<TStore>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    price: {
        type: String,
        required: [true, 'Price is required'],
        trim: true,
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        validate: {
            validator: function (value: string) {
                return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|bmp))$/.test(value);
            },
            message: 'Invalid image URL',
        },
    },

    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });




const productsModel = mongoose.model<TStore>('products', storeSchema);

export default productsModel;