import { Request } from "express";
import { envData } from "../../config/config";
import { generateSlugId } from "../../helper/slugGenerator";
import { Tuser } from "./user.interface";
import userModel from "./user.model";
import jwt from 'jsonwebtoken'



export const createUserServices = async (payload: Tuser) => {
    const data: Tuser = {
        ...payload,
        slug_id: generateSlugId(),
        role: 'user',
        planType: 'guest'
    }

    const creating = await userModel.create(data)
    if (!creating) {
        throw new Error('faild to create user')
    }

    const credentials = {
        name: creating.fullName,
        email: creating.email,
        slug_id: creating.slug_id,
        role: creating.role,
        planType: creating.planType
    }

    const accessToken = jwt.sign(credentials, envData.secretKey as string, { expiresIn: '12d' })
    return accessToken

}

