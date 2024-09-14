const mongoose = require('mongoose') ;


const userSchema = new mongoose.Schema({
    fullname : {
        type : String ,
        required : true ,
    },
    email : {
        type : String ,
        required : true ,
        unique : true ,
    },
    phoneNumber : {
        type : Number ,
        required : true ,
    },
    password : {
        type : String ,
        required : true ,
    },
    role : {
        type : String ,
        enum: ['student' , 'recruiter','recruiter','Student','Recruiter'],
        required : true ,
    },
    profile:{
        bio:{
            type : String ,
        },
        skills : {
            type : [String] ,
        },
        resume : {
            // url to resume file
            type : String ,
        },
        resumeOriginalName :{
            type : String ,
        },
        company:{
            // setting a reference
            type : mongoose.Schema.Types.ObjectId,
            ref:'Company',
        },
        profilePhoto : {
            type : String ,
            default : "",
        },

    }
},{timestamps:true}) ;

module.exports = mongoose.model('User' ,userSchema)