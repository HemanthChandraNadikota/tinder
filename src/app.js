const express = require("express")
const connectDB = require("./config/database")
const User = require("./models/user")
const app = express();
const {validateSignUpData} = require("./helpers/validation")
const bcrypt = require("bcrypt")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const {userAuth} = require("./middlewares/auth")

app.use(express.json())
app.use(cookieParser())

app.post("/signup",async(req,res)=>{
    try {
        validateSignUpData(req)
        req.body.password = await bcrypt.hash(req.body.password,10)
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        });
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;

        if(!validator.isEmail(email)){
            throw new Error("Invalid email")
        }

        const user = await User.findOne({email})

        if(!user){
            throw new Error("User not found")
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password)

        if(!isPasswordCorrect){ 
            throw new Error("Invalid password")
        }

        const token = jwt.sign({ _id: user._id},"HEMDEVTINDER", {expiresIn: "1d"})

        res.cookie("token",token,{
            httpOnly: true, 
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        })

        res.status(200).send({message: "Login successful"})
        
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.get("/profile",userAuth,async(req,res)=>{
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

app.post("sendConnectionRequest",userAuth,async(req,res)=>{
    try {
        const user = req.user;
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

connectDB().then(()=>{
    app.listen(3000,()=>{
        console.log("listening at port 3000")
    })
}).catch((err)=>{
    console.log(err)
})