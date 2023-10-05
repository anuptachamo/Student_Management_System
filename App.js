const express = require ('express'); //require a express
const app = express(); //calling a express
const cookieParser = require ('cookie-parser')
//requiring dotenv and initializing it with default configuration
require('dotenv').config()

require("./Model/index");

//* Routes
const allStudentsRoute = require("./routes/studentsRoute")
const allAuthRoute = require("./routes/authRoute")

//setting up ejs, telling nodejs to use ejs
app.set("view engine", "ejs");

// folder access garna deko ejs file haru lai
//public vitra ko folder access garna payo aba 
app.use(express.static("./public")); 


app.use(cookieParser())
//parsing FormData (form bata aako data laii parse gareko)
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("", allStudentsRoute)
// app.use("/test", allStudentsRoute)
app.use("", allAuthRoute)



//Start the server
app.listen(3000, () =>{
    console.log('Server is running on port number 3000');
});

