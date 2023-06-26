const mongoose = require("mongoose");
const BOOK = require("./bookDataSchema")
const USER = require("./userSchema")
const onHold = new mongoose.Schema({
    books:[{
        bookID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:BOOK
        },
         date : {
            type : String,
        },
    }],
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref:USER
    },
   
    
})
const OnHold = new mongoose.model("onHold", onHold)
module.exports = OnHold