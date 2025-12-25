import { Server, Socket } from "socket.io";
import { Tconversations, Tmessage } from "./conversation.interface";
import { conversationModel, messageModel } from "./conversation.model";
import { catchAsync } from "../../helper/catchAsync";
import { NextFunction, Request, Response } from "express";
import status from "http-status";

export const conversationController = (io: Server, socket: Socket) => {

    socket.on('checkingAndjoinConversationRoom', async (payload) => {

        const conversationData: Tconversations = {
            members: [payload.senderId, payload.reciverId],
            isDeleted: false,

        }
        const members = [payload.senderId, payload.reciverId].sort();
        const checkExistancy = await conversationModel.findOne({ members: { $all: members } })

        if (!checkExistancy) {
            const createCoversation = await conversationModel.create(conversationData)

            socket.join(createCoversation._id.toString())
            socket.emit("joinedConversationRoom", { conversationId: createCoversation._id })
        } else {
            socket.join(checkExistancy._id.toString())
            socket.emit("joinedConversationRoom", { conversationId: checkExistancy._id })
        }
    })

    socket.on('sendMessage', async (payload) => {
        const messageData: Tmessage = { conversationId: payload?.conversationId, sender: payload?.senderId, messsage: payload?.message, isDeleted: false }
        const createMessage = await messageModel.create(messageData)
        if (createMessage) {
            io.to(payload?.conversationId).emit("receiveMessage", {messageData});
        }
    })

    socket.on('getMessage', async (payload) => {     
        const findConversation = await messageModel.find({conversationId:payload?.conversationId})
        if (findConversation) {
            socket.emit("loadMessage", findConversation);
        }

    })

}


export const fetchAllConversationController = catchAsync( async (req:Request,res:Response,next:NextFunction)=>{

    const checkExistancy = await conversationModel.find({ members: {$in:req?.user?._id} }).populate('members')

    if (!checkExistancy) {
        throw new Error("conversation not Found")
    }
    res.status(status.OK).json({
        sucess: true,
        status: status.OK,
        message: "conversation retrived successfully",
        data: checkExistancy
    })
})