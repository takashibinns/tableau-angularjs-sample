const express = require('express');
const router = express.Router();
const axios = require('axios');
const tableauHelper = require('./tableau-helper');

//  Tableau API parameters
const viewFields = '_default_,sheetType,workbook.name,workbook.description,workbook.contentUrl,workbook.updatedAt,owner.fullName,owner.email,project.name,project.description';

//  Get an authentication token using our connected app
router.get('/', (req, res) => {

    //  Get the API Token needed to talk to Tableau
    const token = req.query.apiToken;
    const siteId = req.query.siteId;

    //    Get the tableau server/online details
    const tableau = tableauHelper.tableauDetails();

    //    Define the login url
    const url = `${tableauHelper.tableauRestBaseUrl(siteId)}/views?includeUsageStatistics=true&fields=${viewFields}&?filter=projectName:eq:${tableau.project}&pageSize=1000`;

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
        
        //    Return the complete data object
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

router.get('/:id', (req, res) => {

    //  Get the API Token needed to talk to Tableau
    const token = req.query.apiToken;
    const siteId = req.query.siteId;
    const viewId = req.params.id;
    

    //    Get the tableau server/online details
    const tableau = tableauHelper.tableauDetails();

    //    Define the login url
    const url = `${tableauHelper.tableauRestBaseUrl(siteId)}/views/${viewId}?includeUsageStatistics=true&fields=${viewFields}`;

    // Define option
    var options = {
        'method':'GET',
        'headers': tableauHelper.tableauHeaders(token),
        'url': url
    }

    //  Make Login API call to Tableau for all views within a project
    axios(options)
    .then( response => {

        const dashboard = response.data.view ? response.data.view : {}

        //    Return the complete data object
        res.send({
            view: dashboard
        });
    })
    .catch(function (error) {
        console.log(`Error: Tableau threw an error while trying to fetch dashboard with ID ${viewId} via REST API`)
        console.log(error);
        res.send({
            error: true
        })
    })
})

//  Expose the route
module.exports = router;