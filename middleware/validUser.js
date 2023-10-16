const { students_details } = require("../Model")



exports.isValidUser = async (req,res,next)=>{
    const userId = req.userId
    const id = req.params.id

    const oldData = await students_details.findAll({
        where : {
            id : id
        }
    })
    if(oldData[0].userId !== userId){
        return res.send("You do not have permission to update it")
    }
    next();
}