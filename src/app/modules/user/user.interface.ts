import { Types } from "mongoose"

export type Tuser = {
    fullName : string,
    email : string,
    phoneNumber : number,
    password : string,
    profileImage : string,
    planType : 'premium' | 'family' | 'guest' | 'trial',
    transectionId : string | null,
    expiredAt : Date | null,
    subscriptionStatus : 'active' | 'inactive',
    role : 'user' | 'admin',
    parentId :Types.ObjectId | 'parent',
    slug_id : string,
    isDeleted : boolean,
    isActive : boolean
}