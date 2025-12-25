import { model, Schema } from "mongoose";
import { Tconversations, Tmessage } from "./conversation.interface";

const messageSchema = new Schema<Tmessage>({
    conversationId: { type: Schema.Types.ObjectId, ref: 'conversations', required: true },
    sender : {type:Schema.Types.ObjectId, ref:'users', required:true},
    messsage: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true, })



const conversationSchema = new Schema<Tconversations>({
    members: { type: [Schema.Types.ObjectId], required: true, ref: 'users' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })


export const conversationModel = model("conversations", conversationSchema);
export const messageModel = model("messages", messageSchema);