import express from 'express';

import { fileURLToPath } from 'url';
import path from 'path';

import { testConnection } from './src/model/db.js';

import {
    getAllOrganizations,
    getOrganizationDetails
} from './src/model/organizations.js';

import { getAllCategories } from './src/model/categories.js';

import {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails
} from './src/model/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;


const NODE_ENV = process.env.NODE_ENV?.toLowerCase() ||
    'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * Configure Express middleware
 */

//Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next(); // Pass control to the next middleware or route
});

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    console.log(organizations);

    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
});

app.get('/organization/:id', async (req, res) => {
    const id = req.params.id;

    const organization = await getOrganizationDetails(id);

    const title = 'Organization Details';

    res.render('organization', { title, organization });
});



app.get('/projects', async (req, res) => {
    const title = 'Upcoming Service Projects';
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render('projects', { title, projects });
});


app.get('/project/:id', async (req, res) => {
    const id = req.params.id;

    const project = await getProjectDetails(id);

    const title = 'Project Details';

    res.render('project', { title, project });
});




app.get('/categories', async (req, res) => {
    const title = 'Service Project Categories';
    const categories = await getAllCategories();

    res.render('categories', { title, categories });
});



// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));


app.listen(PORT, async () => {

    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
        process.exit(1);
    }
});