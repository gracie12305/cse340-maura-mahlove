import express from 'express';

import { fileURLToPath } from 'url';
import path from 'path';

import { testConnection } from './src/model/db.js';


import categoryRoute from './src/routes/categoryRoute.js';
import organizationRoute from './src/routes/organizationRoute.js';
import projectRoute from './src/routes/projectRoute.js';



const NODE_ENV = process.env.NODE_ENV?.toLowerCase() ||
    'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));


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

app.use('/', categoryRoute);
app.use('/', organizationRoute);
app.use('/', projectRoute);

/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', { title: 'Internal Server Error' });
});


// Set EJS as the templating engine


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