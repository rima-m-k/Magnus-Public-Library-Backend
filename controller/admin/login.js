const STAFFDATA = require("../../model/staffDataSchema");
const DESIGNATION = require("../../model/designationSchema");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const login = async (req, res) => {
    try {


        let email = req.body.email.trim();
        let password = req.body.password.trim();
        // let designationID = req.body.designationID.trim();
        const createToken = (id) => {
            return jwt.sign({ id }, process.env.SECRET_KEY)
        }
        let staff = await STAFFDATA.findOne({ email: email }).populate("designationID");
        if (staff.length === 0) { 
            res.status(401).send({ message: "Email not found" });
        } else {


            let comparepassword = await bcrypt.compare(password, staff.password)
            if (email === staff.email) {
                if (comparepassword) {
if(staff.isBlocked){
    res.status(401).send({ message: "Blocked" });

}else{
    const token = createToken(staff._id)
    res.json({
        token: token,
        designationID:staff.designationID.designationId,
        message: "logged in successfully"
    });
}


                       

                   
                } else {
                    res.status(401).send({ message: "invalid password" });
                }
            } else {
                res.status(401).send({ message: "email not found" });
            }

            // catch ((error) => {
            // res.status(500).send({ message: "error comparing password" });
            // });
        }
    } catch (error) {
        console.log("Internal server error")
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
    }
};
module.exports = login;
