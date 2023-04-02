# Banana Project

This is a one-page documentation for the Banana Project. This project is primarily made for the HKUGACollege student-ran 'College Insider'. Please edit to fit usage purposes when forked.

## Overview

The Banana Project is a website that allows users to read and write articles. The project has both front-end and back-end components, and it is built using Node.js, Express.js, and MongoDB.

## Getting Started

To run the Banana Project, follow the instructions below:

1. Clone the repository using the following command:
   
```git clone https://github.com/DashingNights/banana.git```


2. Install the dependencies using the following command:

```npm install```


3. Start the server using the following command:

```npm run devStart```


4. Access the website at `http://localhost:1234`

## Front-end

The front-end of the Banana Project is built using HTML, CSS, and JavaScript. The front-end code is located in the `views` directory. The `views` directory contains the files.

## Back-end

The back-end of the Banana Project is built using Node.js, Express.js, and MongoDB. The back-end code is located in the `routes` and `models` directories.

### Routes

The `routes` directory contains the following files:

- `index.js`: The file that defines the main routes for the website.

- `articles.js`: The file that defines the routes for handling articles.

- `auth.js`: The file that defines the routes for handling authentication.

The routes are responsible for handling incoming HTTP requests and returning responses to the client. The routes use the models to interact with the database.

### Models

The `models` directory contains the following files:

- `article.js`: The file that defines the schema and model for articles.

- `user.js`: The file that defines the schema and model for users.

The models are responsible for interacting with the database. They define the schemas for the data and provide methods for querying and modifying the data.

### Middleware

The `middleware` directory contains the following files:

- `authMiddleware.js`: The file that defines the middleware for handling authentication.

- `requireAuth.js`: The file that defines the middleware for requiring authentication.

The middleware is responsible for processing the incoming requests before they reach the routes. The middleware can perform actions such as checking for authentication and modifying the request.

## Authentication

The Banana Project uses JSON Web Tokens (JWTs) for authentication. When a user logs in, a JWT is created and stored in a cookie. The JWT contains the user ID, which is used to identify the user on subsequent requests.

The Banana Project also has two types of users: regular users and admin users. Admin users have additional privileges, such as being able to delete articles.

## Conclusion

The Banana Project is a website that allows users to read and write articles. The project has both front-end and back-end components, and it is built using Node.js, Express.js, and MongoDB. The project uses JWTs for authentication and has two types of users: regular users and admin users.```

This documentation explains the Banana Project, how it works, and how to run it. It covers both the front-end and back-end components, including the routes, models, and middleware. It also explains how authentication works in the project.
