import express from 'express';

import {
    buildProjects,
    buildProjectDetails,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/projects', buildProjects);

router.get('/project/:id', buildProjectDetails);

// Route for new project page
router.get('/new-project', showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);

// Route to display the edit project form
router.get('/edit-project/:id', showEditProjectForm);

// Route to handle edit project form submission
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

export default router;