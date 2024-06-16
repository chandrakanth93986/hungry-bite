import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import User from '../models/User.js';
const loginRouter = express.Router()
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

loginRouter.post('/login', expressAsyncHandler(async (req, res) => {
    try {
        const body = req.body;
        const { email, password } = body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "Invalid credintials!" });
        }
        const passwordValidation = await bcryptjs.compare(password, user.password)
        if (!passwordValidation) {
            return res.status(400).json({ message: "Invalid Credintials!" });
        }

        const token = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000
        })

        return res.status(201).json({ message: "User Login successful!", token: token, userCred: user})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Login Failed!"})
    }
}))

export default loginRouter