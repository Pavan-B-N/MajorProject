const {SignupModel}=require("../models/signUpModel")
const {OTPModel}=require("../models/OTPModel")
const { GenerateJsonWebToken } = require("../controllers/JsonToken")

const validator=require("validator")
const bcrypt=require("bcrypt")

const VerifyOTPAndCreateAccount=async(req,res)=>{
    const {name,email,phone,password,otp}=req.body
    if(!(name) || !(email) || !(phone) || !(password) || !(otp)){
        return res.status(501).json({status:'failed',reason:'please provide all required data'})
    }
    //validate email or reva id
    if(!(validator.isEmail(email))){
        return res.status(405).json({status:'failed',reason:'invalid email',allowed:"email"})
    }

    //validate phone number
    if(!(phone.length===10)){
        return res.status(405).json({status:'failed',reason:'invalid phone number'})
    }

    //validate password
    if((password.length)<8){
        return res.status(405).json({status:'failed',reason:'password should contain atleast 8 characters'})    
    }

    const isUserExists=await SignupModel.findOne({email})

    if(isUserExists){
        return res.status(403).json({status:"failed",reason:"User Exists"})
    }


    //verifyOTp
    try {
        var doc = await OTPModel.findOne({ email })
        console.log("doc",doc)
        if (!doc) {
            return res.status(403).json({status:"failed",reason:"Please Send OTP to verify your account"})
        }
    } catch (err) {
        console.log(err)
        return res.status(406).json({status:"failed",reason:"Please provide valid email"})
    }

    if (doc.otp != otp) {
        return res.status(401).json({status:"failed",reason:"Invalid OTP"})
    }

    const hashedPassword=await bcrypt.hash(password,10)
    const user=new SignupModel({
        email,
        name,
        phone,
        password:hashedPassword,
    })
    try{
        user.save()

        const accessToken = GenerateJsonWebToken(user.email)
        const credentials={
            _id:user._id,
            name:user.name,
            email:user.email,
            profilePicture:user.profilePicture,
            phone:user.phone,
        }
        res.status(200).json({status:"success", accessToken, credentials })

    }catch(err){
        res.send("err")
    }
}
module.exports={VerifyOTPAndCreateAccount}