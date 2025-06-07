const express = require("express")
const {userAuth} = require("../middlewares/auth")
const userRouter = express.Router()
const ConnectionRequestModel = require("../models/conenctionRequests")
const UserModel = require("../models/user")

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

userRouter.get("/feed",userAuth, async(req,res)=>{

    try {
      // need to remove the users who are already in the connections or ignored
      // need to remove the users who have sent request to the logged in user
      // need to remove the users who have received request from the logged in user
      // need to remove the same user from the list

      const loggedInUser = req.user;
      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;

      limit = limit > 10 ? 10 : limit;
      
      const connectionRequests = await ConnectionRequestModel.find({
        $or: [
            {fromUserId: loggedInUser._id},
            {toUserId: loggedInUser._id}
        ]
      }).select("fromUserId toUserId").populate("fromUserId","firstName lastName photoUrl age gender").populate("toUserId","firstName lastName photoUrl age gender")

      const hideUsers = new Set()

      connectionRequests.forEach(request=>{
        hideUsers.add(request.fromUserId._id)
        hideUsers.add(request.toUserId._id)
      })

      const feedUsers = await UserModel.find({
        $and : [
            {_id : {$nin: Array.from(hideUsers)}},
            {_id : {$ne: loggedInUser._id}}
        ]
      }).select("firstName lastName photoUrl age gender").skip((page - 1) * limit).limit(limit)

      res.status(200).send({message: "Feed users", data: feedUsers})

    } catch (error) {
        res.status(500).send({message: error.message})
    }
})

module.exports = userRouter