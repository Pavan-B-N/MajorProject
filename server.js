const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config();

const port=process.env.PORT || 4000
const cors = require('cors');
const connection=require("./controllers/mongodb")

//middlewares
app.use(express.json())
app.use(cors({
    origin: '*',
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/',(req,res)=>{
    res.status(200).send('<h1>Kang Node JS Server</h1>')
})

//routes management
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const {VerifyJWT}=require('./controllers/VerifyJWT')

app.use("/auth", authRoute);
app.use("/user",VerifyJWT, userRoute);

app.listen(port,()=>{
    console.log(`Running server at http://localhost:${port}`)
})