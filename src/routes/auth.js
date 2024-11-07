const express = require('express');
const route = express.Router();
const authController = require('../controller/authController');



route.post('/login', authController.login);


route.post('/signup', authController.signup);



module.exports = route;
