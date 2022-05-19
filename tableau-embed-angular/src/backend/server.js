const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const path = require('path');

//  Load environment variables
dotenv.config();
const port = process.env.PORT || 8080

// Create new instance of the express server
var app = express();

/***********************************************/
/*   Backend: API endpoints                    */
/***********************************************/

// Define the JSON parser as a default way 
// to consume and produce data through the 
// exposed APIs
app.use(bodyParser.json());

//  Sample route handler
app.get('/api/status', function(req, res){
    res.send({'status': 'UP'})
});

const routeLogin = require('./login');
app.use('/api/login', routeLogin);
const routeJwt = require('./jwt');
app.use('/api/jwt', routeJwt);
const routeDashboards = require('./dashboards');
app.use('/api/dashboards', routeDashboards);
const routeDashboardPreview = require('./dashboardPreview');
app.use('/api/dashboardPreview', routeDashboardPreview);
const routeDashboardFavorite= require('./dashboardFavorite');
app.use('/api/dashboardFavorite', routeDashboardFavorite);
const routeDashboardExport= require('./dashboardExport');
app.use('/api/dashboardExport', routeDashboardExport);

/***********************************************/
/*    Frontend: Angular App                    */
/***********************************************/

// under the `dist/tableau-embed-angular` folder.
const cwd = process.cwd()

// Create link to Angular build directory
// The `ng build` command will save the result
var distDir = path.resolve(cwd,'dist','tableau-embed-angular');
app.use(express.static(distDir));

//  Using Angular routing, so send all requests to index.html and handle via JS
app.all('/*', function(req, res, next) {
    res.sendFile('index.html', { root: distDir });
});

/***********************************************/
/*    Initialize the server                    */
/***********************************************/
var server = app.listen(port, function () {
    var port = server.address().port;
    console.log(`App now running on port ${port}`);
});