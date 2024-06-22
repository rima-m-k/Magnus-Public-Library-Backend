const BLOG = require('../../model/BlogDataSchema')

async function fetchBlog(req,res) {
    try {
         const blogs = await BLOG.find().populate("staffId userId")
         res.json(blogs)
    } catch (error) {
        console.log(error)
        console.log("Internal server error")
        res.status(500).send({message: "Internal server error"}); 
         
    }
}

async function fetchSingleBlog(req,res) {
    try {
         const blog = await BLOG.find({_id:req.params.id}).populate("staffId userId")
         res.json(blog)
    } catch (error) {
        // console.log(error)
        console.log("Internal server error")
        res.status(500).send({message: "Internal server error"}); 
         
    }
}
module.exports ={
    fetchBlog,
    fetchSingleBlog
}