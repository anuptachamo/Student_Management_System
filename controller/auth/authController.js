/*users is an table name which are on database [studentRecordsCms] (index.js ko line no. 34)*/
const jwt = require("jsonwebtoken");
const { users } = require("../../Model");
const bcrypt = require("bcryptjs"); //password hashing lagii use garxa


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
      return res.send('<script>alert("password and confirm password does not match"); window.location.href="/login";</script>');

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
        res.render("home");
      } else {
        // match vayena (no) , error->invalid password
        // res.send("Invalid email or password");
      return res.send('<script>alert("Invalid email or password"); window.location.href="/login";</script>');

      }
    }
  } 


//* logout(get)
exports.  renderLogoutPage = (req, res) => {

    // Redirect the user to the register page after logging out
    res.redirect('/');
}