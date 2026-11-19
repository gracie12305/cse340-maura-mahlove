import express from 'express';

import {
    buildCategories,
    buildCategoryDetails,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/categories', buildCategories);

router.get('/category/:id', buildCategoryDetails);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

export default router;