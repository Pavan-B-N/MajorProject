const router=require("express").Router()

const {SignUp}=require("../controllers/Signup")
const {Login}=require("../controllers/Login")
const {VerifyOTPAndCreateAccount}=require("../controllers/VerifyOTPAndCreateAccount")

router.post("/signup",async(req,res)=>{
    SignUp(req,res)
})

router.post("/login",(req,res)=>{
    Login(req,res)
})

router.post('/verify-otp-create-account',(req,res)=>{
    VerifyOTPAndCreateAccount(req,res)
})
module.exports=router