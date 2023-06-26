const express = require("express"); 
const { userLogin } = require("../controller/user/login");
const { userSignup,verifyOTP } = require("../controller/user/signup");
const router = express.Router();
const upload = require('../fileUploadHelper/ImageHandler');
const { fetchBook,fetchSingleBook } = require("../controller/user/Book");
const {requireAuth} = require("../middlewares/authenticateUser");
const { search } = require("../controller/user/search");
const { userProfile } = require("../controller/user/userProfile");
const { libraryCard } = require("../controller/user/libraryCard");
const { allEvents, fetchSingleEvent, bookEvent, payment } = require("../controller/user/Event");
const { fetchBlog } = require("../controller/user/Blog");
const { addReview, placeHold } = require("../controller/user/Book");
router.route('/viewBooks').get(fetchBook)
router.route(`/books/:id`).get(fetchSingleBook).patch( requireAuth ,addReview)
router.route('/userSignup').post(userSignup).put(verifyOTP)
router.route('/userLogin').post(userLogin) 
router.route('/placeHold').post(requireAuth,placeHold)
router.route('/search').post(search)
router.route('/profile').get(requireAuth,userProfile)
router.route('/LibraryCardApplication').post(requireAuth,upload.single("file"),libraryCard)
router.route('/allEvents').get(allEvents)
router.route('/community').get(fetchBlog)
router.route(`/viewEvent/:id`).get(fetchSingleEvent)
router.route('/bookEvent').post(requireAuth,bookEvent)
router.route('/payment').post(payment)
// router.route('/bookEvent').get(allEvents)
 






 
module.exports = router

