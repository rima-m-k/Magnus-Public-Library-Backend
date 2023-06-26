const GENRE = require("../../model/genreDataSchema");

const addGenre = async (req, res) => {
  try {
    let genreCode = req.body.genreCode.toUpperCase();
    let checkGenreName = await GENRE.findOne({
      genreName: { $regex: req.body.genreName, $options: "i" },
    });
    let checkGenreCode = await GENRE.findOne({
      genreCode: { $regex: genreCode, $options: "i" },
    });
    if (checkGenreName) {
      res.status(409).send({ message: "Genre name already exists" });
    } else {
      if (checkGenreCode) {
        res.status(409).send({ message: "Genre Code already exists" });
      } else {
        let newgenre = new GENRE({
          genreCode: genreCode,
          genreName: req.body.genreName,
          description: req.body.description,
          examples: [],
        });

        let x = await newgenre.save();
        res.status(201).send({ message: "Successfully added to database" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message:
        "An unexpected error occurred while processing your request. Please try again later ",
    });
  }
};

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
module.exports = {
  addGenre,
  viewGenre
};
