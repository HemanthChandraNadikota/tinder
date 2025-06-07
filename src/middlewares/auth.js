const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async(req,res,next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).send({message: "Unauthorized"})
        }
        const decoded = await jwt.verify(token,"HEMDEVTINDER")
        const {_id} = decoded;
        const user = await User.findById(_id)
        if(!user){
            throw new Error("Unauthorized")
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).send(error.message)
    }        
}

module.exports = {userAuth};