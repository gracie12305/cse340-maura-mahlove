
import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments
} from '../model/categories.js';

import { getProjectDetails } from '../model/projects.js';

const buildCategories = async (req, res) => {
    const title = 'Service Project Categories';

    const categories = await getAllCategories();

    res.render('categories', { title, categories });
};

const buildCategoryDetails = async (req, res) => {
    const id = req.params.id;

    const category = await getCategoryDetails(id);

    if (!category) {
        return res.status(404).render('404', {
            title: 'Page Not Found'
        });
    }

    const projects = await getProjectsByCategoryId(id);

    const title = 'Category Details';

    res.render('category', {
        title,
        category,
        projects
    });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);

};

export {

    buildCategories,
    buildCategoryDetails,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};

