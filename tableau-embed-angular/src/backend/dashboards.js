const express = require('express');
const router = express.Router();
const axios = require('axios');
const tableauHelper = require('./tableau-helper');

//  Get an authentication token using our connected app
router.get('/', (req, res) => {

	//  Get the API Token needed to talk to Tableau
    const token = req.query.apiToken;
    const siteId = req.query.siteId;

	//	Get the tableau server/online details
	const tableau = tableauHelper.tableauDetails();

    //	Define the login url
    const url = `${tableauHelper.tableauRestBaseUrl(siteId)}/views?includeUsageStatistics=true&fields=_all_&?filter=projectName:eq:${tableau.project}&pageSize=1000`;

	// Define option
	var options = {
		'method':'GET',
        'headers': tableauHelper.tableauHeaders(token),
		'url': url
	}

    //  Make Login API call to Tableau for all views within a project
    axios(options)
    .then( response => {

        //  Make sure we got back a list of views
        let allViews = tableauHelper.getProp(() => response.data.views.view, [])

        //  View could be a dashboard, metric, or sheet.  Let's filter to only return dashboards
        let dashboards = allViews.filter( view => {
            return view.sheetType === 'dashboard';
        })
        
        //	Return the complete data object
        res.send({
            data: dashboards
        });
    })
    .catch(function (error) {
        console.log(`Error: Tableau threw an error while trying to fetch dashboards via REST API`)
        console.log(error);
        res.send({
            error: true
        })
    })
})

//  Expose the route
module.exports = router;