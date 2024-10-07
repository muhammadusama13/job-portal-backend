const { validationResult } = require('express-validator');
const Job = require('../models/job.model');

// Create a new job
exports.createJob = async (req, res) => {

  try {
    const validErrors = validationResult(req);

    if (!validErrors.isEmpty()) {
      const errorDetail = validErrors.array().map((error) => {
        return error.msg;
      });

      const error = new Error('Input Validation Error');
      error.detail = errorDetail;
      error.status = 422;
      throw error;
    }
    const { title, description, salary, type, category } = req.body;
    console.log("title", title)
    const creator = req.userId;

    const job = new Job({
      title,
      description,
      salary,
      creator,
      type,
      category
    });

    await job.save();
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create job', detail: error.detail });
  }
};

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const creator = req.userId;
    const jobs = await Job.find({ creator: creator }).populate('creator', 'name email'); // Populating creator details from User
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve jobs', error: error.message });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const creator = req.userId;
    const updatedJob = await Job.findOneAndUpdate({ _id: id, creator: creator }, req.body, { new: true });

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job updated successfully', updatedJob });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update job', error });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job', error });
  }
};
