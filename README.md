# PSU DevBoards Front End

[![CI/CD](https://github.com/PSU-DevBoards/devboards-front-end/actions/workflows/main.yml/badge.svg)](https://github.com/PSU-DevBoards/devboards-front-end/actions/workflows/main.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=PSU-DevBoards_devboards-front-end&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=PSU-DevBoards_devboards-front-end)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=PSU-DevBoards_devboards-front-end&metric=bugs)](https://sonarcloud.io/summary/new_code?id=PSU-DevBoards_devboards-front-end)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=PSU-DevBoards_devboards-front-end&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=PSU-DevBoards_devboards-front-end)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=PSU-DevBoards_devboards-front-end&metric=coverage)](https://sonarcloud.io/summary/new_code?id=PSU-DevBoards_devboards-front-end)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=PSU-DevBoards_devboards-front-end&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=PSU-DevBoards_devboards-front-end)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=PSU-DevBoards_devboards-front-end&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=PSU-DevBoards_devboards-front-end)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=PSU-DevBoards_devboards-front-end&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=PSU-DevBoards_devboards-front-end)

Front-end application for the PSU DevBoards system. Provides users with a SCRUM board to track features, stories, and tasks.

## Requirements

For building and running the application you need:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

## Environment Variables

The following environment variables are required. You can either manually export these variables into your current environment or copy `.env.example` to `.env` and fill in the variables.

| Name                         | Value | Description                                  |
| ---------------------------- | ----- | -------------------------------------------- |
| REACT_APP_AUTH0_DOMAIN       |       | Domain of your Auth0 Organization.           |
| REACT_APP_AUTH0_CLIENT_ID    |       | Client ID for your Auth0 SPA Application.    |
| REACT_APP_AUTH0_API_AUDIENCE |       | The Audience of your devboards-back-end      |
| REACT_APP_DBAPI_BASE_URL     |       | Base url of your running devboards-back-end. |

## Running Locally

You can run the application by with the command `npm start`

## Deployment

This application is deployed to [Heroku](https://heroku.com) via CD on the master branch.

App Url: https://psu-devboards-frontend.herokuapp.com/
