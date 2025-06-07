const express = require("express")
const profileRouter = express.Router()
const {userAuth} = require("../middlewares/auth")
const {validateProfileEditData} = require("../helpers/validation")
const bcrypt = require("bcrypt")

profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try {
        const user = req.user;

        if(!user){
            throw new Error("User not found")
        }

        res.status(200).send(user)
     
       
    }catch(error){
        res.status(500).send(error.message)
    }
})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try {
        const isEditAllowed = validateProfileEditData(req)
        if(!isEditAllowed){
            throw new Error("Invalid fields")
        }
        const loggedInUser = req.user;
        
        Object.keys(req.body).forEach(key=>{
            loggedInUser[key] = req.body[key];
        })
        await loggedInUser.save()
        res.status(200).send({message: "Profile updated successfully",user: loggedInUser})
    } catch (error) {
        res.status(500).send(error.message)
    }
})

profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const {oldPassword,newPassword} = req.body;
        if(oldPassword === newPassword){
            throw new Error("New password cannot be the same as old password")
        }
        const isPasswordCorrect = await loggedInUser.comparePassword(oldPassword)   
        if(!isPasswordCorrect){
            throw new Error("Old password is incorrect")
        }
        loggedInUser.password = await bcrypt.hash(newPassword,10);
        await loggedInUser.save()
        res.status(200).send({message: "Password changed successfully",user: loggedInUser})
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = profileRouter;