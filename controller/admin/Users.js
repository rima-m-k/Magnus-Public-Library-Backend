const USERS = require('../../model/userSchema')

async function viewUsers(req, res) {
    try {
      let userData = await USERS.find({});
      res.json(userData);
    } catch (error) {
      console.log(error);
      console.log("Internal server error");
      res.status(500).send({ message: "Internal server error" });
    }
  }
  module.exports ={
    viewUsers
  }