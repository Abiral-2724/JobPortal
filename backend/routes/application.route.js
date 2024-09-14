const express = require('express') ;
const { register, login, updateProfile, logout } = require('../controllers/user.controller.js');
const isAuthenticated = require('../middlewares/isAuthenticated.js');
const { registerCompany, getCompany, getCompanyById, updateCompany } = require('../controllers/company.controller.js');
const { applyJob, getAppliedJobs, getApplicants, updateStatus } = require('../controllers/application.controller.js');

const router = express.Router();

router.route('/apply/:id').get(isAuthenticated ,applyJob) ;
router.route('/get').get( isAuthenticated,getAppliedJobs) ;
router.route('/:id/applicants').get(isAuthenticated , getApplicants) ;
router.route('/status/:id/update').post(isAuthenticated ,updateStatus);
module.exports = router 

