import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authheader = req.headers.authorization;
        if (!authheader) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = authheader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token is not present" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded as any;
        next();
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to authenticate" });
    }
}
export default authMiddleware;