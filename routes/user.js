const router=require("express").Router()
const GetUserInfo=require('../controllers/getUserInfo')

router.get("/",async(req,res)=>{
    GetUserInfo(req,res)
})

module.exports=router