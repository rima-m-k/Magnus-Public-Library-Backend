 const  Razorpay = require('razorpay')

  const  instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
  });
  console.log(process.env.RAZORPAY_API_KEY)


  module.exports = instance;