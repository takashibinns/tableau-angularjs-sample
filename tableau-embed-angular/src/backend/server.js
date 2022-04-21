const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')

//  Load environment variables
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 8080
const tableauBaseUrl =  process.env.TABLEAU_URL || 'https://online.tableau.com'
const tableauSite =  process.env.TABLEAU_SITE || ''
const tableauProject = process.env.TABLEAU_PROJECT || 'default'
const tableauConnectedAppId =  process.env.TABLEAU_CONNECTEDAPP_CLIENTID || ''
const tableauConnectedAppSecretId =  process.env.TABLEAU_CONNECTEDAPP_SECRETID || ''
const tableauConnectedAppSecretValue =  process.env.TABLEAU_CONNECTEDAPP_SECRETVALUE || ''

// Create new instance of the express server
var app = express();

// Define the JSON parser as a default way 
// to consume and produce data through the 
// exposed APIs
app.use(bodyParser.json());

// Create link to Angular build directory
// The `ng build` command will save the result
// under the `dist/tableau-embed-angular` folder.
var distDir = "./dist/tableau-embed-angular";
app.use(express.static(distDir));

// Init the server
var server = app.listen(port, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

/*  "/api/status"
 *   GET: Get server status
 *   PS: it's just an example, not mandatory
 */
app.get("/api/status", function (req, res) {
    res.status(200).json({ status: "UP" });
});