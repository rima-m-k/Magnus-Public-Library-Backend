const mongoose = require("mongoose");
let STAFF = require('./staffDataSchema')
let USER = require('./userSchema')
const blog = new mongoose.Schema({
    title:String,
    bannerImage : String,
    content :String,
    viewCount:Number,
    PublishDate:Date,
    authorType: {
        type: String,
        required: true,
        enum: ['staff', 'user']
      }
    }, 
    { discriminatorKey: 'authorType' });
    const staffDataSchema = new mongoose.Schema({
        staffId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: STAFF
        }
      });
      
      const userDataSchema = new mongoose.Schema({
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: USER
        }
      });
      
   

const Blog = new mongoose.model("blog", blog)

Blog.discriminator('staff', staffDataSchema);
Blog.discriminator('user', userDataSchema);

module.exports = Blog