
import db from './db.js'

const getAllCategories = async () => {
    const query = `
        SELECT category_id, category_name
        FROM public.categories
        ORDER BY category_name;
    `;

    const result = await db.query(query);

    return result.rows;
}


const getCategoryDetails = async (id) => {
    const query = `
        SELECT category_id, category_name
        FROM public.categories
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
}

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            p.project_id,
            p.project_name,
            p.description
        FROM public.project p
        JOIN public.project_categories pc
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_name;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows;
}

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            c.category_id,
            c.category_name
        FROM public.categories c
        JOIN public.project_categories pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows;
}

export {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByProjectId
};