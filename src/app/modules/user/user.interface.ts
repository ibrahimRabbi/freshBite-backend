export type Tuser = {
    fullName : string,
    email : string,
    phoneNumber : number,
    password : string,
    profileImage : string,
    planType : 'premium' | 'family' | 'guest' | 'trial',
    role : 'user' | 'admin',
    slug_id : string,
    isDeleted : boolean,
    isActive : boolean
}