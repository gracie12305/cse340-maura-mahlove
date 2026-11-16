import express from 'express';

import {
    buildProjects,
    buildProjectDetails
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/projects', buildProjects);

router.get('/project/:id', buildProjectDetails);

export default router;