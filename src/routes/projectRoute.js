import express from 'express';

import {
    buildProjects,
    buildProjectDetails,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/projects', buildProjects);

router.get('/project/:id', buildProjectDetails);

// Route for new project page
router.get('/new-project', showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);

export default router;