const mongoose = require("mongoose");
const validator = require("validator");

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
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email")
            }
        }

    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
        trim: true,
        validate(value){
            if(!validator.isStrongPassword(value,{
                minLength: 5,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })){
                throw new Error("Password is not strong enough")
            }
        }
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
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL")
            }
        }

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
