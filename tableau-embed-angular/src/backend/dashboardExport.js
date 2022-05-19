const express = require('express');
const router = express.Router();
const axios = require('axios');
const tableauHelper = require('./tableau-helper');

//  Get an authentication token using our connected app
router.get('/', (req, res) => {

    //  Get the API Token needed to talk to Tableau
    const token = req.query.apiToken,
          siteId = req.query.siteId,
          viewId = req.query.viewId;

    //    Define the login url
    const url = `${tableauHelper.tableauRestBaseUrl(siteId)}/views/${viewId}/pdf`;

    // Define option
    var options = {
        'method':'GET',
        'responseType': 'arraybuffer',
        'headers': {
            'x-tableau-auth': token
        },
        'url': url
    }

    //  Make Login API call to Tableau for all views within a project
    axios(options)
    .then( response => {

        //  Just forward the response from Tableau
        res.set('Content-Type', 'application/pdf')
        res.send(response.data);
    })
    .catch(function (error) {
        console.log(`Error: Tableau threw an error while trying to export dashboards as PDF via REST API`)
        console.log(error);
        res.send({
            error: true
        })
    })
})

//  Expose the route
module.exports = router;