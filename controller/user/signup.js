const USERDATA = require("../../model/userSchema");
const bcrypt = require("bcrypt");
const { sendOTP } = require("../../OTP_verification/OTP_verification");
const jwt = require("jsonwebtoken");

async function userSignup(req, res) {
  try {
    if (req.body.name && req.body.email && req.body.password && req.body.cpassword) {
      let checkUser = await USERDATA.findOne({ email: req.body.email });
      if (checkUser) {
        res
          .status(401)
          .send({
            message:
              "This email address is already taken. Please try again with a different email address or log in if this is your account",
          });
      } else {
        //send otp
        const OTP = await sendOTP(req.body.email);
        req.session.OTP = OTP;
        res.status(200).send({ message: "OTP sent successfully" })


      }
    } else {
      res
        .status(401)
        .send({
          message:
            "Cannot Contain Empty Fields"
        });
    }
    //   name: 'Rima M K',
    // email: 'rimamethalamkandy@gmail.com',   
    // password: 'Login@123',
    // cpassword: 'Login@123',
    // otp: ''

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function verifyOTP(req, res) {
  try {
    const createToken = (id) => {
      return jwt.sign({ id }, process.env.SECRET_KEY);
    };
    let docNo = await USERDATA.countDocuments({})
    console.log(docNo, "doc no")
    // let cardNumber = 10000 + docNo
    // Check if the received OTP is valid
    if (req.body.otp === req.session.OTP) {
      // Create a new user
      const user = new USERDATA({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        index: docNo+1
      });

      const savedUser = await user.save();

      console.log(savedUser)
      // Check if the user was saved successfully
      if (savedUser) {
        const token = createToken(savedUser._id);
        req.session.userID = savedUser._id

        res.json({ message: "User registered successfully", token: token, userName: savedUser.name });
      } else {
        console.log("Failed to save user")
        res.status(500).send({ message: "Failed to save user" });
      }
    } else {
      // Send an error response to the client
      console.log("Invalid OTP")
      res.status(401).send({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.log(error);
    console.log("Internal server error")
    res.status(500).send({ message: "Internal server error" });
  }
}

module.exports = { userSignup, verifyOTP };