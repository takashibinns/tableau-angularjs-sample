# Tableau Embed API Reference: AngularJS
This project shows how to build a web app that embeds dashboards from Tableau Server/Online, using AngularJS.

# Project Setup
```
# Clone the repo
git clone https://github.com/takashibinns/tableau-angularjs-sample.git

# Change into the application code directory
cd tableau-embed-angular

# Install the Angular CLI
npm install -g @angular/cli@latest

# Install npm-run-all which allows you to run multiple commands at the same time
npm install npm-run-all -g --save-dev

# Install the application dependencies
npm install
```
This web app also requires some configuration via environment variables.  Create a new file named **.env** within the tableau-embed-api directory, and make sure it looks like this:
```
PORT=8080
TABLEAU_URL=<url-for-your-tableau-server-or-tableau-online>
TABLEAU_API_VERSION=3.15
TABLEAU_SITE=<name-of-tableau-site>
TABLEAU_PROJECT=<name-of-project-from-tableau>
TABLEAU_CONNECTEDAPP_CLIENTID=<client-id>
TABLEAU_CONNECTEDAPP_SECRETID=<secret-id>
TABLEAU_CONNECTEDAPP_SECRETVALUE=<secret-value>
ENCRYPTION_STRING=AnyTextWillWorkHere
APP_TOKEN_NAME=apptoken
```
* If you do not use sites on Tableau Server, just leave the TABLEAU_SITE variable blank
* TABLEAU_PROJECT is used to filter the list of dashboards available to the Angular app
* If you have not setup a connected app in Tableau before, check out the documentation [here](https://help.tableau.com/current/online/en-us/connected_apps.htm#create-a-connected-app)


##  Development
If you are looking to get this web app up and running locally in development mode, run the following commands to setup your project.
```
# Start the frontend (Angular) and backend (Express)
npm-run-all -l -p dev-angular dev-express
```
You should be able to access the running application at http://localhost:4200.  The back end is running on port 8080, but we use a proxy config to ensure everything is accessible through the same URL & port.

## Production
If you are looking to deploy this application in production, the build process is slightly different.  First we build the Angular app using ng build, and then we can host the static files using Node/Express
```
# Build the Angular App (output to dist folder)
ng build

# Run the Express node app
node src/backend/server.js
```
You should be able to access the running application at http://localhost:8080 (unless you changed the PORT environment variable).

## Docker
What if you want to deploy into a docker container? This project already contains a Dockerfile so you just need to run some standard docker commands:
```
# Build the docker image
docker build . -t tableau-embed-api-angular

# Start the image
run --env-file .env -p 8080:8080 tableau-embed-api-angular
```
