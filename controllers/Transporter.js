//handlebar setup
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
const hbsOptions={
    viewEngine:{
        extName:'.handlebars',
        partialsDir:path.resolve("./views"),
        defaultLayout:false,
    },
    viewPath:path.resolve("./views"),
    extName:".handlebars"
}

const nodemailer=require("nodemailer")
const user=process.env.EMAIL_USERNAME;
const pass=process.env.EMAIL_PASSWORD

const transporter=nodemailer.createTransport(
    {
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        service:"gmail",
        auth:{
            user,
            pass
        }
    }
);
transporter.use("compile", hbs(hbsOptions))

module.exports=transporter