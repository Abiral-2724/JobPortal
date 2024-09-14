const Application = require("../models/application.model.js")
const Job = require("../models/job.model.js")


module.exports.applyJob = async(req,res) => {
    try{
    const userId = req.id ;
    const jobId = req.params.id ;
    if(!jobId){
        return res.status(200).json({
            message : "job id is required",
            success : false ,
        })
    }
 // check wheter user have alredy applied for the job
 const existingApplication = await Application.findOne({job:jobId ,applicant:userId}) ;
  
 if(existingApplication){
    return res.status(400).json({
        message : "you have already applied for the job",
        success : false ,
    })
 }

   // check if the job exits or not
   const job = await Job.findById(jobId) ;

   if(!job){
    return res.status(404).json({
        message : "job not found",
        success : false ,
    })
   }

   // create a new application
   const newApplication = await Application.create({
    job:jobId ,
    applicant:userId ,
   })

   job.applications.push(newApplication._id);
   await job.save() ;

   return res.status(201).json({
    message : "applied for job successfully",
    success : true ,
})


    }
    catch(e){
        console.log("error while apply job");
        console.log(e);
    }
}

module.exports.getAppliedJobs = async(req,res) => {
    try{
     const userId = req.id ;
     const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
        path:"job",
        options:{sort:{createdAt:-1}},
        populate:{
            path:"company",
            options:{sort:{createdAt:-1}},
        }
     })

     if(!application){
        return res.status(404).json({
            message : "no application found",
            success : false ,
        })
     }
     return res.status(200).json({
        message : "application found successfully",
        success : true ,
        application
    })

    }
    catch(e){
        console.log("errro while getting all applied job") ;
        console.log(e)
    }
}
// admin will check how many user have applied till date 
module.exports.getApplicants = async (req,res) => {
    try{
        const jobId = req.params.id ;
        const job = await Job.findById(jobId).populate({
            path:"applications",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"applicant",
            }
        })
        if(!job){
            return res.status(404).json({
                message : "job not found",
                success : false ,
            })
        }

        return res.status(200).json({
            message : "found all applicant",
            job,
            success : true ,
        })
    }
    catch(e){
        console.log("error while getting all application") ;
        console.log(e) ;
    }


}


module.exports.updateStatus = async (req,res) => {
    try{
const {status} = req.body ;
const applicationId = req.params.id ;

if(!status){
    return res.status(404).json({
        message : "no status found",
        success : false ,
    })
}
  // find the application by application id
  const application = await Application.findOne({_id : applicationId}) ;

  if(!application){
    return res.status(404).json({
        message : "no application found",
        success : false ,
    })
  }

  // update status
  application.status = status.toLowerCase() ;
  await application.save() ;

  return res.status(200).json({
    message : "status updated succesfullt",
    success : true ,
})

    }
    catch(e){
        console.log(e) ;
    }
}