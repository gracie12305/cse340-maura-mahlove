import { body, validationResult } from 'express-validator';

import {
    getAllOrganizations,
    getOrganizationDetails,
    getProjectsByOrganizationId,
    createOrganization,
    updateOrganization
} from '../model/organizations.js';

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

const buildOrganizations = async (req, res) => {
    const organizations = await getAllOrganizations();

    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

const buildOrganizationDetails = async (req, res) => {
    const id = req.params.id;

    const organization = await getOrganizationDetails(id);

    if (!organization) {
        return res.status(404).render('404', {
            title: 'Page Not Found'
        });
    }

    const projects = await getProjectsByOrganizationId(id);

    const title = 'Organization Details';

    res.render('organization', {
        title, organization,
        projects
    });
};

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
};


const processNewOrganizationForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations    

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    req.flash('success', 'Organization added successfully!');
    res.redirect(`/organization/${organizationId}`);
};

const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);

    const title = 'Edit Organization';
    res.render('edit-organization', { title, organizationDetails });
};

const processEditOrganizationForm = async (req, res) => {

    const organizationId = req.params.id;

    // Check for validation errors
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-organization/${organizationId}`);
    }

    // Get the submitted form data
    const { name, description, contactEmail, logoFilename } = req.body;

    // Update the organization in the database
    await updateOrganization(
        organizationId,
        name,
        description,
        contactEmail,
        logoFilename
    );

    // Display success message
    req.flash('success', 'Organization updated successfully!');

    // Redirect to organization details
    res.redirect(`/organization/${organizationId}`);
};


export {
    buildOrganizations,
    buildOrganizationDetails,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
};
