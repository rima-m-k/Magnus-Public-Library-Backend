const express = require("express");
const router = express.Router();
const { authenticateStaff } = require("../middlewares/authenticateAsst"); 

const upload = require('../fileUploadHelper/ImageHandler')
const {addBook,fetchBookAndGenres, viewBooks, deleteBook} = require('../controller/assistant/Book')
 const {addAuthor, getAuthorData} = require('../controller/assistant/Author');
const { addGenre, viewGenre } = require("../controller/assistant/Genre");
const { getBlogData } = require("../controller/assistant/Blog");


router.route('/addBook').get(authenticateStaff,fetchBookAndGenres).post(authenticateStaff,upload.fields([{ name: 'frontCover', maxCount: 1}]),addBook )
router.route('/addAuthor').post(authenticateStaff,addAuthor)
router.route('/addGenre').post(authenticateStaff,addGenre);
router.route('/viewAuthors').get(authenticateStaff,getAuthorData)
router.route('/viewBooks').get(authenticateStaff,viewBooks)
router.route('/viewGenre').get(authenticateStaff,viewGenre)
router.route('/viewBlog').get(authenticateStaff,getBlogData)
router.route('/deleteBook').patch(authenticateStaff,deleteBook)










module.exports = router

