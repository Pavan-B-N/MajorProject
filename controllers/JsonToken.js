const jwt=require("jsonwebtoken")
function GenerateJsonWebToken(email){
    const token=jwt.sign(
        {email:email},
        process.env.JSON_WEB_TOKEN_CRYPTO_SECRET_KEY,
        // {expiresIn:'24h'}
    )
    return token
}
module.exports={GenerateJsonWebToken}