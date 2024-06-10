import express from "express";
import cors from 'cors';
import "dotenv/config";

const app = express()
app.use(express.json())
app.use(cors())

app.get("/test", async (req, res) => {
    res.json({message: "Hello!"})
})

app.listen(3000, () => {
    console.log("Server started at port 3000");
})
