const nodemailer = require("nodemailer")
const { options } = require("../routes/authRoute")

const sendEmail = async (options) =>{ //options is just a parameter
    var transporter = nodemailer.createTransport({
        service: "gmail",  //gmail ma mail pathauna lako le gmail lekheko

        auth: {
            user: "anup.tachamo12@gmail.com",  //sender vaild gmail
            pass: "gbfquuxgljtefxjr",   //this password is created from app password (note line no.)
        },
    })

    const mailOptions ={
        from: "Anup Tachamo <anup.tachamo12@gmail.com> ",  //yeta mathii ko naii gmail hunu parxa vaneko ni xna 
        to : options.email,
        subject : options.subject,
        text : "Your OTP is " + options.opt,
    }

    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail




/*  
* NOTE (how to create app password)
    - open your gmail which you have given here (anup.tachamo12@gmail.com)
    - go to manage your account
    - your gmail should be verify (to verify two step verification should be on)
    - after verification search [ app password]
    - then create app name (any name you want)
    - then lastly copy a password
*/