const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
//const CryptoJS = require('crypto-js');
const tableauHelper = require('./tableau-helper');

//  Load environment variables
const dotenv = require('dotenv');
dotenv.config();
const tableauConnectedAppId =  process.env.TABLEAU_CONNECTEDAPP_CLIENTID || ''
const tableauConnectedAppSecretId =  process.env.TABLEAU_CONNECTEDAPP_SECRETID || ''
const tableauConnectedAppSecretValue =  process.env.TABLEAU_CONNECTEDAPP_SECRETVALUE || ''

//  Get an authentication token using our connected app
router.get('/', (req, res) => {

	//	Decript the username, using our secure key
    const username = tableauHelper.decryptUserId(req.query.encryptedUserId);

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

//  Expose the route
module.exports = router;