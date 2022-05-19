const express = require('express');
const router = express.Router();
const axios = require('axios');
const tableauHelper = require('./tableau-helper');

//  /api/login endpoint
router.post('/', (req, res) => {

    //  Get the login credentails from the POST request
    const username = req.body.username,
          password = req.body.password;
    console.log(`Try authenticating as user: ${username}`)

    //    Get the tableau server/online details
    const tableau = tableauHelper.tableauDetails();

    //    Define the login url
    const loginUrl = `${tableau.baseUrl}/api/${tableau.apiVersion}/auth/signin`;

    //    Define the payload
    var body = {
        "credentials": {
            "name": username,
            "password": password,
            "site": {
                "contentUrl": tableau.site
            }
        }
    }

    // Define option
    var options = {
        'method':'POST',
        'headers': tableauHelper.tableauHeaders(),
        'data': body,
        'url': loginUrl
    }

    //  Make Login API call to Tableau
    axios(options)
    .then( response => {

        console.log(`Successfully authenticated user ${username}`)

        //    Get the api token and site id
        const token = response.data.credentials.token,
            siteId = response.data.credentials.site.id,
            tableauUserId = response.data.credentials.user.id;

        //    Return the complete data object
        res.send({
            'encryptedUserId': tableauHelper.encryptUsername(username),
            'tableauUserId': tableauUserId,
            'apiToken': token,
            'siteId': siteId,
            'tableauBaseUrl': tableauHelper.tableauEmbedBaseUrl()
        })
    })
    .catch(function (error) {
        console.log(`Error: Tableau threw an error while trying to authenticate user ${username}`)
        let errorData = tableauHelper.getProp(error.response.data.error, {'detail': `Error logging in as user ${username}`})
        res.send({
            'error': errorData
        })
    })
})

//  Expose the route
module.exports = router;