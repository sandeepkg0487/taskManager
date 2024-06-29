const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const {dbconnect} =require ('./controller/mongodbConnect')
const auth = require('./route/authRoute')
const projectRoute = require('./route/addProjectRoute')
const taskRoute = require('./route/taskRoute')


const PORT = 3001;

app.use(cors())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


dbconnect();

app.get('/test',(req,res,next)=>{
    res.send('Route Test ok ')
    })

app.use('/auth',auth)
app.use('/project',projectRoute)
app.use('/task',taskRoute)

app.listen(PORT, () => {
    console.log(`server listening on port :${PORT}`)
})