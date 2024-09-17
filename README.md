# NestJS Apply digital test

This repo has the source code for the apply digital NestJS Apply digital challenge. I'll post each of the features present on the application that successfully complies with the requirements needed in the challenge.

In order to run this project, you need to have properly installed the environment for NestJS and Docker, I'll leave the steps below:

# Running in Docker

For this, you need to have installed Docker into your system, you can check your installation with

```bash
$ docker -v
```

You will need a .env file that is not deployed. Provided is a .env.example that can be used as a .env file with just renaming it.

You can create a env file it with the following command:

```bash
$ cp .env.example .env
```

Including in this repo, it's a docker-compose file needed to properly run the project.
The first run it's recommended to run with this command:

```bash
$ docker compose up --build
```

This should start 3 docker containers, one for the NestJS, other for the PosgreSQL database and finally a PgAdmin manager to manage the PosgreSQL database.

The project is running in http://localhost:3000 and the root endpoint is a health-check. If everything is working you should see a text with:
**Server Working**

## First Run

When the project is properly running, you need to do the manual first fetch of the products, as stated in the challenge, this fetch runs with a cron job that executes every hour. In order to do the first fetch of products, you need to run from postman or any API Client this endpoint:

http://localhost:3000/products/fetch

This will return a:
{
"success": true
}
This endpoint is on the POSTMAN collection or you can run it from the API Swagger documentation.

Finally, some endpoints are private and authentication is needed for it to work.
For it, I included a fully CRUD set of endpoints regarding to users including (Sign In, Sign Up, Read All Users, Update a User and Delete a User)

You need to make a sign up of a user using this endpoint:
**POST: localhost:3000/auth/signup**

and then SignIn with the proper user:
**POST localhost:3000/auth/signin**

this will return a accessToken for your usage in the private modules (Reports)

If you need to see the API Swagger Docs for more information, you need to go to this url:
http://localhost:3000/api/docs

Finally the Postman Collection is on the repository, for it you need to import the Postman Environment and the collection.

# Development instantiation

## NodeJS installation

You need to have installed NodeJS into your development environment. The NodeJS version used as specified in the challenge is the latest LTS 20.17.0

You can check your version with this command:

```bash
$ node -v
```

## NestJS Quick Start

For the project to run you need to do a

```bash
$ npm install
```

Please follow-up this quick start from Nest:
https://docs.nestjs.com/first-steps

Afterward, please refer to the **Running in Docker** section in order to start a development ready NestJS server.

## Testing

To run the unit tests and coverage you need to run this command:

```bash
$ npm run test:cov
```

# Technical discussion and appreciations

The project is divided in modules and it connects to posgresql. It uses Husky for enforcing Conventional Commits and also ESLint Checking of the .ts files. The project uses gitflow and the commits and branches are fully displayed in the repo. The Github actions pipeline runs when pushing into develop (From a feature PR request), or when making a release and PR into the main branch. We could have the github action rules to prevent pushing without the test running but for this project it won't be necessary. This pipelines run unit tests that are currently instantiated into the project. The github actions don't run any linting due the fact is run locally in the client via Husky.

Also included is a .env.example file and has all the necessary variables needed to run the project in a dev environment. This .env file can be adapted to run into a production environment and we can follow the approach of having several .env files for each environment, or have a different .env file deployed in each of the environment.

Regarding testing, I think that would be optimal to reach at least 80% of the codebase but given time constraints developing this project, it has something near 40% of code coverage. Also for a real-life project, it would need as well a e2e testing of the application that fulfills all the requirements needed.

Regarding the database, given it's a development instantiation, it has the synchronization flag. An improvement would be to have a migration file to properly create all the databases needed, given the nature of this challenge and time constraints, I think migrations are not as necessary as other requirements in the challenge.

Regarding validations, it has some DTO's that validate the most required endpoints but I think it could be better improved with more DTO's and validations of some of the modules.

Regarding authentication, in a more production and real-life project, it could have benefited for using Passport.js as a middleware strategy for authentication. But the basic JWT strategy used I think for the purpose for this challenge is more than enough for the requirements needed.

Regarding serialization, it could have benefited to have some decorators that exclude some of the properties that are in some responses such as password.

Finally, given that we are using conventional commits, we can pair it up with Semantic Versioning and also have a CHANGELOG, this project just bumped the version to 1.0.0.

If any doubt, please feel free to reach and I will help you in no time.
