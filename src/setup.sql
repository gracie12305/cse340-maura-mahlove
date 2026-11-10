
-- =========================================
-- SERVICE NETWORK DATABASE SETUP
-- =========================================

-- Drop existing tables in the correct order
-- so the database can be recreated from scratch.

DROP TABLE IF EXISTS project_categories CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS organization CASCADE;


-- =========================================
-- 1. ORGANIZATION TABLE
-- =========================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization
(name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'info@unityserve.org',
    'unityserve-logo.png'
);


-- =========================================
-- 2. PROJECT TABLE
-- =========================================

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    organization_id INT NOT NULL,
    FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
);

INSERT INTO project
(project_name, description, organization_id)
VALUES
(
    'Park Cleanup',
    'Join us to clean up local parks and make them beautiful!',
    (SELECT organization_id FROM organization
     WHERE name = 'UnityServe Volunteers')
),
(
    'Food Drive',
    'Help collect and distribute food to those in need.',
    (SELECT organization_id FROM organization
     WHERE name = 'GreenHarvest Growers')
),
(
    'Community Tutoring',
    'Volunteer to tutor students in various subjects.',
    (SELECT organization_id FROM organization
     WHERE name = 'BrightFuture Builders')
);


-- =========================================
-- 3. CATEGORIES TABLE
-- =========================================

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO categories (category_name)
VALUES
('Environmental'),
('Food Support'),
('Education');


-- =========================================
-- 4. PROJECT-CATEGORIES JUNCTION TABLE
-- =========================================

CREATE TABLE project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);


-- =========================================
-- 5. ASSOCIATE PROJECTS WITH CATEGORIES
-- =========================================

INSERT INTO project_categories (project_id, category_id)
VALUES
(
    (SELECT project_id FROM project
     WHERE project_name = 'Park Cleanup'),
    (SELECT category_id FROM categories
     WHERE category_name = 'Environmental')
),
(
    (SELECT project_id FROM project
     WHERE project_name = 'Food Drive'),
    (SELECT category_id FROM categories
     WHERE category_name = 'Food Support')
),
(
    (SELECT project_id FROM project
     WHERE project_name = 'Community Tutoring'),
    (SELECT category_id FROM categories
     WHERE category_name = 'Education')
);


-- =========================================
-- 6. VIEW DATABASE CONTENTS
-- =========================================

SELECT * FROM organization;
SELECT * FROM project;
SELECT * FROM categories;
SELECT * FROM project_categories;
