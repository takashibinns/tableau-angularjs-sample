const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv');

//  Load environment variables
dotenv.config();
const port = process.env.PORT || 8080

// Create new instance of the express server
var app = express();

// Define the JSON parser as a default way 
// to consume and produce data through the 
// exposed APIs
app.use(bodyParser.json());

// Create link to Angular build directory
// The `ng build` command will save the result
// under the `dist/tableau-embed-angular` folder.
var distDir = './dist/tableau-embed-angular';
app.use(express.static(distDir));

// Init the server
var server = app.listen(port, function () {
    var port = server.address().port;
    console.log(`App now running on port ${port}`);
});

/*  "/api/status"
 *   GET: Get server status
 *   PS: it's just an example, not mandatory
 */
app.get("/api/status", function (req, res) {
    res.status(200).json({ status: "UP" });
});

//	Define the API endpoints
var routeJwt = require('./jwt');
var routeLogin = require('./login');
var routeDashboards = require('./dashboards');
var routeDashboardPreview = require('./dashboardPreview');
app.use('/api/jwt', routeJwt);
app.use('/api/login', routeLogin);
app.use('/api/dashboards', routeDashboards);
app.use('/api/dashboardPreview', routeDashboardPreview);