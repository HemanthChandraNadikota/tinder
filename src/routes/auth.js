const express = require("express")
const authRouter = express.Router()
const {validateSignUpData} = require("../helpers/validation")
const bcrypt = require("bcrypt")
const User = require("../models/user")
const validator = require("validator")
const {userAuth} = require("../middlewares/auth")

authRouter.post("/signup",async(req,res)=>{
    try {
        validateSignUpData(req)
        req.body.password = await bcrypt.hash(req.body.password,10)
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        });
        const savedUser = await user.save()

        const token = await savedUser.getJWTToken()

        res.cookie("token",token,{
            httpOnly: true, 
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        })

        res.status(201).json({message: "User created successfully", data: savedUser})
    } catch (error) {
        res.status(500).send(error.message)
    }
})

authRouter.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;

        if(!validator.isEmail(email)){
            throw new Error("Invalid email")
        }

        const user = await User.findOne({email})

        if(!user){
            throw new Error("User not found")
        }

        const isPasswordCorrect = await user.comparePassword(password)

        if(!isPasswordCorrect){ 
            throw new Error("Invalid password")
        }

        const token = await user.getJWTToken()

        res.cookie("token",token,{
            httpOnly: true, 
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        })

        res.status(200).send({message: "Login successful", data: user})
        
    } catch (error) {
        res.status(500).send(error.message)
    }
})

authRouter.post("/logout",async(req,res)=>{
    try {
        res.clearCookie("token")
        res.status(200).send({message: "Logout successful"})
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = authRouter;