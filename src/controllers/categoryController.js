
import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId
} from '../model/categories.js';

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

export {

    buildCategories,
    buildCategoryDetails
};

