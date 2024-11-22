const mongoose=require("mongoose")

const CounterSchema=new mongoose.Schema({
    club:{
        type:String
    },
    seq:{
        type:Number
    }
})
const CounterModel=mongoose.model("counter",CounterSchema)

module.exports={CounterModel}