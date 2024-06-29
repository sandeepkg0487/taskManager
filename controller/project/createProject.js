const { projectModel, userSchema } = require('../../model/userSchema');
const mongoose = require('mongoose');
require("../../model/userSchema");



async function createProject(req, res, next) {
  console.log("createProject")
  const { name, description, startDate, endDate, budget, members, } = req.body;
  console.log('req.body:', req.body);


  try {
    // const findemail = await userModel.findOne({ email })
    // if (findemail) {}
    const newProject = new projectModel({
      name,
      description,
      startDate,
      endDate,
      budget,
      members,
    });
    await newProject.save()
    res
      .status(200)
      .json({
        status: "success",
        message: "project created successfully",
      });

  } catch (err) {
    console.log(err.message);
    res.status(300).json({ err: err.message })
  }
}


const updateProjectMiddleware = async (req, res, next) => {
  const { projectId, updateData } = req.body;

  if (!projectId || !updateData) {
    res.status(400).send('Project ID and update data are required.');
  }
  try {
    const updatedProject = await projectModel.findByIdAndUpdate(
      projectId,
      {
        $set: updateData
      },
      {
        new: true, //  the updated document
        runValidators: true // Run schema validations

      }
    );


    if (!updatedProject) {
      res.status(404).send('Project not found');
    }

    res
      .status(200)
      .json({
        status: "success",
        message: "project updated successfully",
      });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).send('Failed to update project');
  }
};

const deleteProjectMiddleware = async (req, res, next) => {
  const { projectId } = req.body;

  if (!projectId) {
    res.status(400).send('Project ID is required.');
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).send('Invalid Project ID.');
  }

  try {
    const deletedProject = await projectModel.findByIdAndDelete(projectId);

    if (!deletedProject) {
      res.status(404).send('Project not found');
    }

    res
      .status(202)
      .json({
        status: "success",
        message: "project deleted successfully",
      })

  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).send('Failed to delete project');
  }
};
const getAllProjects = async (req, res, next) => {
  try {
    const projects = await projectModel.find().populate({
      path: 'members',
      select: 'firstname lastname email'
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects. Please try again later.' });
  }
};

module.exports = { createProject, updateProjectMiddleware, deleteProjectMiddleware, getAllProjects }







