import express from 'express';
import bcrypt from 'bcrypt';
import Userservice from '../Services/User'
import { Request, Response } from 'express';
const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "name, email and password required" })
    }
    try {
        const existingUser = await Userservice.get({ email });
        if (existingUser.length > 0) {
            return res.status(409).json({ message: "Email already registered" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const data = await Userservice.add({ name, email, password: hashedPassword });
        return res.status(201).json({ message: "User Created Successfully" })
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to register the user" });
    }

}
const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password required" });
    }
    try {
        const findEmail = await Userservice.get({ email });
        if (findEmail.length == 0) {
            return res.status(401).json("Email Not Registered");
        }

        const ispasswordCorrect = await bcrypt.compare(password, findEmail[0].password);
        if (!ispasswordCorrect) {
            return res.status(401).json("Password is Invalid");
        }
        return res.status(200).json({
            message: "Login Successfully", user: {
                name: findEmail[0].name,
                email: findEmail[0].email,

            }
        })
    }
    catch (error) {
        console.log(error);
    }


}
export default { register, login }