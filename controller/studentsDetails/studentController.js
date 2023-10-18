/*students_details is an table name which are on database [studentRecordsCms] 
(index.js ko line no. 33)*/
const { students_details, users} = require("../../Model/index");
const fs = require ("fs")  //fs=>filesystem

//* home(get)
exports.renderHomePage = async (req, res) => {
  const success = req.flash("success")
  res.render('home', {success : success})
  }

//*addStudents(get)
exports.renderAddStudentsDetails = (req, res) => {
    res.render('addStudentsDetails');
}

//*addStudents(post)
exports.AddStudentsDetails = async(req, res) =>{ 

    // console.log(req.requestingUser[0].id, "USerId from AddStudentsDetails")
    const userId = req.requestingUser
 
    const fileName = req.file.filename
    const { fullname, address, grade, rollno, age, contactno } = req.body;
    if(!fullname || !address || !grade || !rollno || !age || !contactno || !req.file){
      return res.send("Please provide all details first")

    }

    //database ma data pathauxa
    await students_details.create({
      fullname : fullname,  // first fullname vaneko column fullname ho, second fullname vaneko form bata aako value 
      address: address,
      grade : grade,
      rollno : rollno,
      age : age,
      contactno : contactno,
      userId : userId,
      image : process.env.PROJECT_URL + fileName
    })

    res.redirect('/allDetails');
  }

//*single(get)
exports.renderSingleStudentDetails = async (req, res) => {
  // parameter/url bata ko id
  const id = req.params.id;

  // yo id related matra data database bata tannu paryo
  const allSingleDetails = await students_details.findAll({
    where: {
      id,
    },
    include : {
      model : users
    }
  });

  res.render("sDetails", { allSingleDetails });
}

//* update(get)
exports.renderUpdateStudentsDetails = async (req, res) => {
  const id = req.params.id;
    // finding single student to prefill in input
    const allsingleDetails = await students_details.findAll({
      where: {
        id,
      },
    });

  // allSingleDetails(single Blog) pass gareko updateStudentsDetails.ejs file ma prefill ko lagi
  res.render("updateStudentsDetails", { id: id,allSingleDetails:allsingleDetails });
}

//* update(post)
exports.UpdateStudentsDetails = async (req, res) => {
    const id = req.params.id;

    //*for updating the image
    const oldData = await students_details.findAll({
      where : {
        id : id
      }
    })
    let fileURL
    if(req.file){
      //* If there is a new file uploaded with a filename, use its URL
      fileURL = process.env.PROJECT_URL + req.file.filename
    }else{
      //* If no new file uploaded or filename is undefined, use the old image URL
      fileURL = oldData[0].image  //old fileURL
    }

    const updateFields = {
      //* Update other fields from req.body
      fullName: req.body.fullName,
      address: req.body.address,
      grade: req.body.grade,
      rollno : req.body.rollno,
      age : req.body.age,
      contactno : req.body.contactno,

      //*update the image URL
      image: fileURL,
    }
  
    // update
    //* form bata(req.body) bata aako kura haru(fullname, address, grade, etc) lai update gardey where id ko value chae tyo parameter bata aako id ko value xa 
    await students_details.update(updateFields,{
      where: {
        id: id,
      },
    })
    
    /*
    explaining code no. 117 to 132
    * how to delete the previous image after new update
    */
    const oldImagePath = oldData[0].image
    // console.log(oldImagePath)  // http://localhost:3000/image.png

    const lengthofunwanted = "http://localhost:3000".length

    const fileNameInUploadsFolder = oldImagePath.slice(lengthofunwanted)
    console.log(fileNameInUploadsFolder)

    fs.unlink("uploads/" + fileNameInUploadsFolder, (err)=>{
      if(err){
        console.log("Error while deleting file", err)
      }else{
        console.log("file Delete Successfully")
      }
    })

    /*
    fs.unlink('uploads/test.txt',(err)=>{
      if(err){
        console.log("error happened", err)
      }else{
        console.log("Delete Successfully")
      }
    })
    */
    // update vayisakeypaxi direct to sDetails.ejs page of that specific id
    res.redirect("/single/" + id);
  }

//* AllDetails(get)
exports.renderAllDetails =   async (req, res) => {
    // res.render('home');
    const allSingleDetails = await students_details.findAll({
      include : { //include =>join garna use hunxa
        model : users //users vanne table ma join gardeu vaneko ho
      }
    });
    res.render("allDetails", { students_details: allSingleDetails });
  } 

//*delete(get)
exports.renderDeleteStudentsDetails = async (req, res) => {
  // no UI
  const id = req.params.id;
  // For deleting any data we can use destroy on it
  await students_details.destroy({ where: { id } });
  res.redirect("/allDetails");
}


//*contactUs(get)
exports.rendercontactUs = (req, res) => {
  res.render('contactUs');
}

//*myDetails(get)
exports.rendermyDetails = async(req, res) => {
  // res.render('home');

  const userId = req.requestingUser   //requestingUser is defined from isAuthenticated.js line no. 32
  const myDetails = await students_details.findAll({
    where: {
      userId : userId   // first ko userId vaneko students_details ko table ma vako naam sanga same hunu parxa  anii second ko userId => line no. 113 ma define gareko object lai call gareko matra ho
    }
  });
  res.render("myDetails", { myDetails: myDetails });
}