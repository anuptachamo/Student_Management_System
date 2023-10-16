/*users is an table name which are on database [studentRecordsCms] (index.js ko line no. 34)*/
const jwt = require("jsonwebtoken");
const { users } = require("../../Model");
const bcrypt = require("bcryptjs"); //password hashing lagii use garxa
const sendEmail = require("../../services/sendEmail");


//* register(get)
exports.renderRegisterPage = async (req, res) => {
    res.render('register');
}

//* register(post)
exports.RegisterPage = async(req, res ) =>{
    console.log(req.body);
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    if(password !== confirmPassword){
      // return res.send("password and confirm password doesn't match")
      return res.send('<script>alert("password and confirm password does not match"); window.location.href="/";</script>');

    }
  
    //database ma halnu paryo
    await users.create({
        username : req.body.username,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password,10),
      

    })
    res.redirect('/login')
  }


//* login(get)
exports.renderLoginPage = (req, res) =>{
    res.render('login');
  }

//* login(post)
exports.LoginPage =  async (req, res) => {
    // email , password
    const email = req.body.email;
    const password = req.body.password;
  
    //aako email registered xa ki xaina check garnu paryo
    const userFound = await users.findAll({
      where: {
        email: email,
      },
    });
  
    // if registered xaina vaney(no)
    if (userFound.length == 0) {
      // error faldinu paryo invalid email or email not registered error
      // res.send("Invalid email or password");
      return res.send('<script>alert("Invalid email or password"); window.location.href="/login";</script>');

    } else {
      const databasePassword = userFound[0].password; // database pahila register garda ko password
      //if registered xa vaney (yes)
  
      // if yes(xa) vaney ,password check garnu paryo
      const isPasswordCorrect = bcrypt.compareSync(password, databasePassword);
      
      //Generated TOKEN here
      /*  jwt line no.2 ma define gareko xa   
          {id:userFound[0].id}  => yo code le database ma kun id bata login gareko xa vanera dekhauxa, userFound line no. 46 am define vako xa
          process.env.SECRETKEY => yo code le .env file ko SECRETKEY vanne object laii define gareko ho
      */
      const token =jwt.sign({id:userFound[0].id}, process.env.SECRETKEY,{ 
        expiresIn : "30d"
      })
      res.cookie("token",token
      // ,{
      //   secure : true,
      //   expires : "120"
      // }
      )  //browser ma application tab vitra cookie vanney ma save hunchha
      console.log("This is Token \n" + token)

      if (isPasswordCorrect) {
        // match vayo(yes),login successfully
        res.redirect("/home");
      } else {
        // match vayena (no) , error->invalid password
      return res.send('<script>alert("Invalid email or password"); window.location.href="/login";</script>');

      }
    }
  } 


//* logout(get)
exports.renderLogoutPage = (req, res) => {
    res.clearCookie('token')
    // Redirect the user to the login page after logging out
    res.redirect('/login');
}

//* forgot password(get)
exports.renderforgotPassword = (req, res) => {
  res.render("forgotPassword")
}

//* forgot password(post)
exports.checkforgotPassword = async (req, res) => {
  // const arrayOfEmails = ['anuptachamo@gmail.com','testing@gmail.com']    //-> sending to a multiple mail in gmail alc
  const email = req.body.email
  if(!email){
    return res.send('<script>alert("please provide email"); window.location.href="/forgotPassword";</script>');

  }

  /* 
  * for sending mails to the all users
  const allUsers = await users.findAll()
  */

  //if email -> users table check with that email
  const checkEmailExists = await users.findAll({
    where : {
      email : email
    }
  })

  if(checkEmailExists.length == 0){
    return res.send('<script>alert("user with that email does not exist"); window.location.href="/forgotPassword";</script>');

  }else{
    /*
    * How to send a mail to all users table
    for (let i = 0; i < allUsers.length; i++){  // allUsers define from line no. 118
        //tyo email ma otp pathauney
     await sendEmail({  //function laii define gareko
      //key email, subject and otp services folder ko SendEmail.js file ko line no. 17-19 bata ako ho
      email : allUsers[i].email,  // email vanne value  line no 110 bata ako ho
      subject : "This is bulk Gmail",
      otp : "this is to notify that we are closing soon"
    })
    }
    */

    const generatedOTP = Math.floor(100000 * Math.random(999999))  //asking for give 4 digits of numbers between 1000 to 9000
    console.log(generatedOTP)

    //tyo email ma otp pathauney
    await sendEmail({  //function laii define gareko
      //key email, subject and otp services folder ko SendEmail.js file ko line no. 17-19 bata ako ho
      email : email,  // email vanne value  line no 110 bata ako ho
      subject : "Forgot Password OTP",
      otp : generatedOTP
    })
    checkEmailExists[0].otp = generatedOTP
    checkEmailExists[0].OTPGeneratedTime = Date.now()
    // console.log("OTP:", checkEmailExists[0].otp);
// console.log("OTPGeneratedTime:", checkEmailExists[0].OTPGeneratedTime);
    await checkEmailExists[0].save()
    // console.log("Update complete.");
    res.redirect("/otp?email=" + email)
  }

}


