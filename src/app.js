const express = require("express")
const connectDB = require("./config/database")
const User = require("./models/user")
const app = express();

app.use(express.json())

app.post("/signup",async(req,res)=>{
    const body = req.body;
    const user = new User({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        age: body.age,
        gender: body.gender
    })
    
    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})


app.get("/feed",async(req,res)=>{
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send(error)
    }
})


app.get("/user",async(req,res)=>{
    const userEmail = req.body.email;
    try {
        const user = await User.find({email: userEmail})
        if(user.length === 0){
            res.status(404).send("User not found")
            return;
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.delete("/user",async(req,res)=>{
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId)
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.patch("/user",async(req,res)=>{
    const userId = req.body.userId;
    const body = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId,body, {
            returnDocument: "after",
            runValidators: true
        })
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

connectDB().then(()=>{
    app.listen(3000,()=>{
        console.log("listening at port 3000")
    })
}).catch((err)=>{
    console.log(err)
})