import { Types } from "mongoose";

export type Torder = {
    senderId : Types.ObjectId;
    reciverId : Types.ObjectId;
    productId : Types.ObjectId;
    isDeleted : boolean
}