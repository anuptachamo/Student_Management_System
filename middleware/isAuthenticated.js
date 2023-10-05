
const jwt = require ("jsonwebtoken")
// const promisify = require ("util").promisify
const {promisify} = require("util")
const { users } = require("../Model")

exports.isAuthenticated = async(req, res, next) =>{
    const token = req.cookies.token

    //check if token given or not
    if(!token){
        return res.send("You must be logged In")
    }

    // verify token if it is legit or not
    const decryptedResult = await promisify( jwt.verify)(token, process.env.SECRETKEY)
    // console.log(decryptedResult)


    //check if that id (userId) users table ma exist xa ki xna
    const usersExists = await users.findAll({
        where : {
            id : decryptedResult.id
        }
    })

    //check if length is zero or not (zero-> userExist gardaina)
    if(usersExists.length == 0){
        res.send("User with that token doesn't exist")
    }else{
        req.requestingUser = usersExists  //decryptedResult.id --alternative
        next()

    }

}