import nodeMailer from "nodemailer";
import { envData } from "../../config/config";
import { Tuser } from "./user.interface";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { generateOtpCode } from "../../helper/otpGenarator";
import { templeteString } from "../../helper/emailTemplete";
import { Request } from "express";
import userModel from "./user.model";

// const data: Tuser = {
//         ...payload,
//         age : calculateAge(payload?.birthDay),
//         role: 'user',
//     }

//     data.address = {
//         type: 'Point',
//         coordinates: payload.address?.coordinates.reverse()
//     }

// const creating = await userModel.create(payload)
// if (!creating) {
//     throw new Error('faild to create user')
// }

export const createUserServices = async (payload: Tuser) => {

    
    const otpCode = generateOtpCode()

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: envData.email,
            pass: envData.emailPassword
        }
    })

    const send = await transporter.sendMail({
        from: {
            name: 'Rumblle',
            address: envData.email as string
        },
        to: payload.email as string,
        subject: 'Rumble email verification code--Sign Up',
        text: '',
        html: templeteString(payload.email, otpCode)
    })

    if (!send.response) {
        throw new Error('faild to send email')
    }

    const credentials = {
        ...payload,
        otpCode: otpCode
    }

    const verificationToken = jwt.sign(credentials, envData.secretKey as string, { expiresIn: '3m' })
    return verificationToken

}


export const signUpOtpServices = async (req: Request) => {


    try {
        const authHeader = req?.headers?.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("Unauthorized: No token provided");
        }

        const token = req.headers.authorization?.split(' ')[1];


        if (!token) {
            throw new Error("Unauthorized: No token provided");
        }


        const decodeUser = jwt.verify(token, envData.secretKey as string) as JwtPayload;

        if (!decodeUser) {
            throw new Error('unauthorized user')
        }

        if (decodeUser?.otpCode !== req.body?.otpCode) {
            throw new Error('invalid otp')
        }

        const data:Partial<Tuser> = {
            email: decodeUser?.email,
            password: decodeUser?.password,
            name: decodeUser?.name,
            phoneNumber: decodeUser?.phoneNumber,
            isEmailVerified: true,
            role: 'user',
        }
        const creating = await userModel.create(data)
        if (!creating) {
            throw new Error('faild to create user')
        }
        return creating


    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            throw new Error("otp code expierd");
        }

        throw new Error(err)
    }





}

