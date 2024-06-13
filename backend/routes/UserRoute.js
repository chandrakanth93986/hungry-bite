import express from 'express'
const userRoute = express.Router()
import User from '../models/User.js'
import expressAsyncHandler from 'express-async-handler'

userRoute.post("/register", expressAsyncHandler(async (req, res) => {
    try {
        // check if the user exists and create if doesnot exists
        const { email } = req.body;
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User exists!" })
        }

        const newUser = await User(req.body);
        await newUser.save()

        return res.status(201).json({ message: "User Created Successfully!", newUser })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "User creation failed!" })
    }
}))

export default userRoute