
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


const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO project (project_name, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};



const updateProject = async (id, title, description, location, date, organizationId) => {
    const query = `
        UPDATE project
        SET project_name = $1,
            description = $2,
            location = $3,
            date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId, id];
    const result = await db.query(query, queryParams);

    if (result.rowCount === 0) {
        throw new Error('Failed to update project');

    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', id);
    }

    return result.rows[0].project_id;
};


export {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
};



