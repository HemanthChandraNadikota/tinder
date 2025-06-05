const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 20,
        trim: true,
        lowercase: true,
    },
    lastName: {
        type: String,
        minlength: 4,
        maxlength: 20,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 100,
    },
    gender: {
        type: String,
        required: true,
        validate(value){
            if(value !== "M" && value !== "F"){
                throw new Error("Gender must be either M or F")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1200",

    },
    about: {
        type: String,
        default: "This is a default about me"
    },
    skills: {
        type: [String],
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("User", userSchema);
