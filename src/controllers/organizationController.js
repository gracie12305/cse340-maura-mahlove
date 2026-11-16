
import {
    getAllOrganizations,
    getOrganizationDetails,
    getProjectsByOrganizationId
} from '../model/organizations.js';

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

export {
    buildOrganizations,
    buildOrganizationDetails
};
