const express = require('express');
const Route = express.Router();
const { createTask, updateTask, deleteTask, getTasks } = require('../controller/task/createTask')
const { authMiddleware } = require('../controller/auth/jwt')


Route.post('/addTask', authMiddleware, createTask);
Route.put('/updateTask', authMiddleware, updateTask);
Route.delete('/deleteTask', authMiddleware, deleteTask);
// Route.get('/getTask', authMiddleware, getTasks);
Route.get('/getTask',  getTasks);







module.exports = Route;