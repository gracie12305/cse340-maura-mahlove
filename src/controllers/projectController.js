import {
    getUpcomingProjects,
    getProjectDetails
} from '../model/projects.js';

import {
    getCategoriesByProjectId
} from '../model/categories.js';


const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

export {
    buildProjects,
    buildProjectDetails
};
