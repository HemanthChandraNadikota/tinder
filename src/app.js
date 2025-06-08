require("dotenv").config()

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
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestsRouter = require("./routes/requests")
const userRouter = require("./routes/user")
const cors = require("cors")


app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestsRouter)
app.use("/",userRouter)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.message || 'Something went wrong!');
});

connectDB().then(()=>{
    app.listen(3000,()=>{
        console.log("listening at port 3000")
    })
}).catch((err)=>{
    console.log(err)
})