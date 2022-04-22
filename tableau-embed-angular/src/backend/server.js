const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const querystring = require('querystring');  
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const CryptoJS = require('crypto-js');
const axios = require('axios');

//  Load environment variables
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 8080
const encryptionString = process.env.ENCRYPTION_STRING || 'DefaultEncryptionString'
const tableauBaseUrl =  process.env.TABLEAU_URL || 'https://online.tableau.com'
const tableauApiVersion =  process.env.TABLEAU_API_VERSION || '3.15'
const tableauSite =  process.env.TABLEAU_SITE || ''
const tableauProject = process.env.TABLEAU_PROJECT || 'default'
const tableauPatName = process.env.TABLEAU_PAT_NAME || ''
const tableauPatValue = process.env.TABLEAU_PAT_VALUE || ''
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

//  Get an authentication token using our connected app
app.get('/api/jwt', (req, res) => {

	//	Decript the username, using our secure key
	// var username = req.query.encryptedUserId;
	var reb64 = CryptoJS.enc.Hex.parse(req.query.encryptedUserId);
	var bytes = reb64.toString(CryptoJS.enc.Base64);
	var decrypt = CryptoJS.AES.decrypt(bytes, encryptionString);
	var username = decrypt.toString(CryptoJS.enc.Utf8);

    console.log(`Creating connected app auth token for ${username}`);

	//	Create a JWT token
	let now = new Date()
	let expirationDate = (now.getTime() / 1000) + (5 * 60)	    //	5 minutes from now
	let payload = {
        'iss': tableauConnectedAppId,	                        //	Connected App's ID
        'exp': expirationDate,		
		'jti': uuidv4(),			                            //	Unique identifier for this JWT
		'aud': 'tableau',			                            //	constant value
		'sub': username,			                            //	User to authenticate as
		'scp': ['tableau:views:embed', 'tableau:metrics:embed']	//	Scopes
    }
	let options = {
		'header': {
			'kid': tableauConnectedAppSecretId,
			'iss': tableauConnectedAppId,
		},
		'algorithm': 'HS256'
	}
    const token = jwt.sign(payload, tableauConnectedAppSecretValue, options);

	res.send({'connectedAppToken':token})
})

//  Authenticate, using Tableau Server
app.post('/api/login', (req, res) => {
    
    //  Get the login credentails from the POST request
    const username = req.body.username,
        password = req.body.password;
    console.log(`Try authenticating as user: ${username}`)

    //	Define the login url
    const loginUrl = `${tableauBaseUrl}/api/${tableauApiVersion}/auth/signin`;

	//	Define the payload
	var body = {
		"credentials": {
		    "name": username,
		    "password": password,
		    "site": {
		        "contentUrl": tableauSite
		    }
		}
	}

	// Define option
	var options = {
		'method':'POST',
        'headers': {
			'Content-Type':'application/json',
			'Accept':'application/json'
		},
		'data': body,
		'url': loginUrl
	}

    //  Make Login API call to Tableau
    axios(options)
    .then( response => {

        console.log(`Successfully authenticated user ${username}`)

        //	Get the api token and site id
		const token = response.data.credentials.token,
            siteId = response.data.credentials.site.id;

        //  Encrypt the Tableau username, for an added layer of security
        var b64 = CryptoJS.AES.encrypt(username, encryptionString).toString();
            e64 = CryptoJS.enc.Base64.parse(b64),
            encryptedUserId = e64.toString(CryptoJS.enc.Hex);

        //	Return the complete data object
        res.send({
            'encryptedUserId': encryptedUserId,
            'apiToken': token,
            'siteId': siteId
        })
    })
    .catch(function (error) {
        console.log(`Error: Tableau threw an error while trying to authenticate user ${username}`)
        console.log(error);
        res.send({})
    })
})