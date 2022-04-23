const express = require('express');
const router = express.Router();
const axios = require('axios');
const tableauHelper = require('./tableau-helper');

//  Get an authentication token using our connected app
router.get('/', (req, res) => {

	//  Get the API Token needed to talk to Tableau
    const token = req.query.apiToken,
          siteId = req.query.siteId,
          workbookId = req.query.workbookId,
          viewId = req.query.viewId;

	//	Get the tableau server/online details
	const tableau = tableauHelper.tableauDetails();

    //	Define the login url
    const url = `${tableauHelper.tableauRestBaseUrl(siteId)}/workbooks/${workbookId}/views/${viewId}/previewImage`;

	// Define option
	var options = {
		'method':'GET',
        'headers': {
            'x-tableau-auth': token
        },
		'url': url
	}

    //  Make Login API call to Tableau for all views within a project
    axios(options)
    .then( response => {
        
        //	Tableau Server responds with an string containing the image in PNG format, handle the base64 decoding client side
        res.send({
            data: response.data
        });
    })
    .catch(function (error) {
        console.log(`Error: Tableau threw an error while trying to fetch dashboards preview image via REST API`)
        console.log(error);
        res.send({
            error: true
        })
    })
})

//  Expose the route
module.exports = router;