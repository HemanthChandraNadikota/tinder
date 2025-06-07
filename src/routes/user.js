const express = require("express")
const {userAuth} = require("../middlewares/auth")
const userRouter = express.Router()
const ConnectionRequestModel = require("../models/conenctionRequests")

userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId","firstName lastName photoUrl age gender")
        res.status(200).send({ message: "Connection requests", connectionRequests})
    } catch (error) {
        res.status(500).send(error.message)
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequestModel.find({
            $or: [{fromUserId: loggedInUser._id, status: "accepted"}, {toUserId: loggedInUser._id, status: "accepted"}]
        }).populate("fromUserId","firstName lastName photoUrl age gender").populate("toUserId","firstName lastName photoUrl age gender")

        const connectionrequests = connections.map(connection=>{
            if(connection.fromUserId.equals(loggedInUser._id)){
                return connection.toUserId
            }
            return connection.fromUserId
        })

        res.status(200).send({ message: "Connections", data: connectionrequests})
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = userRouter