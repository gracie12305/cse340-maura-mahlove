import express from 'express';

import {
    buildCategories,
    buildCategoryDetails,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    buildEditCategory,
    processEditCategory,
    buildNewCategory,
    processNewCategory
} from '../controllers/categoryController.js';

import { body } from 'express-validator';

const categoryNameRules = () => {
    return [
        body('categoryName')
            .trim()
            .notEmpty()
            .withMessage('Category name is required.')
            .bail()
            .isLength({ min: 3, max: 100 })
            .withMessage('Category name must be between 3 and 100 characters.')
    ];
};

const router = express.Router();

router.get('/categories', buildCategories);

router.get('/category/:id', buildCategoryDetails);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

router.get('/edit-category/:id', buildEditCategory);
router.post('/edit-category/:id', categoryNameRules(), processEditCategory);

router.get('/new-category', buildNewCategory);
router.post('/new-category', categoryNameRules(), processNewCategory);


export default router;