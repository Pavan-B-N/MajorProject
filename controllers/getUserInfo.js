const { SignupModel } = require("../models/signUpModel")

const GetUserInfo = async (req, res) => {
    try {
        const email = req.email;
        const user = await SignupModel.findOne({ email }, { name: 1, email: 1, phone: 1, profilePicture: 1, _id: 0 });
        console.log(user);
        res.status(200).json({ status: "success", user });
    } catch (err) {
        res.status(500).json({ status: "failed", reason: "Internal server error" });
    }
}

module.exports = GetUserInfo;