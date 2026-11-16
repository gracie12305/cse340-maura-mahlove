import express from 'express';

import {
    buildOrganizations,
    buildOrganizationDetails
} from '../controllers/organizationController.js';

const router = express.Router();

router.get('/organizations', buildOrganizations);

router.get('/organization/:id', buildOrganizationDetails);

export default router;