import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import jwt from 'jsonwebtoken';

import { envData } from "../config/config";
import userModel from "../modules/user/user.model";




export const authentication = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }


        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new Error('unauthorized user');
        }

        //const decodeUser = jwt.verify(token as string, envData.secretKey as string)
        const decodeUser = jwt.verify(token, envData.secretKey as string) as JwtPayload;

        if (!decodeUser) {
            throw new Error('unauthorized user')
        }

        const findUser = await userModel.findOne({
            email: (decodeUser as JwtPayload).email,
            isDeleted: { $ne: true }
        })

        if (!findUser) {
            throw new Error('unauthorized user')
        }
        req.user = findUser
        next()

    } catch (err: any) {
        next(err);
    }
}