const jwt = require("jsonwebtoken")
const { SignupModel } = require("../models/signUpModel")

const VerifyJWT = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        return res.status(404).json({ status: "failed", reason: "header not found" })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JSON_WEB_TOKEN_CRYPTO_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(502).json({ status: "failed", reason: "internal server error", err })
        }
        req.email = decoded.email
        next()
    })
}
module.exports = { VerifyJWT }