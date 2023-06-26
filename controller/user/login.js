const bcrypt = require("bcrypt");
const USERDATA = require("../../model/userSchema");
const jwt = require("jsonwebtoken");

async function userLogin(req, res) {
   
  try {
    const createToken = (id) => {
      return jwt.sign({ id }, process.env.SECRET_KEY);
    };
    const user = await USERDATA.findOne({ email: req.body.email });
    if (user) {
      const checkPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (checkPassword === true) {
        const token = createToken(user._id);

        req.session.userID=user._id
        console.log(req.session)
        res.json({
          token: token,
          userName:user.name,
          message: "logged in successfully",
        });
      } else {
        res.status(401).send({ message: "invalid  password" }); 
      }
    } else {
      res.status(401).send({ message: "email not registered" });
    }
  } catch (err) {
    console.log(error);
      console.log("Internal server error")
      res.status(500).send({message: "Internal server error"});
    
  }
}
module.exports = { userLogin };
