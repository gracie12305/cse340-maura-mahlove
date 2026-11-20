
import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../model/categories.js';

import { getProjectDetails } from '../model/projects.js';

import { validationResult } from 'express-validator';

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

const buildNewCategory = async (req, res) => {
    const title = 'Add New Category';

    res.render('new-category', { title });
};

const processNewCategory = async (req, res) => {
    const { categoryName } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-category');
    }

    try {
        await createCategory(categoryName);

        req.flash('success', 'New category created successfully!');
        return res.redirect('/categories');

    } catch (error) {
        console.error('Error creating category:', error);
        req.flash('error', 'There was an error creating the category.');
        return res.redirect('/new-category');
    }
};

const buildEditCategory = async (req, res) => {
    const id = req.params.id;

    const category = await getCategoryDetails(id);

    const title = 'Edit Category';

    res.render('edit-category', { title, category });
};

const processEditCategory = async (req, res) => {
    const id = req.params.id;
    const { categoryName } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-category/${id}`);
    }

    try {
        await updateCategory(id, categoryName);

        req.flash('success', 'Category updated successfully!');
        return res.redirect('/categories');

    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'There was an error updating the category.');
        return res.redirect(`/edit-category/${id}`);
    }
};

export {

    buildCategories,
    buildCategoryDetails,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    buildEditCategory,
    processEditCategory,
    buildNewCategory,
    processNewCategory
};

