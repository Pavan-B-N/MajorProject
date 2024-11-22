const { OTPModel } = require("../models/OTPModel")
const { SignupModel } = require("../models/signUpModel")
const {SendOTP} = require('../controllers/SendOTP')

const validator = require("validator")
const bcrypt = require("bcrypt")


const SignUp = async (req, res) => {
    const { name, email, phone, password } = req.body
    console.log(email)
    if (!(name) || !(email) || !(phone) || !(password)) {
        return res.status(501).json({ status: 'failed', reason: 'please provide all required data' })

    }
    //validate email or reva id
    if (!(validator.isEmail(email))) {
        return res.status(405).json({ status: 'failed', reason: 'invalid email', allowed: "email" })
    }

    //validate phone number
    if (!(phone.length === 10)) {
        return res.status(405).json({ status: 'failed', reason: 'invalid phone number' })
    }

    //validate password
    if ((password.length) < 8) {
        return res.status(405).json({ status: 'failed', reason: 'password should contain atleast 8 characters' })
    }

    const user = await SignupModel.findOne({ email })

    if (user) {
        return res.status(403).json({ status: 'failed', reason: 'User Exists' })
    }

    //otp part
    try {
        const isOTPExists=await OTPModel.findOne({email})
        if(isOTPExists){
            console.log(isOTPExists)
            return res.status(200).json({ status: 'success', reason: 'Use the OTP,Already Sent' })
        }
        const otp = genOTP();
        const instance = new OTPModel({email, otp })
        const doc = await instance.save();

        
        await SendOTP(email, otp)
        res.status(200).json({ status: "success", message: "OTP Sent Successfully"})
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: 'failed', reason: 'Failed to send OTP' })
    }
}

function genOTP() {
    let otp = Math.ceil(Math.random() * 1000000);
    while (otp.toString().length != 6) {
        otp = Math.ceil(Math.random() * 1000000)
    }
    return otp;
}
module.exports = { SignUp }