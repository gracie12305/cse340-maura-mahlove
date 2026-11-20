import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
} from '../model/projects.js';

import {
    getAllOrganizations
} from '../model/organizations.js';




import {
    getCategoriesByProjectId
} from '../model/categories.js';

import { body, validationResult } from 'express-validator';


const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];


const buildProjects = async (req, res) => {
    const title = 'Upcoming Service Projects';

    const projects = await getUpcomingProjects(
        NUMBER_OF_UPCOMING_PROJECTS
    );

    res.render('projects', { title, projects });
};

const buildProjectDetails = async (req, res) => {
    const id = req.params.id;

    const project = await getProjectDetails(id);
    const categories = await getCategoriesByProjectId(id);

    if (!project) {
        return res.status(404).render('404');
    }

    const title = 'Project Details';

    res.render('project', {
        title,
        project,
        categories
    });
};



const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}


const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        const newProjectId = await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'New service project created successfully!');
        return res.redirect(`/project/${newProjectId}`);

    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        return res.redirect('/new-project');
    }
};


const showEditProjectForm = async (req, res) => {
    const id = req.params.id;

    const projectDetails = await getProjectDetails(id);
    const organizations = await getAllOrganizations();

    const title = 'Edit Service Project';

    res.render('edit-project', {
        title,
        projectDetails,
        organizations
    });
};

const processEditProjectForm = async (req, res) => {
    const id = req.params.id;

    const { title, description, location, date, organizationId } = req.body;

    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-project/${id}`);

    }

    try {
        await updateProject(id, title, description, location, date, organizationId);

        req.flash('success', 'Service project updated successfully!');
        return res.redirect(`/project/${id}`);

    } catch (error) {
        console.error('Error updating service project:', error);
        req.flash('error', 'There was an error updating the service project.');
        return res.redirect(`/edit-project/${id}`);
    }

};


export {
    buildProjects,
    buildProjectDetails,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm

};
