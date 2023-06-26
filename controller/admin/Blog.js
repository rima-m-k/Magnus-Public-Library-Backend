const BLOG = require('../../model/BlogDataSchema')
let STAFF = require('../../model/staffDataSchema')

const sharp = require("sharp");
async function addBlog(req, res) {
  try {
    console.log(req.body)
    console.log(req.file)
    let checkBlog = await BLOG.findOne({ title: req.body.title })
    const staff = await STAFF.findOne({ email: 'rimamethalamkandy@gmail.com' })

    if (checkBlog) {
      res.status(409).send({ message: "Blog with same name already exists" })
    } else {
       
              const newBlog = new BLOG({
                title: req.body.title,
                bannerImage: req.file.filename,
                content: req.body.content,
                PublishDate: Date.now(),
                viewCount: 0,
                authorType: 'staff',
                staffId: staff._id


              })
              newBlog.save();
              res.status(200).send({ message: "Blog added successfully" })
            
          }
        

    }

   catch (error) {
    console.log(error.message);
    console.log("Internal server error")
    res.status(500).send({ message: "Internal server error" });

  }
}

async function getBlogData(req, res) {
  console.log(req.body)
  try {
    let blogs = await BLOG.find();
    res.json(blogs);
  } catch (error) {
    console.log(error);
    console.log("Internal server error");
    res.status(500).send({ message: "Internal server error" });
  }
}
module.exports = {
  addBlog,
  getBlogData
}