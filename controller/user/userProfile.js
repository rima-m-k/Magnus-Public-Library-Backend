const USER = require('../../model/userSchema')

async function userProfile (req,res) {
try {
  

    
    let userData = await USER.findOne({_id:req.ID},{password:0,_id:0})
    res.json({user:userData})


} catch (error) {  
    console.log(error);
    console.log("Internal server error")
    res.status(500).send({message: "Internal server error"}); 
  
}
}
module.exports ={
    userProfile
}