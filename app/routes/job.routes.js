const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const isAuth = require('../middlewares/isAuth');
const { body } = require('express-validator');

// Routes
router.post('/jobs', isAuth,
    [
        body('title', `title should at least 3 characters`).isLength({ min: 3 }),
        body('category', `category is required`).notEmpty(),
        body('type', `type is required`).notEmpty(),
        body('description', `description is required`).notEmpty(),
        body('salary', `salary is required`).notEmpty(),
    ], jobController.createJob);  // Create job (POST)
router.get('/job-list', isAuth, jobController.getJobs);     // View jobs (GET)
router.put('/jobs/:id', isAuth, jobController.updateJob); // Edit job (PUT)
router.patch('/jobs/:id', isAuth, jobController.updateJob); // Partial edit job (PATCH)
router.delete('/jobs/:id', isAuth, jobController.deleteJob); // Remove job (DELETE)

module.exports = router;
