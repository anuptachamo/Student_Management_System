const { 
    renderRegisterPage,
    RegisterPage,
    renderLoginPage,
    LoginPage,
    renderLogoutPage, 
    renderforgotPassword,
    checkforgotPassword
} = require("../controller/auth/authController")
const { isAuthenticated } = require("../middleware/isAuthenticated")

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


module.exports = router;