import express from "express";
import cors from 'cors';
import "dotenv/config";
import mongoose from "mongoose";
import userRoute from "./routes/UserRoute.js";
import loginRouter from "./routes/authRoute.js";
import path from 'path'
const __dirname = import.meta.dirname;

const app = express()

app.use(express.static(path.join(__dirname,'../frontend/build')))

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connected to database!"))

app.use(express.json())
app.use(cors())

//

app.use("/api/user", userRoute)
app.use("/api/auth", loginRouter)

//

app.use((req,res,next) => {
    res.sendFile(path.join(__dirname,'../frontend/build/index.html'))
})

app.listen(3000, () => {
    console.log("Server started at port 3000");
})