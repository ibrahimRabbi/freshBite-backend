import { Request } from "express";
import { envData } from "../../config/config";
import userModel from "../user/user.model";
import { TsignIn } from "./auth.interface";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { generateOtpCode } from "../../helper/otpGenarator";
import nodeMailer from "nodemailer";
import { templeteString } from "../../helper/emailTemplete";
import { uploadImage } from "../../helper/imageUploader";




export const signInService = async (payload: TsignIn) => {

    const checkExistancy = await userModel.findOne({ email: payload.email }).select('name email password role planType isDeleted');

    if (!checkExistancy) {
        throw new Error('user is not exist')
    }

    if (checkExistancy.password !== payload.password) {
        throw new Error('invalid password')
    }

    if (checkExistancy.isDeleted) {
        throw new Error('unthorized user')
    }

    const credentials = {
        name: checkExistancy.fullName,
        email: checkExistancy.email,
        slug_id: checkExistancy.slug_id,
        role: checkExistancy.role,
        planType: checkExistancy.planType
    }

    if (payload.remember) {
        const accessToken = jwt.sign(credentials, envData.secretKey as string, { expiresIn: '12d' })
        return accessToken
    } else {
        const accessToken = jwt.sign(credentials, envData.secretKey as string, { expiresIn: '1d' })
        return accessToken
    }
}

export const forgetPasswordService = async (req: Request) => {

    const checkBefore = await userModel.findOne({
        email: { $eq: req?.body?.email },
        isDeleted: { $ne: true }
    })

    if (!checkBefore) {
        throw new Error('user not found')
    }

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
        to: req.body.email as string,
        subject: 'Rumble email verification code--Sign Up',
        text: '',
        html: templeteString(req.body.email, otpCode)
    })

    if (!send.response) {
        throw new Error('faild to send email')
    }

    const credentials = {
        name: checkBefore.fullName,
        otpCode: otpCode
    }

    const verificationToken = jwt.sign(credentials, envData.secretKey as string, { expiresIn: '3m' })
    return verificationToken


}

export const verifyOtpServices = async (req: Request) => {

    try {
        const authHeader = req.headers.authorization;
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

    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            throw new Error("otp code expierd");
        }

        throw new Error(err)
    }





}


export const updateUserServices = async (req: Request) => {
    
    const data = JSON.parse(req?.body.data)

    const imageNamePrefix = `${req?.user?.fullName}_${Math.random().toString().split('.')[1]}`;
    const imagePath = req.file?.path;
 
    if (imagePath) {
        
        const result = await uploadImage(imagePath, imageNamePrefix);
        data.profileImage = result.secure_url;
    }
     

    const updating = await userModel.findByIdAndUpdate(req?.user?._id, data, { new: true, runValidators: true, context: 'query' })
    if (!updating) {
        throw new Error('faild to update user')
    }


    const credentials = {
        name: updating.fullName,
        email: updating.email,
        role: updating.role,
        planType: updating.planType
    }

    const accessToken = jwt.sign(credentials, envData.secretKey as string, { expiresIn: '12d' })
    return accessToken

}