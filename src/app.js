const express = require("express")

const app = express();

app.use("/test",(req,res)=>{
   res.send("Namaste")
})

app.listen(3000,()=>{
    console.log("listening at port 3000")
})