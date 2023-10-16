const { 
    renderRegisterPage,
    RegisterPage,
    renderLoginPage,
    LoginPage,
    renderLogoutPage, 
    renderforgotPassword,
    checkforgotPassword,
    renderOTPForm,
    handleOTP,
    renderChangePassword,
    handlePasswordChange
} = require("../controller/auth/authController")
const { isAuthenticated } = require("../middleware/isAuthenticated")
const { route } = require("./studentsRoute")

//Create an Express Router instance.
const router = require("express").Router()

//* register page
router.route("/").get(renderRegisterPage)  //define route(main starting page)  
router.route("/createUser").post(RegisterPage)

//* login
router.route("/login").get(renderLoginPage)
router.route("/createLogin").post(LoginPage)

//* logout
router.route("/logout").get(renderLogoutPage)

//* forgot password(get) and (post)
router.route("/forgotPassword").get(renderforgotPassword).post(checkforgotPassword)   //URL same vako le get, post sangaii define garna mileko ho

//* otp(get)
router.route("/otp").get(renderOTPForm)

//* otp(post)
router.route("/otp/:id").post(handleOTP)

//* change password(get)
router.route("/changePassword").get(renderChangePassword)

router.route("/changePassword/:email/:otp").post(handlePasswordChange)

module.exports = router;