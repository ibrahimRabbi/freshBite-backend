import { postRoute } from './post.route';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../helper/catchAsync";
import PostModel from "./post.model";
import status from "http-status";
import { Tpost } from "./post.interface";
import userModel from '../user/user.model';
import { Types } from 'mongoose';

export const createPostController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const data: Tpost = {
        userId: req?.user?._id,
        ...req.body,
        comments: [],
        isDeleted: false
    }

    const creating = await PostModel.create(data)
    if (!creating) {
        throw new Error('faild to create post please try again')
    }

    res.status(status.CREATED).json({
        succcess: true,
        status: status.CREATED,
        message: 'post created successfully',
        data: creating
    })
})


export const getMyPostController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const getMypost = await PostModel.find({ userId: req?.user?._id })
    if (!getMypost) {
        throw new Error('faild to create post please try again')
    }

    res.status(status.OK).json({
        succcess: true,
        status: status.OK,
        message: 'post retrive successfully',
        data: getMypost
    })
})


export const frindsPostController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const myProfile = await userModel.findById(req?.user?._id)

    const getMyfriendPost = await PostModel.find({ userId: { $in: myProfile?.friends } }).sort({ createdAt: -1 })
    if (!getMyfriendPost) {
        throw new Error('faild to create post please try again')
    }


    res.status(status.OK).json({
        succcess: true,
        status: status.OK,
        message: 'post retrive successfully',
        data: getMyfriendPost
    })
})