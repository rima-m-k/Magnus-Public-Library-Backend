
const BOOK = require("../../model/bookDataSchema");
const GENRE = require("../../model/genreDataSchema");
const AUTHOR = require("../../model/authorDataSchema");
const { mongoose } = require("mongoose");
const addBook = async (req, res) => {
  try {

    let callNumber,
      checkTitle,
      authorID = null,
      genreID = null,
      checkAuthor,
      genreCode,
      checkCode,
      newAuthor,
      checkGenreName,
      checkGenreCode,
      newGenre,
      hundreds,
      thousands,
      newBook,
      genreData;
    checkTitle = await BOOK.findOne({
      title: { $regex: req.body.title, $options: "i" },
    });
    if (checkTitle) {
      console.log("book name already exists");
      res.status(409).send({ message: "Book name already exists" });
    } else {
      //add new book
      if (req.body.author === "other") {
        checkAuthor = await AUTHOR.findOne({
          AuthorName: { $regex: req.body.newAuthorName, $options: "i" },
        });
        checkCode = await AUTHOR.findOne({
          AuthorCode: { $regex: req.body.newAuthorCode, $options: "i" },
        });
        if (checkAuthor) {
          console.log("author name already exists");
          res.status(409).send({ message: "author name already exists" });
        } else {
          if (checkCode) {
            console.log("author code already exists");
            res.status(409).send({ message: "author code already exists" });
          } else {
            newAuthor = new AUTHOR({
              AuthorName: req.body.newAuthorName,
              AuthorCode: req.body.newAuthorCode.toUpperCase(),
              Biography: req.body.newAuthorBiography,
              Nationality: req.body.newAuthorNationality,
              DateOfBirth: req.body.newAuthorDOB,
              DateOfDeath: req.body.newAuthorDOD,
            });
            authorID = await newAuthor.save();
            console.log("added author to db");
          }
        }
      } else {
        authorID = await AUTHOR.findById(req.body.author);
      }

      if (req.body.genre === "other") {
        genreCode = req.body.newGenreCode.toUpperCase();
        checkGenreName = await GENRE.findOne({
          genreName: { $regex: req.body.newGenreName, $options: "i" },
        });
        checkGenreCode = await GENRE.findOne({
          genreCode: { $regex: genreCode, $options: "i" },
        });
        if (checkGenreName) {
          console.log("genre name already exists");
          res.status(409).send({ message: "genre name already exists" });
        } else {
          if (checkGenreCode) {
            console.log("genre code already exists");
            res.status(409).send({ message: "genre code already exists" });
          } else {
            newGenre = new GENRE({
              genreCode: genreCode,
              genreName: req.body.newGenreName,
              description: req.body.newGenreDesc,
            });

            genreID = await newGenre.save();
            console.log("addes genre to db");
          }
        }
      } else {
        genreID = await GENRE.findById(req.body.genre);

        hundreds = Math.floor(100 + Math.random() * 900);
        thousands = Math.floor(1000 + Math.random() * 9000);
        callNumber =
          hundreds +
          "." +
          thousands +
          " " +
          authorID.AuthorCode +
          "/" +
          genreID.genreCode;
      }

      newBook = new BOOK({
        title: req.body.title,
        author: authorID._id,
        publisher: req.body.publisher,
        callNumber: callNumber,
        genre: genreID._id,
        publicationDate: req.body.publicationDate,
        synopsis: req.body.synopsis,
        copy: req.body.copy,
        pages: req.body.pages,
        image: req.files.frontCover[0].filename,
        avgRating:null,
        rating: []
      });
      newBook.save();
      console.log("added book to db");
      res.status(200).send({ message: " Added to Database" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message:
        "An unexpected error occurred while processing your request. Please try again later ",
    });
  }
};

const fetchBookAndGenres = async (req, res) => {
  try {
    let genreData = await GENRE.find();
    let authorData = await AUTHOR.find();
    res.status(200).send({ genreData, authorData,message: " Added to Database" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message:
        "An unexpected error occurred while processing your request. Please try again later ",
    });
  }
};
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

async function deleteBook (req,res) {
  try {
    console.log(req.body)
  } catch (error) {
    
  }
}

module.exports = {
  addBook,
  fetchBookAndGenres,
  viewBooks,
  deleteBook
};

