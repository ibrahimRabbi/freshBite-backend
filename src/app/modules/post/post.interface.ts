import { Types } from "mongoose"

export type Tpost = {
    userId : Types.ObjectId;
    caption : string;
    images : string[];
    comments : {text:string, userId:Types.ObjectId}[]
    isDeleted : boolean;
}