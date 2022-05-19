const express = require('express');
const router = express.Router();
const axios = require('axios');
const tableauHelper = require('./tableau-helper');

//  Tableau API parameters
const viewFields = '_default_,sheetType,workbook.name,workbook.description,workbook.contentUrl,workbook.updatedAt,owner.fullName,owner.email,project.name,project.description';

//  Method to get the list of favorites from Tableau
const getFavorites = (token, siteId, tableauUserId) => {

    //    Define the login url
    const url = `${tableauHelper.tableauRestBaseUrl(siteId)}/favorites/${tableauUserId}?page-size=1000`;

    // Define option
    var options = {
        'method':'GET',
        'headers': tableauHelper.tableauHeaders(token),
        'url': url
    }

    //  Make Login API call to Tableau for all favorites for this user
    return axios(options)
    .then( response => {

        //  Create a dictionary of the favorites
        let favorites = {}
        response.data.favorites.favorite.forEach( favorite => {
            favorites[favorite.view.id] = favorite;
        })

        //  Return the dictionary
        return favorites;
    })
}

//  Get an authentication token using our connected app
router.get('/', async (req, res) => {

    //  Get the API Token needed to talk to Tableau
    const token = req.query.apiToken;
    const siteId = req.query.siteId;
    const tableauUserId = req.query.tableauUserId;

    //    Get the tableau server/online details
    const tableau = tableauHelper.tableauDetails();

    //  Get a list of all the favorites
    const favorites = await getFavorites(token, siteId, tableauUserId);

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

        //  Check to see if each dashboard is marked as a favorite
        dashboards.forEach( dashboard => {
            dashboard.isFavorite = favorites[dashboard.id] ? true : false;
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