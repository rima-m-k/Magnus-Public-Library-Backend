const mongoose =require("mongoose");

const libraryData = new mongoose.Schema({
    gallery:Array,
    venue:Array
})
 const library = new mongoose.model("libraryData",libraryData)


 module.exports = library