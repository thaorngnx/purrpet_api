const dotenv = require("dotenv")
const express = require("express")
const app = express()
const mongoose = require("mongoose")
dotenv.config()

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))

app.listen(3000, () => console.log("Server Started"))