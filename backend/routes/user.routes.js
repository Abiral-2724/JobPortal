const express = require('express') ;
const { register, login, updateProfile, logout } = require('../controllers/user.controller.js');
const isAuthenticated = require('../middlewares/isAuthenticated.js');

const {singleUpload} = require('../middlewares/multer.js'); 
const router = express.Router();

router.route('/register').post(singleUpload,register) ;
router.route('/login').post(login) ;
router.route('/profile/update').post(isAuthenticated ,singleUpload ,updateProfile) ;
router.route('/logout').get(logout);
module.exports = router 

