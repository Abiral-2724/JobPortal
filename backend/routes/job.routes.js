const express = require('express') ;
const { register, login, updateProfile, logout } = require('../controllers/user.controller.js');
const isAuthenticated = require('../middlewares/isAuthenticated.js');
const { registerCompany, getCompany, getCompanyById, updateCompany } = require('../controllers/company.controller.js');
const { postJob, getAllJobs, getAdminJobs, getJobById } = require('../controllers/job.controller.js');

const router = express.Router();

router.route('/post').post(isAuthenticated ,postJob) ;
router.route('/get').get( isAuthenticated,getAllJobs) ;
router.route('/getadminjobs').get(isAuthenticated , getAdminJobs) ;
router.route('/get/:id').get(isAuthenticated ,getJobById);
module.exports = router 

