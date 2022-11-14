

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# watch mode
$ npm run start

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## CREATE A SERVER WITH BASIC AUTHENTICATION AND AUTHORIZATION API,SO THE USER CAN REGISTER AND LOG IN. HANDLE ERRORS AND EXCEPTIONS FOR EVERY REQUEST. 
TECHNOLOGIES: NEST.JS, MONGODB (mongoose), JWT. 
● /auth/sign-in - public route that accepts HTTP POST requests containing a username and password in the body. If the username and password are correct then a JWT authentication token and the user details are returned in the response body, and a refresh token cookie (HTTP Only) is returned in the response headers. 
● /auth/sign-up - public route that accepts HTTP POST requests containing a username and password in the body. The password should be stored hashed. 
● /auth/logout - secure route that accepts HTTP POST requests and invalidates the refresh token. 
● /auth/refresh-token - public route that accepts HTTP POST requests with a refresh token cookie. If the cookie exists and the refresh token is valid then a new JWT authentication token and the user details are returned in the response body, a new refresh token cookie (HTTP Only) is returned in the response headers and the old refresh token is revoked. 
● /auth/revoke-token - secure route that accepts HTTP POST requests containing a refresh token either in the body or in a cookie, if both are present the token in the body is used. If the refresh token is valid and active then it is revoked and can no longer be used to refresh JWT tokens.
● /users - secure route that accepts HTTP GET requests and returns a list of all the users in the application if the HTTP Authorization header contains a valid JWT token. If there is no auth token or the token is invalid then a 401 Unauthorized response is returned. 
● /users/{id} - secure route that accepts HTTP GET requests and returns the details of the user with the specified id. 
● /users/{id}/refresh-tokens - secure route that accepts HTTP GET requests and returns a list of all refresh tokens (active and revoked) of the user with the specified id. 
● * -- /api-docs - swagger documentation for the api 

