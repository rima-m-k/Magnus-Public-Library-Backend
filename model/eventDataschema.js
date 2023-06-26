const mongoose = require("mongoose");
const USER = require('./userSchema')

const event = new mongoose.Schema({
   name: String,
   description: String,
   host: String,
   date: Date,
   startTime: String,
   endTime: String,
   fees: Number,
   status: String,
   totalSeat: Number,
   availableSeat:Number,
   venue: String,
   banner: String,
   guests: [{
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: USER
      },
      ticketCount: Number,
      timeOfBooking: Date,
      amountPaid: Number,
      orderID:String,
      paymentStatus: {
         type: String,
         default: 'Pending'
      },
      paymentDetails:Array
   }]

})

const Events = new mongoose.model("events", event)
module.exports = Events