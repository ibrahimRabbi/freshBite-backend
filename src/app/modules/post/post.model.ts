import mongoose, { Schema } from 'mongoose';
import { Tpost } from './post.interface';

const commentSchema = new Schema({
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    minlength: [1, 'Comment must be at least 1 character long'],
    maxlength: [500, 'Comment cannot exceed 500 characters'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID for comment is required'],
    ref: 'users',
  }
}, { _id: false, timestamps: true });


const postSchema = new Schema<Tpost>({
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    ref: 'users',
  },
  caption: {
    type: String,
    required: [true, 'Caption is required'],
    trim: true,
    minlength: [1, 'Caption must be at least 1 character long'],
    maxlength: [500, 'Caption cannot exceed 500 characters'],
  },
  images: {
    type: [{
      type: String,
      validate: {
        validator: function (value: string) {
          return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/.test(value);
        },
        message: 'Invalid image URL format',
      }
    }],
    required: [true, 'At least one image is required'],
    validate: {
      validator: function (images: string[]) {
        return images && images.length > 0;
      },
      message: 'Post must have at least one image'
    }
  },
  comments: [commentSchema],
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const PostModel = mongoose.model<Tpost>('posts', postSchema);

export default PostModel;