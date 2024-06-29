const express = require('express');
const Route = express.Router();
const {logincontroll,registercontroll} = require('../controller/auth/auth')

Route.post('/login',logincontroll);
Route.post('/signup',registercontroll);



module.exports=Route;