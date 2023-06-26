const express = require("express");
const router = express.Router();
const login = require("../controller/admin/login");
const { authenticateStaff } = require("../middlewares/authenticateAdmin"); 
const {addEmployee ,getEmployee, blockUnblock} = require("../controller/admin/Employee");
const {getAuthorData,viewGenre,viewBooks}= require('../controller/admin/viewcatalogue');
const { getBookData, userSearch, checkout, renewBook, returnBook } = require("../controller/admin/Book");
const { viewEmployee } = require("../controller/admin/Employee");
const { viewUsers } = require("../controller/admin/Users");
const { getCheckoutData } = require("../controller/admin/Book");
const { addEvent, fetchVenue, getEventData } = require("../controller/admin/Event");
const { addVenue } = require("../controller/admin/Venue");
const upload = require("../fileUploadHelper/ImageHandler");
const { addBlog, getBlogData } = require("../controller/admin/Blog");
const { profile } = require("../controller/admin/Profile");

router.post("/staffPortal", login);

router.route("/addEmployee").post(addEmployee).get(getEmployee);
router.route("/viewEmployees").get(viewEmployee); 

router.route('/checkout').get(getBookData).post(checkout)
router.route('/viewAuthors').get(getAuthorData)
router.route('/viewGenre').get(authenticateStaff,viewGenre)
router.route('/viewBooks').get(viewBooks)
router.route('/viewUsers').get(viewUsers)
router.route('/userSearch').post(userSearch)
router.route('/returnRenew').get(getCheckoutData) 
router.route('/addEvent').post(upload.single("file"),addEvent).get(fetchVenue)
router.route('/addVenue').post(addVenue)
router.route('/addBlog').post(upload.single("file"),addBlog)
router.route('/profile').get(authenticateStaff,profile)
router.route('/blockUnblock').post(blockUnblock)
router.route('/viewBlog').get(getBlogData)
router.route('/viewEvent').get(getEventData)
router.route('/renewBook').post(renewBook)
router.route('/returnBook').post(returnBook)





module.exports = router;
