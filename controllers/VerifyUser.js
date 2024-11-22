const validator = require("validator")
const bcryt = require("bcrypt")

const { SignupModel } = require("../models/signUpModel")

const VerifyUser = (email, password, req, res) => {
    let user;
    //validate email or reva id
    if (!(validator.isEmail(email))) { 
        return res.status(405).json({ status: 'failed', reason: 'invalid email', allowed: "email or reva id" })
    }


    const promise = new Promise(async (resolve) => {

        try {
            user = await SignupModel.findOne({ email: email })
            // console.log(user)
            if (!user) {
                return res.status(404).json({ status: "failure", reason: "User Not Found" })
            }
            else {
                var isVerified
                try {
                    isVerified = await bcryt.compare(password, user.password)
                    // console.log(isVerified)
                } catch (err) {
                    return res.status(501).json({ status: "failure", reason: "bcrypt error" })
                }

                console.log('isVerified',isVerified)
                if (isVerified) {
                    resolve(user)
                } else {
                    return res.status(403).json({ status: "failure", reason: "wrong password" })
                }
            }
        } catch (err) {
            return res.status(501).json({ status: "failure", reason: "internal server error" })
        }

    })
    return promise
}

module.exports = { VerifyUser }