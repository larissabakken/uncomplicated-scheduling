# Uncomplicated Scheduling

Uncomplicated Scheduling is a web application for scheduling appointments, built with Next.js and React. It uses Next.js's server-side rendering capabilities to provide a fast and responsive user experience.

#### Acess the application [here](https://uncomplicated-scheduling.vercel.app).

## Features

- User authentication with NextAuth.js and Google OAuth
- Create appointments
- Send email reminders to clients using the Google API
- View appointments in a monthly calendar view
- Responsive design for mobile and desktop screens

## Technologies Used

- Next.js for server-side rendering and client-side JavaScript
- React.js for building the user interface
- TypeScript for type checking and improved code maintainability
- Prisma for interacting with the PostgreSQL database
- NextAuth.js for user authentication and authorization
- Google APIs for sending email reminders
- React Hook Form for form validation and handling
- React Query for data fetching and caching
- Day.js for date and time formatting
- Ignite UI for custom styling and UI components
- Next SEO for setting meta tags and improving search engine optimization
- ESLint for linting and code quality control

## Prerequisites

- Node.js 16.0.0 or later
- Docker

## Installation

1.  Clone the repository
2.  Install dependencies with `npm install`
3.  Create a `.env` file in the root directory and add the following environment variables on .env.example
4.  Install Docker on your local machine. You can dowlnoad it from [here](https://www.docker.com/products/docker-desktop)
5.  Use the following command to start a new MySQL container: `docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:latest`. This command will create a new MySQL container with the name "mysql-container", set the root password to "my-secret-pw", and run the latest version of MySQL.
6.  Once the container is running, you can use the following command to connect to the MySQL server: `docker exec -it mysql mysql -u root -p`. This command will connect to the MySQL server running in the container and log in as the root user.
7.  Install Prisma CLI with `npm install -g prisma`
8.  Run `npx prisma migrate dev` to create the database schema
9.  Run `npx prisma studio` to open the Prisma Studio GUI
10. Create a Google API key and set up OAuth credentials. You can follow the instructions [here](https://developers.google.com/calendar/quickstart/nodejs) to get started.
11. Set the Google API credentials in a .env.local file (see .env.example for reference)
12. Run `npm run dev` to start the development server

## Deployment

This application can be deployed to a hosting service Vercel [here](https://uncomplicated-scheduling.vercel.app).
Using PlanetScale to deploy the application backend to the cloud.[here](https://docs.planetscale.com/tutorials/deploy-nextjs)

##### Contributions are welcome! Feel free to open a pull request or an issue if you have any suggestions or find any bugs.
