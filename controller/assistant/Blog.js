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
  module.exports ={
    getBlogData
  }