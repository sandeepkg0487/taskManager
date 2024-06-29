const {  Schema, model,  } = require('mongoose');
const mongoose = require('mongoose');

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    phone: {
        type: String,
        require: true
    },
   

})
const userModel = model('user', userSchema);


const taskSchema = new Schema({
    ticketNo:{
        type:Number,
        required:true,
        unique: true,
    },
    title :{
        type:String,
        required:true,
    },
    description :{
        type:String,
       
    },
    status :{
        type: String,
        enum: ['pending','in progress', 'completed'], 
        default: 'pending'
    },
    priority :{
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    dueDate :{
        type: Date,
        
    },
    createdAt :{
        type: Date,
        default: Date.now
    },
    updatedAt :{
        type: Date,
        default: Date.now
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
      }

})
const taskModel = model('task', taskSchema);

const projectSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      }]
  });
  const projectModel = model('Project', projectSchema);



module.exports = { userModel, taskModel ,projectModel ,userSchema}


