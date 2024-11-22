const mongoose=require("mongoose")

const SignupSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:""
    }
})

const SignupModel = mongoose.models.users || mongoose.model("users", SignupSchema);

module.exports={SignupModel}