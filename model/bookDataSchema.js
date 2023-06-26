const mongoose = require("mongoose");
const GENRE = require("./genreDataSchema");
const AUTHOR = require("./authorDataSchema");
const USER = require("./userSchema")
const bookData = new mongoose.Schema({
  title: {
    type: String,
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: AUTHOR,
  },
  publisher: {
    type: String,
  },
  callNumber: {
    type: String,
  },
  genre: {
    type: mongoose.Types.ObjectId,
    ref: GENRE,
  },
  publicationDate: {
    type: String,
  },
  synopsis: {
    type: String,
  },
  copy: Number,
  onHold: {
    type: Number,
    default: 0,
  },
  borrowed: {
    type: Number,
    default: 0,
  },
  onLoan: Number,
  image: {
    type: String,
  },
  pages: {
    type: String,
  },
  avgRating:Number,
  isDeleted:Boolean,
  rating: [{
    star: Number, 
    review: String,
    user: {
      type: mongoose.Types.ObjectId,
      ref: USER
    }
  }],
});

const BookData = new mongoose.model("bookData", bookData);
module.exports = BookData;
