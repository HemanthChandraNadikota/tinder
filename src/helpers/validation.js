const validator = require("validator")

const validateSignUpData = (req)=>{
    const body = req.body;
    const {firstName,lastName,email,password} = body;

    if(!firstName || !lastName || !email || !password){
        throw new Error("All fields are required")
    }

    if(password.length < 5){
        throw new Error("Password must be at least 5 characters long")
    }

    if(!validator.isEmail(email)){
        throw new Error("Invalid email")
    }
}

module.exports = {validateSignUpData}