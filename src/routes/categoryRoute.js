import express from 'express';

import {
    buildCategories,
    buildCategoryDetails
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/categories', buildCategories);

router.get('/category/:id', buildCategoryDetails);

export default router;