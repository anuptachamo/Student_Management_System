const express = require ('express'); //require a express
const app = express(); //calling a express
require('dotenv').config()  //requiring dotenv and initializing it with default configuration
const cookieParser = require ('cookie-parser')

//* require express-session and connect-flash
const session = require("express-session")
const flash = require("connect-flash")

//* Routes
const allStudentsRoute = require("./routes/studentsRoute")
const allAuthRoute = require("./routes/authRoute");
const { decodeToken } = require('./services/decodeToken');

//* Database connection
require("./Model/index");

//* Configure the session middleware.
app.use(session({
    
    secret : "testing",  //* A secret key used to sign session cookies. It should be a long, random string for security.
    resave : false,      //* If true, forces the session to be saved back to the session store, even if it wasn't modified during the request. Setting it to false is more efficient.
    saveUninitialized : false  //* If true, a session will be stored in the session store, even if it wasn't initialized (e.g., no data was added to it). Setting it to false is more efficient and generally recommended.
}))

//* Configure the flash middleware.
app.use(flash())

//*setting up ejs, telling nodejs to use ejs
app.set("view engine", "ejs");

/* 
* folder access garna deko ejs file haru lai
* public vitra ko folder access garna payo aba 
*/
app.use(express.static("./public")); 
app.use(express.static("./uploads")); 


app.use(cookieParser())

//*parsing FormData (form bata aako data laii parse gar vaneko)
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(async(req, res, next)=>{
    res.locals.currentUser = req.cookies.token
    const token = req.cookies.token 
    if(token){
        const decryptedResult = await decodeToken(token,process.env.SECRETKEY)
        if(decryptedResult && decryptedResult.id){
            res.locals.currentUserId = decryptedResult.id
        }
    }
    next()
})





app.use("", allStudentsRoute)
app.use("", allAuthRoute)


//*Start the server
app.listen(3000, () =>{
    console.log('Server is running on port number 3000');
});

