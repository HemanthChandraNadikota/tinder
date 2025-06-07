const express = require("express")
const requestsRouter = express.Router()
const {userAuth} = require("../middlewares/auth")
const ConnectionRequestModel = require("../models/conenctionRequests")
const UserModel = require("../models/user")

requestsRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const {toUserId,status} = req.params;

        const ALLOWED_STATUS = ["interested","ignored"]
        if(!ALLOWED_STATUS.includes(status)){
            throw new Error("Invalid status")
        }

        const ifUserExists = await UserModel.findById(toUserId)
        if(!ifUserExists){
            throw new Error("User not found")
        }
        
      
        if(toUserId === loggedInUser._id){
            throw new Error("You cannot send request to yourself")
        }
        const existingRequest = await ConnectionRequestModel.findOne({
            $or: [
                {fromUserId: loggedInUser._id, toUserId: toUserId},
                {fromUserId: toUserId, toUserId: loggedInUser._id}
            ]
        })
        if(existingRequest){
            throw new Error("Request already sent")
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId: loggedInUser._id,
            toUserId: toUserId,
            status: status,
        })
        await connectionRequest.save()
        res.status(200).send({message: `${loggedInUser.firstName} ${status} ${ifUserExists.firstName} successfully`,connectionRequest})
    } catch (error) {
        res.status(500).send(error.message)
    }
})


requestsRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const {status,requestId} = req.params;
        const ALLOWED_STATUS = ["accepted","rejected"]
        if(!ALLOWED_STATUS.includes(status)){
            throw new Error("Invalid status")
        }
       
        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if(!connectionRequest){
            return res.status(404).send({
                message: "Request not found"
            })
        }

        connectionRequest.status = status;
        await connectionRequest.save()
        res.status(200).send({message: `${loggedInUser.firstName} ${status} successfully`,connectionRequest})
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = requestsRouter;