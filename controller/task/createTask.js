const { taskModel } = require('../../model/userSchema');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;


async function createTask(req, res, next) {
    console.log("createTask")
    
    const { ticketNo, title, description, status, priority, dueDate, createdAt, updatedAt, assignedTo, projectId, } = req.body;
    if (!ticketNo || !title || !description || !status || !priority || !dueDate || !assignedTo || !projectId) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
    
    try {
        // const findemail = await userModel.findOne({ email })
        // if (findemail) {}
        const newTask = new taskModel({
            ticketNo,
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo,
            projectId,
        });
        await newTask.save()
        res
            .status(200)
            .json({
                status: "success",
                message: "Task created Successful",
            });


    } catch (error) {
        console.log(error.message);
        if (error.code === 11000 && error.keyPattern && error.keyPattern.ticketNo === 1) {
            return res.status(400).json({ error: 'Duplicate ticketNo. Please use a different ticket number.' });
          }
        res.status(300).json({ error: err.message })
    }
}

async function updateTask(req, res, next) {
    const { taskId, updateData } = req.body;

    if (!taskId || !updateData) {
        return res.status(400).send('Task ID and update data are required.');
    }

    try {
        const updatedTask = await taskModel.findByIdAndUpdate(
            taskId,
            {
                $set: updateData
            },
            {
                new: true,
                //   runValidators: true 
            }
        );

        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }

        //   req.updatedTask = updatedTask; 
        //   next(); 
        res
            .status(200)
            .json({
                status: "success",
                message: "Task updated Successful",
            });

    } catch (error) {
        console.error('Error updating task:', error);
        if (error.code === 11000 && error.keyPattern && error.keyPattern.ticketNo === 1) {
            return res.status(400).json({ error: 'Duplicate ticketNo. Please use a different ticket number.' });
          }
        res.status(500).send('Failed to update task');
    }
};
const deleteTask = async (req, res, next) => {
    const { taskId } = req.body;

    if (!taskId) {
        res.status(400).send('Task ID is required.');
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        res.status(400).send('Invalid Task ID.');
    }

    try {
        const deletedTask = await taskModel.findByIdAndDelete(taskId);

        if (!deletedTask) {
            res.status(404).send('Task not found');
        }

        res
            .status(202)
            .json({
                status: "success",
                message: "Task deleted successfully",
            })

    } catch (error) {
        console.error('Error deleting Task:', error);
        res.status(500).send('Failed to delete Task');
    }
};


const getTasks = async (req, res, next) => {
    const { projectId } = req.body;
    if (!projectId) {
        return res.status(400).send('Project ID is required.');
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).send('Invalid Project ID.');
    }

    try {
        const tasks = await taskModel.find({ projectId: new mongoose.Types.ObjectId(projectId) });

        if (!tasks || tasks.length === 0) {
            return res.status(404).send('No tasks found for this project');
        }
        return res
            .status(200)
            .json({
                status: "success",
                message: "Task got  successfully",
                data: { tasks }
            })

    } catch (error) {
      
        console.error('Error fetching tasks:', error);
        return res.status(500).send('Failed to fetch tasks');
    }
};

module.exports = { createTask, updateTask, deleteTask, getTasks }