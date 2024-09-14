const Company = require("../models/company.model.js");
const getDataUri = require('../utils/dataUri.js');
const cloudinary = require('../utils/cloudinary.js');

module.exports.registerCompany = async (req,res) => {
    try{
     const {companyName} = req.body ;
     if(!companyName){
        return res.status(400).json({
            message : "company name is required",
            success : false ,
        })
     }

     let company = await Company.findOne({name:companyName}) ;
     if(company){
        return res.status(400).json({
            message : "You can't register same company",
            success : false ,
        })
     }
     company = await Company.create({
        name:companyName,
        userId:req.id
     })

    return res.status(201).json({
        message : "company register successfully",
        company,
        success : true ,
    })

    }
    catch(e){
      console.log("error in company creation");
      console.log(e) ;
    }
}

module.exports.getCompany = async (req,res)=>{
    try{
     const userId = req.id ; // logged in user id
     const companies = await Company.find({userId}) ;

     if(!companies){
        return res.status(404).json({
            message : "companyies not found",
            success : false ,
        })
     }
 
     return res.status(200).json({
        message : "companies data : ",
        companies,
        success : true ,
    })

    }
    catch(e){
        console.log("error in getiing company");
        console.log(e) ;
    }
}
// get company by id
module.exports.getCompanyById = async (req,res) => {
    try{
    const companyId = req.params.id ;
    const company = await Company.findById(companyId) ;
    if(!company){
        return res.status(404).json({
            message : "company not found",
            success : false ,
        })
    }
    return res.status(200).json({
        company,
        success:true ,
    })
    }
    catch(e){
        console.log("error in getiing company");
        console.log(e) ;
    }
}

module.exports.updateCompany = async (req,res) => {
    try{
     const {name ,description ,website ,location} = req.body;
     const file = req.file ;

   // cloundinary 
   const fileUri = getDataUri(file) ;
   const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
   const logo = cloudResponse.secure_url ;


   const updateData = {
    name ,
    description ,
    website ,
    location,
    logo
    }

    const company = await Company.findByIdAndUpdate(req.params.id ,updateData ,{new : true});

    if(!company){
        return res.status(404).json({
            message : "company not found",
            success : false ,
        })
    }
    return res.status(202).json({
        message : "company info updated successfully",
        success : true ,
    })

    }
    catch(e){
        console.log("error in updating  company");
        console.log(e) ;
    }
}