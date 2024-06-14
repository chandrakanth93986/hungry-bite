import express from "express";
import cors from 'cors';
import "dotenv/config";
import mongoose from "mongoose";
import userRoute from "./routes/UserRoute.js";
import loginRouter from "./routes/authRoute.js";

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connected to database!"))

const app = express()
app.use(express.json())
app.use(cors())

//

app.use("/api/user", userRoute)
app.use("/api/auth", loginRouter)

//

app.listen(3000, () => {
    console.log("Server started at port 3000");
})
