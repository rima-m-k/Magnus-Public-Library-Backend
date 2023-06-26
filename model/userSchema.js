const mongoose = require("mongoose");

const userData = new mongoose.Schema({
    name: {
        type:String
    },
    email: {
        type: String,
        
    },
    password: {
        type: String,
        
    },
    libraryCardNumber:String,
    address:[{
        address1:{  
            type:String
        },
        address2:{
            type:String
        },city:{
            type:String
        },state:{
            type:String
        },pincode:{
            type:Number
        }
    }],
    profilePhoto:String,
    cardNumber:String,
    index:Number,
    issuedOn:{
        type:Date,
    },
})

const UserData = new mongoose.model("userData", userData)
module.exports = UserData