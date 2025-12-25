import mongoose, { Schema } from 'mongoose';
import { IFriend } from './friend.interface';

const friendSchema = new Schema<IFriend>({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'sender ID is required'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'Friend ID is required'],
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'accepted', 'rejected', 'blocked'],
      message: 'Status must be one of: pending, accepted, rejected, blocked',
    },
    default: 'pending',
    required: [true, 'Status is required'],
  },
  tierLabel: {
    type: String,
    enum: {
      values: ['tier1', 'tier2', 'tier3'],
      message: 'Tier label must be one of: tier1, tier2, tier3',
    },
    default: null,
  },
  blockedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  requestedAt: {
    type: Date,
    required: [true, 'Requested date is required'],
    default: Date.now,
  },
  blockedAt: {
    type: Date,
    default: null,
  },
  labeledAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});


friendSchema.index({ userId: 1, friendId: 1 }, { unique: true }); 
friendSchema.index({ userId: 1, status: 1 });
friendSchema.index({ friendId: 1, status: 1 });

const FriendModel = mongoose.model<IFriend>('friends', friendSchema);

export default FriendModel;