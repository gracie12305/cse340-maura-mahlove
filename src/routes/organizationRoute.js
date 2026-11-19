import express from 'express';

import {
    buildOrganizations,
    buildOrganizationDetails,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm

} from '../controllers/organizationController.js';

const router = express.Router();

router.get('/organizations', buildOrganizations);

router.get('/new-organization', showNewOrganizationForm);

router.get('/organization/:id', buildOrganizationDetails);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);


export default router;