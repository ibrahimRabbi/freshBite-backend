import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../helper/catchAsync";
import { IFriend } from "./friend.interface";
import FriendModel from "./friend.model";
import status from "http-status";

export const sentFriendReqcontoller = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data: IFriend = {
    senderId: req.user._id,
    userId: req.body.userId,
    status: 'pending',
    tierLabel: null,
    blockedBy: null,
    requestedAt: new Date(),
  }

  const checkExistingReq = await FriendModel.findOne({ senderId: data.senderId, userId: data.userId });

  if (checkExistingReq) {
    return res.status(400).json({ message: "Friend request already sent." });
  }

  const newFriendRequest = await FriendModel.create(data);

  res.status(status.CREATED).json({
    succcess: true,
    status: status.CREATED,
    message: 'friend request sent successfully',
    data: newFriendRequest
  })
})

export const getFriendReqcontoller = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const friendRequests = await FriendModel.find({ userId: req.user._id, status: 'pending' }).populate('senderId', 'name email profileImage').select('senderId userId requestedAt');
  res.status(status.OK).json({
    succcess: true,
    status: status.OK,
    message: 'friend requests retrieved successfully',
    data: friendRequests
  })
})

export const accaptFriendReqcontoller = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const acceptingRequest = await FriendModel.findByIdAndUpdate(
    req.body.requestId, { status: 'accepted' },
    { new: true, runValidators: true, strict: 'throw' }
  );
  res.status(status.OK).json({
    succcess: true,
    status: status.OK,
    message: 'friend requests retrieved successfully',
    data: acceptingRequest
  })
})

export const getFriendListcontoller = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const getFriendList = await FriendModel.find({
    $or: [{ senderId: req.user._id }, { userId: req.user._id }],
    status: 'accepted'
  })
    .select('senderId userId requestedAt')
    .populate({
      path: 'senderId',
      match: { _id: { $ne: req.user._id } },
      select: 'name email profileImage isActive'
    })
    .populate({
      path: 'userId',
      match: { _id: { $ne: req.user._id } },
      select: 'name email profileImage isActive'
    });


  const friendList = getFriendList.map(friend => {
    return {
      _id: friend._id,
      requestedAt: friend.requestedAt,
      friendData: friend.senderId?._id ? friend.senderId : friend.userId
    };
  }).filter(f => f.friendData);


  res.status(status.OK).json({
    succcess: true,
    status: status.OK,
    message: 'friend list retrieved successfully',
    data: friendList
  })

})