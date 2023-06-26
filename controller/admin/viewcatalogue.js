const AUTHOR = require("../../model/authorDataSchema");
const BOOK = require("../../model/bookDataSchema");
const GENRE = require("../../model/genreDataSchema");

async function getAuthorData(req, res) {
  try {
    let authors = await AUTHOR.find();
    res.json(authors);
  } catch (error) {
    console.log(error);
    console.log("Internal server error");
    res.status(500).send({ message: "Internal server error" });
  }
}

async function viewGenre(req, res) {
  try {
    let genreData = await GENRE.find({});
    res.json(genreData);
  } catch (error) {
    console.log(error);
    console.log("Internal server error");
    res.status(500).send({ message: "Internal server error" });
  }
}

async function viewBooks(req, res) {
  try {
    let bookData = await BOOK.find().populate("author genre");
    res.json(bookData);
  } catch (error) {
    console.log(error);
    console.log("Internal server error");
    res.status(500).send({ message: "Internal server error" });
  }
}

module.exports = {
  getAuthorData,
  viewBooks,
  viewGenre,
};
