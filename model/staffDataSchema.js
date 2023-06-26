const mongoose = require("mongoose");
const Designation = require('./designationSchema');

const staffData = new mongoose.Schema({
    designationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Designation,
        
    },
    firstName: {
        type: String,
        
    },
    lastName: {
        type: String,
        
        
    },
    email: {
        type: String,
        
    },
    password: {
        type: String,
        
    },
    image: {
        type: String,

    },
    isBlocked: {
        type: Boolean,
        default:false
    }
})

const StaffData = new mongoose.model("staffData", staffData)
module.exports = StaffData