const { 
    renderAddStudentsDetails,
    AddStudentsDetails,
    renderSingleStudentDetails,
    renderUpdateStudentsDetails,
    renderDeleteStudentsDetails,
    renderAllDetails,
    renderHomePage,
    UpdateStudentsDetails, 
    rendercontactUs,
    rendermyDetails
} = require("../controller/studentsDetails/studentController");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { isValidUser } = require("../middleware/validUser");

// importing multer and storage from multerConfig.js file
const { multer, storage } = require("../middleware/multerConfig")
const upload = multer ({storage: storage})

//Create an Express Router instance.
const router = require("express").Router()



// * home page
router.route("/home").get(isAuthenticated,renderHomePage)

//*POST method(http verbs)
// addStudent vanne addStudentsDetails.ejs file ko FORM ko ACTION ma hunxa jahile, anii  METHOD jahile POST hunu parxa*/
router.route("/addStudentsDetails").get(renderAddStudentsDetails)

/* explaining line no. 37
upload => line 21 bata define vako
upload.single => ek choti ma euta matra image upload garna dinxa
upload.array => ek choti ma euta vanda dherai image upload garna dinxa
upload.single('image') => image vanne name addStudentsDetails.js file ko line no. 66 ko input field ko name sanga SAME HUNAII PARXA

*/
router.route("/addStudent").post(isAuthenticated, upload.single('image'), AddStudentsDetails) 

//* All page details 
router.route("/allDetails").get(renderAllDetails)

//*single
router.route("/single/:id").get(renderSingleStudentDetails)

//*update
// /*Updating Students details [POST]
// updatestudent is define in updateStudentsDetails.ejs file line no. 15*/
router.route("/update/:id").get(renderUpdateStudentsDetails)
router.route("/updateStudent/:id").post(isAuthenticated, upload.single('image'), UpdateStudentsDetails)

//*delete
router.route("/delete/:id").get(isAuthenticated, renderDeleteStudentsDetails)

//* Contact Us
router.route("/contactUs").get(rendercontactUs)

//* My Details
router.route("/myDetails").get(isAuthenticated,rendermyDetails)

module.exports = router;