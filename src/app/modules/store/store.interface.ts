import { Schema, Types } from "mongoose";

export type TStore = {
    title : string;
    price : string;
    image : string;
    isDeleted : boolean;
}