import express from 'express'
const userRoute = express.Router()
import User from '../models/User.js'
import expressAsyncHandler from 'express-async-handler'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

userRoute.post("/register", expressAsyncHandler(async (req, res) => {
    try {
        // check if the user exists and create if doesnot exists
        const userData = req.body;
        const { email, password } = userData;
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User exists!" })
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        userData.password = hashedPassword

        const newUser = await User(userData);
        await newUser.save()

        const token = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000
        })

        return res.status(201).json({ message: "User Created Successfully!", newUser })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "User creation failed!" })
    }
}))

export default userRoute