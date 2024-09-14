const cookieParser = require('cookie-parser');
const express = require('express') ;
const cors = require('cors') ;
const app = express() ;
const dotenv = require('dotenv');
const connectDB = require('./utils/db.js');
const userRoute = require("./routes/user.routes.js")
const companyRoute = require("./routes/company.routes.js");
const jobRoute = require("./routes/job.routes.js") ;
const applicationRoute = require("./routes/application.route.js") ;
const path = require('path')

dotenv.config({}) ;
// app.get('/',(req,res)=>{
//     return res.status(200).json({
//         message : "Backend",
//         success : true,
//     })
// })
const PORT = process.env.PORT || 8001 ;

const _dirname = path.resolve() ;

// Middleware 
app.use(express.json()) ;
app.use(express.urlencoded({extended:true})) ;
app.use(cookieParser()) ;
const corsOptions = {
    origin : 'http://localhost:5173',
    credentials : true 
}
app.use(cors(corsOptions)) ;



// api's
app.use("/api/v1/user" ,userRoute);

// example route 
// "http://localhost:8000/api/v1/user/register"
// "http://localhost:8000/api/v1/user/login"
// "http://localhost:8000/api/v1/user/profile/update"

app.use("/api/v1/company" ,companyRoute);
app.use("/api/v1/job" ,jobRoute) ;
app.use("/api/v1/application" ,applicationRoute)

app.use(express.static(path.join(_dirname , "/frontend/dist")))
app.get('*' , (req ,res) => {
    res.sendFile(path.resolve(_dirname , "frontend" ,"dist" , "index.html"))
})
app.listen(PORT , ()=>{
    connectDB() ;
    console.log(`Server Running at port ${PORT}`)
})