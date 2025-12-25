import { Types } from "mongoose"

export type Taddress = {
    type: 'Point',
    coordinates: number[]
}

export type Tuser = {
    name: string,
    email: string,
    phoneNumber: number,
    password: string,
    profileImage: string,
    photos: string[],
    address: Taddress,
    birthDay: Date,
    age: number,
    gender: 'male' | 'female',
    height: { unit: 'cm' | 'ft', value: number },
    orientation: 'loseWeight' | 'maintainWeight' | 'gainWeight' | 'notSpecified',
    relationshipStatus: 'single' | 'married' | 'complicated' | 'preferNotToSay' | 'divorced' | 'widowed' | 'separated' | 'inARelationship' | 'engaged',
    aboutMe: string,
    socialLinks: {
        facebook?: string,
        twitter?: string,
        instagram?: string,
        linkedIn?: string,
        pinterest?: string,
        youtube?: string,
        website?: string,
    },
    savedUser: Types.ObjectId[];
    blockedUsers: Types.ObjectId[];
    blockedMe: Types.ObjectId[];
    planType: 'basic' | 'premium' | 'trial';
    expiredAt: Date | null;
    subscriptionStatus: 'active' | 'inactive';
    transectionId?: string | null;
    topUp: number
    role: 'user' | 'admin';
    isEmailVerified: boolean;
    isDeleted: boolean;
    isActive: boolean
}