//* Otp(get)
exports.renderOTPForm = (req, res) => {
  const email = req.query.email
  console.log(email)
  res.render('otpForm', {email : email});
}

//* Otp(post)
exports.handleOTP = async(req, res)=>{
  const otp = req.body.otp
  const email = req.params.id
    if(!otp || !email){
    return res.send('<script>alert("Please send email and otp"); window.location.href="/otpForm";</script>');
  }
  const userData = await users.findAll({
    where : {
      email :email,
      otp : otp
    }
  })
  if (userData.length == 0){
    res.send("Invalid OTP")
  }else{
    const currentTime = Date.now() //current time
    const OTPGeneratedTime = userData[0].OTPGeneratedTime  //past time
  

    if(currentTime - OTPGeneratedTime <= 120000){
      /* OTP use vaisake paxii otp null hunxa
      userData[0].otp = null
      userData[0].OTPGeneratedTime = null 
      await userData[0].save
      */

      //OTP valid vayo vaney yo chalxa
      // res.redirect("/changePassword?email=" + email)  //password change garna kun email ko pw change garne vanera check gareko
      res.redirect(`/changePassword?email=${email}&otp=${otp}`)
    }else{
      return res.send('<script>alert("OTP has Expired"); window.location.href="/forgotPassword";</script>');
    }
  }
}


//* changed password(get)
exports.renderChangePassword = (req, res) => {
  const email = req.query.email
  const otp = req.query.otp
  if( !email || !otp){
    return res.send('<script>alert("Email and otp should provided in the query"); window.location.href="/changePassword";</script>');
  }
  res.render("changePassword", {email, otp})
}

//* changed password(post)
exports.handlePasswordChange = async (req, res)=>{
  const email = req.params.email
  const otp = req.params.otp
console.log(otp)
  const newPassword = req.body.newPassword
  const confirmNewPassword = req.body.confirmNewPassword

  if(!newPassword || !confirmNewPassword || !email || !otp){
    return res.send('<script>alert("Please provide new password and confirm password"); window.location.href="/changePassword";</script>');
  }

  //Checking if that emails otp or not
  const userData = await users.findAll({
    where : {
      email :email,
      otp : otp
    }
  })
  if(newPassword !== confirmNewPassword){
    return res.send('<script>alert("New password and confirm password does not match"); window.location.href="/changePassword";</script>');
  }

  if (userData.length == 0){
    return res.send("Dont try to do this")
  }
  const currentTime = Date.now()
  const OTPGeneratedTime = userData[0].OTPGeneratedTime 
  console.log(currentTime, OTPGeneratedTime, currentTime-OTPGeneratedTime)
  console.log(currentTime - OTPGeneratedTime >=120000)

    if(currentTime - OTPGeneratedTime >= 120000){
    
        return res.redirect("/forgotPassword")
    }
  

  const hashedNewPassword = bcrypt.hashSync(newPassword,8)  //newPassword laii hash garna lai gareko
  //match vayo vaney?
  /** Alternative
    const userData = await users.findAll({
      email :  email
    })
    userData[0].password = hashedNewPassword
    await userData[0].save()
  */

  //users table ma newPassword change garna email check gareko anii newPassword laii hashed gareko
  await users.update({ 
    password : hashedNewPassword
  },{
    where : {
      email : email
    }
  })
  res.redirect("/login")
}