import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { Taddress, Tuser } from './user.interface';

const addressSchema = new Schema<Taddress>({
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
}, { _id: false });

const userSchema = new Schema<Tuser>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'user already exists, Email must be unique'],
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
                return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/.test(value);
            },
            message: 'Invalid profile image URL',
        },
    },

    photos: [{
        type: String,
        validate: {
            validator: function (value: string) {
                return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/.test(value);
            },
            message: 'Invalid photo URL',
        },
        default: []
    }],

    address: {
        type: addressSchema,
        required: true,
        default : {
            type: 'Point',
            coordinates: [0, 0]
        }
    },

    birthDay: {
        type: Date,
        
        default: null,
    },

    age: { type: Number, default: null },

    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: {
            values: ['male', 'female'],
            message: '{VALUE} is not a valid gender',
        },
        default: "male"
    },

    height: {
        unit: {
            type: String,
            enum: {
                values: ['cm', 'ft'],
                message: '{VALUE} is not a valid height unit',
            },
            default: 'cm'
        },
        value: {
            type: Number,
            default: 0,
        },
    },

    orientation: {
        type: String,
        required: [true, 'Orientation is required'],
        enum: {
            values: ['loseWeight', 'maintainWeight', 'gainWeight', 'notSpecified'],
            message: '{VALUE} is not a valid orientation',
        },
        default: 'notSpecified'
    },

    relationshipStatus: {
        type: String,
        required: [true, 'Relationship status is required'],
        enum: {
            values: ['single', 'married', 'complicated', 'preferNotToSay', 'divorced', 'widowed', 'separated', 'inARelationship', 'engaged'],
            message: '{VALUE} is not a valid relationship status',
        },
        default: 'preferNotToSay'
    },

    aboutMe: {
        type: String,
        default: '',
    },

    socialLinks: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedIn: String,
        pinterest: String,
        youtube: String,
        website: String,
    },

    savedUser: { type: [Schema.Types.ObjectId], ref: 'usersTrees', default: [] },

    blockedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'usersTrees',
    }],

    blockedMe: [{
        type: Schema.Types.ObjectId,
        ref: 'usersTrees',
    }],

    planType: {
        type: String,
        enum: {
            values: ['basic', 'premium', 'trial'],
            message: '{VALUE} is not a valid plan type',
        },
        default: 'basic'
    },

    expiredAt: {
        type: Date,
        default: null,
    },

    subscriptionStatus: {
        type: String,
        enum: {
            values: ['active', 'inactive'],
            message: '{VALUE} is not a valid subscription status',
        },
        default: 'inactive'
    },

    transectionId: {
        type: String,
        default: null,
    },

    topUp: { type: Number, default: 0 },

    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: {
            values: ['user', 'admin'],
            message: '{VALUE} is not valid role',
        },
        default: 'user'
    },

    isDeleted: {
        type: Boolean,
        default: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },

    isActive: {
        type: Boolean,
        default: true,
    },

}, { timestamps: true, strict: 'throw' });



userSchema.index({ address: '2dsphere' });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phoneNumber: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ isDeleted: 1 });
userSchema.index({ planType: 1 });
userSchema.index({ createdAt: -1 });

const userModel = mongoose.model<Tuser>('usersTree', userSchema);

export default userModel;