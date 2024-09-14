const Job = require("../models/job.model.js")
module.exports.postJob = async (req,res) => {
    try{
    const {title ,description ,requirements,salary ,location ,jobType ,position ,experience ,companyId} = req.body;

    const userId = req.id ;

    if(!title || !description || !requirements || !salary || !location || !jobType || !position || !experience || !companyId){
        return res.status(400).json({
            message : "Something is missing",
            success : false ,
        })
    }

    const job = await Job.create({
        title,
        description,
        requirements:requirements.split(","),
        salary:Number(salary),
        location,
        jobType,
        position,
        experienceLevel:experience,
        company:companyId,
        created_by:userId,

    })

    return res.status(201).json({
        message : "new job created successfully",
        success : true ,
        job,
    })

    }
    catch(e){
        console.log("error while posting job");
        console.log(e);
    }

}

module.exports.getAllJobs = async(req,res) => {
    try{
        const keyword = req.query.keyword || "" ;
     const query = {
        $or:[
            {title:{$regex:keyword ,$options:"i"}},
            {description:{$regex:keyword ,$options:"i"}},
        ]
     }
     
     const jobs = await Job.find(query).populate({
        path:"company",
     }).sort({createdAt:-1});

     if(!jobs){
        return res.status(404).json({
            message : "job not found",
            success : false ,
        })
     }
      
     return res.status(200).json({
        message : "job getting successfully",
        success : true ,
        jobs,
    })

    }
    catch(e){
        console.log("error while getting job");
        console.log(e);
    }
}


module.exports.getJobById = async (req,res) => {
    try{
      const jobId = req.params.id ;
      const job = await Job.findById(jobId).populate({
        path:"applications"
      }) ;

      if(!job){
        return res.status(404).json({
            message : "job not found",
            success : false ,
        })
      }
      return res.status(200).json({
        message : "job found successfully",
        job,
        success : true ,
    })
    }
    catch(e){
        console.log("error while getting job by id");
        console.log(e);
    }
}

// now for admin 
module.exports.getAdminJobs = async (req,res) => {
    try{
  const adminId = req.id ;
  const jobs = await Job.find({created_by:adminId}).populate({
    path:"company",
    createdAt:-1,
  });

  if(!jobs){
    return res.status(404).json({
        message : "job not found",
        success : false ,
    })
  }
  return res.status(200).json({
    message : "job found for admin",
    jobs,
    success : true,
})
    }
    catch(e){
        console.log("error while getting admin job by id");
        console.log(e);
    }
}