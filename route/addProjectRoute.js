const express = require('express');
const Route = express.Router();
const { createProject, updateProjectMiddleware, deleteProjectMiddleware, getAllProjects } = require('../controller/project/createProject')
const { authMiddleware } = require('../controller/auth/jwt')


Route.post('/addProject', authMiddleware, createProject);
Route.put('/updateProject', authMiddleware, updateProjectMiddleware);
Route.delete('/deleteProject', authMiddleware, deleteProjectMiddleware);
Route.get('/getAllProject', authMiddleware, getAllProjects);







module.exports = Route;


