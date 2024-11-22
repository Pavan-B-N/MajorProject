const transporter = require("./Transporter")

async function SendOTP(to, otp) {
    const mailOptions = {
        from: `Kang ${process.env.EMAIL_USERNAME}`,
        subject:"OTP Verification",
        to: to,
        template:"OTP",//handlebar name
        context: {
            otp
        }
    }
    const promise = new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err){
                reject(err)
            }
            else{
                resolve(info)
            }
        })
    })
    return promise;

}
module.exports = {SendOTP};