const nodemailer = require('nodemailer')

function sendOTP(email) {
  const OTP = `${Math.floor(100000 + Math.random() * 9000)}`;
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "magnuspubliclibrary@gmail.com",
        pass: "nxeddjugqenzjnkn",
      },
    });
    const mailOptions = {
      from: "magnuspubliclibrary@gmail.com",
      to: email,
      subject: "otp for registration",
      text: `${OTP}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject("Error sending email");
      } else {
        console.log("Email sent" + info.response);
        console.log(OTP);
        resolve(OTP);
      }
    });
  });
}


    module.exports = {sendOTP }