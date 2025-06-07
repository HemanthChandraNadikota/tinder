const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    status: {
        type: String,
        enum: {
            values: ["rejected", "accepted", "ignored", "interested"],
            message: "{VALUE} is not a valid status",
        },
        default: "interested",
        required: true,
    },
},{
    timestamps: true,
})

connectionRequestSchema.index({fromUserId: 1, toUserId: 1})

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    //check if from and to user are same
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send request to yourself")
    }
    next()
})

const ConnectionRequestModel = mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports = ConnectionRequestModel;