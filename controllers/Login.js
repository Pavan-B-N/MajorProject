const { GenerateJsonWebToken } = require("../controllers/JsonToken")
const { VerifyUser } = require("../controllers/VerifyUser")


async function Login(req, res) {
    const { email, password } = req.body

    //check whether email and passwords are received properly
    if(!email || !password){
        return res.status(405).json({status:"failed",reason:"please provide email and password"})
    }

    var user = await VerifyUser(email, password,req,res);

    const accessToken = GenerateJsonWebToken(user.email)
    const credentials={
        _id:user._id,
        name:user.name,
        email:user.email,
        profilePicture:user.profilePicture,
        phone:user.phone,
    }
    res.status(200).json({status:"success", accessToken, credentials })

}
module.exports = { Login }