const multer = require ("multer");  //to use multer you needed to install multer (npm install multer) 

var storage = multer.diskStorage({
    destination: function (req, file, cb){

        // logic to validate the fileType (mimeType)
        const allowedFileTypes = ['image/png','image/jpeg', 'image/jpg']
        if(!allowedFileTypes.includes(file.mimetype)){
            cb(new Error("Invalid fileType.Only supports png,jpeg, jpg")) //cb (error)
            return
        }
        cb(null, "./uploads/")  //hamle image add garda uploads folder ma haldeu vaneko ho
    },
    filename: function (req, file, cb){
        /* explaining line no. 19
            Date.now() => same image ferii upload garna dindaina 
            file.originalname => upload vako image ko naam dekhauxa
        */
        cb(null, Date.now() + "_" + file.originalname)  
    },
})


module.exports ={
    multer,
    storage,
}