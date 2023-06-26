
const STAFF = require('../../model/staffDataSchema')

async function profile(req,res){
    console.log(req.ID)
 const staff = await STAFF.findOne({_id:req.ID},{password:0}).populate("designationID")
console.log(staff) 
 res.json(staff)
}
module.exports ={
    profile 
}