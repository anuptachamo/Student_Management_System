const nodemailer = require("nodemailer")  //for this you needed to install nodemailer(npm i nodemailer)
require("dotenv").config()

const sendEmail = async (options) =>{ //options is just a parameter
    var transporter = nodemailer.createTransport({
        service: "gmail",  //gmail ma mail pathauna lako le gmail lekheko

        /**
         * process.env.EMAIL_PASSWORD => (line no. 5)
         * process.env.EMAIL =>define for .env file (line no. 4)
         */
        auth: {
            user: process.env.EMAIL,  
            pass: process.env.EMAIL_PASSWORD,
            
        },
    })


    const mailOptions ={
        //key always be same all time 
        from: "Anup Tachamo <anup.tachamo12@gmail.com> ",  //yeta mathii ko naii gmail hunu parxa vaneko ni xna 
        to : options.email,
        subject : options.subject,
        text : "Your OTP is " + options.otp,
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