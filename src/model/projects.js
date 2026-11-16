
import db from './db.js'

const getAllProjects = async () => {
    const query = `
        SELECT
            p.project_id,
            p.project_name,
            p.description,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_id;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            p.project_id,
            p.project_name AS title,
            p.description,
            p.date,
            p.location,
            o.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;

    const result = await db.query(query, [number_of_projects]);

    return result.rows;
}

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            p.project_id,
            p.project_name AS title,
            p.description,
            p.date,
            p.location,
            o.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
}

export {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails
};



