const { 
    renderAddStudentsDetails,
    AddStudentsDetails,
    renderSingleStudentDetails,
    renderUpdateStudentsDetails,
    renderDeleteStudentsDetails,
    renderAllDetails,
    renderHomePage,
    UpdateStudentsDetails, 
    rendercontactUs
} = require("../controller/studentsDetails/studentController");
const { isAuthenticated } = require("../middleware/isAuthenticated");


//Create an Express Router instance.
const router = require("express").Router()

// * home page
router.route("/home").get(renderHomePage)

//*POST method(http verbs)
// addStudent vanne addStudentsDetails.ejs file ko FORM ko ACTION ma hunxa jahile, anii  METHOD jahile POST hunu parxa*/
router.route("/addStudentsDetails").get(renderAddStudentsDetails)
router.route("/addStudent").post(isAuthenticated, AddStudentsDetails)

//* All page details 
router.route("/allDetails").get(renderAllDetails)

//*single
router.route("/single/:id").get(renderSingleStudentDetails)

//*update
// /*Updating Students details [POST]
// updatestudent is define in updateStudentsDetails.ejs file line no. 15*/
router.route("/update/:id").get(renderUpdateStudentsDetails)
router.route("/updateStudent/:id").post(isAuthenticated, UpdateStudentsDetails)

//*delete
router.route("/delete/:id").get(isAuthenticated, renderDeleteStudentsDetails)

//* Contact Us
router.route("/contactUs").get(rendercontactUs)

module.exports = router;