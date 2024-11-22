const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    email: {
        require: true,
        type: String,
        unique: true,
    },
    otp: {
        require: true,
        type: Number,
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        index: { expires: 60 * 5 }, // valid for 5 minutes
    },
});

const OTPModel =mongoose.models.otp || mongoose.model("otp", OTPSchema);
module.exports = {OTPModel};
