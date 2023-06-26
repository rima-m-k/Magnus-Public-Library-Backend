const mongoose = require("mongoose");


const designations = new mongoose.Schema({
    designationId:{
        type:String,
    },
    designation : {
        type : String,
    },
   
})

const Designations = new mongoose.model("designations", designations)
module.exports = Designations