import { Types } from "mongoose"

export type Tmessage = {
    sender : Types.ObjectId;
    conversationId : Types.ObjectId
    messsage: string,
    isDeleted : boolean
}


export type Tconversations = {
    members: Types.ObjectId[];
    isDeleted?: boolean;
}