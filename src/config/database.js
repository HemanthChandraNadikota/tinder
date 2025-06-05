const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://hemanthchandra696:hemanthchandra696@tinder.zqp8pau.mongodb.net/hemanthTinder")
    console.log("Connected to MongoDB")
}

module.exports = connectDB;