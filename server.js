import mongoose from "mongoose";
import * as dotenv from "dotenv";
import express from "express";

const app = express()

dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected`)
    } catch (error) {
        console.log(`Error: ${error.message} ${process.env.MONGO_URI} `)
        process.exit(1)
    }
}
connectDB()
app.listen(3000, () => console.log("Server Started"))
