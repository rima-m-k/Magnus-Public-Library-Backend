const mongoose = require('mongoose');
const STAFFDATA = require('../../model/staffDataSchema');
const DESIGNATION = require('../../model/designationSchema');
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

const addEmployee = async (req,res) => {
    try{
    const randomPassword = `${Math.floor(1000 + Math.random() * 9000)}`;


        let currentDesignation=null
        let assistant= await STAFFDATA.find({email:req.body.email})
        console.log(assistant)
        if(assistant===[] && assistant[0].email=== req.body.email){
            res.status(409).send({message:"email already in use"})
}else{
    if (req.body.designation === 'addDesignation') {

        let newDesignation = new DESIGNATION({
            designatinId: req.body.newDesignation,
          designation: req.body.newDesignationID,
        });
        currentDesignation = await newDesignation.save();
      }else{
         currentDesignation = await DESIGNATION.findById(req.body.designation) 
    }
    
if(currentDesignation !== null){
    
    let newstaff = new STAFFDATA({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password:await bcrypt.hash(randomPassword, 10),

        designationID: currentDesignation._id
    });
    
    //   sending mail
      var transporter = nodemailer.createTransport({
        service: " gmail",
        auth: {
          user: "magnuspubliclibrary@gmail.com",
          pass: "nxeddjugqenzjnkn", 
        },
      });
      var mailOptions = {
        from: "magnuspubliclibrary@gmail.com",
        to: req.body.email,
        subject: " Password For Login",
        text: `${randomPassword} `,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
         let  message= "Email doesn't exist"
          return  message
    } else {
      console.log("Email sent" + info.response);
      console.log(randomPassword);
       newstaff.save();
       res.status(201).send({message:"Registration Successful"})
      
    }
      })
    //   email done

}else{
    res.status(500)
}

}
}catch(error){
    console.log(error);
    res.status(500)
}

} 

const getEmployee = async (req,res) => {
  try {
    let designation = await DESIGNATION.find({})
    res.json(designation);
    
  } catch (error) {
    console.log(error);
    console.log("Internal server error")
    res.status(500).send({message: "Internal server error"});
  
  }
}
async function viewEmployee(req, res) {
  try {
    let employeeData = await STAFFDATA.find({}).populate('designationID')
    res.json(employeeData);
  } catch (error) {
    console.log(error);
    console.log("Internal server error");
    res.status(500).send({ message: "Internal server error" });
  }
}

async function blockUnblock(req, res) {
  try {
console.log(req.body) 
    // Add validations here
    if (!req.body.ID) {
      return res.status(400).send({ message: "Invalid employee ID" });
    }

    const employee = await STAFFDATA.findById(req.body.ID);
    if (!employee) {
      return res.status(404).send({ message: "Employee not found" });
    }
 
    // Toggle the status
    employee.isBlocked = !req.body.status;
    await employee.save();

    return res.status(200).send({employees:employee, message: "Employee status updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
}

 
module.exports = {addEmployee , getEmployee,viewEmployee,blockUnblock};