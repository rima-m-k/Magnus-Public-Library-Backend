const search =(req,res) =>{
    try {
        console.log(req.body.term)
        
    } catch (error) {
        console.log(error);
        console.log("Internal server error")
        res.status(500).send({message: "Internal server error"});
      
    }


}
module.exports ={
    search
}  