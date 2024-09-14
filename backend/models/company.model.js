const mongoose = require('mongoose') ;


const companySchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true ,
        unique:true,
    },
    description : {
        type : String ,
       
    },
    website:{
        type : String ,
    },
    location : {
        type : String ,
    },
    logo:{
        // url to company logo
        type : String ,
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User',
        required : true ,
    }
    
},{timestamps:true}) ;

module.exports = mongoose.model('Company' ,companySchema)