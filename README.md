# TeamUp
TeamUp is a web application for teams to collaborate. Built using the MERN stack (MongoDB, Express.js, React, and Node.js).

## Current Features

- Sign up and sign in as a user
- view all users who have signed up.
- User info is stored in a MondoDB database provisioned through Heroku and MLab.

## Upcoming Features
Immediate goals:
- A user can create a team
- Admin user (team creator by default) can invite other users to join a team (max 10 users per team)
- A user can view their team invitations and accept/join teams
- A user can view a list of their teams
- A user can select one of their teams to view the other members of the team

### How to install and run the app

#### Dependencies
In the root directory, run the command `npm install` to install dependencies for the backend.

cd into the msights-client directory, and run the command `npm install` to install dependencies for the front end React App

#### Front End App
To start a development server running the React App front end, cd into the frontend directory, and run the command `npm start` to start the development server at localhost:3000.

#### Back End server
To start the express server locally (development environment), from the root directory, run the command `npm run dev` to start the development server using nodemon.

#### How to access the database
The Dtabase was provisioned using Heroku's MLab add-on feature. The Backend server connects to the database using the DB URI, which is in the .env file at /backend/.env. As a production app, all of the files containing secret keys would be included in .gitignore.

#### Database schema/design
The Database has a collection called 'users.' Each User has a first name, last name, email, password, and creation date. From the root directory, cd into the 'schemas' directory and see the file 'User.js.'




