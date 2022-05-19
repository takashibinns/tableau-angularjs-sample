const express = require('express');
const router = express.Router();
const axios = require('axios');
const tableauHelper = require('./tableau-helper');

//  Route to determine whether a view is a favorite
router.get('/', (req, res) => {

    //  Get the API Token needed to talk to Tableau
    const token = req.query.apiToken,
          siteId = req.query.siteId,
          viewId = req.query.viewId,
          tableauUserId = req.query.tableauUserId;

    //    Get the tableau server/online details
    const tableau = tableauHelper.tableauDetails();

    //    Define the login url
    const url = `${tableauHelper.tableauRestBaseUrl(siteId)}/favorites/${tableauUserId}?page-size=1000`;

    // Define option
    var options = {
        'method':'GET',
        'headers': tableauHelper.tableauHeaders(token),
        'url': url
    }

    //  Make Login API call to Tableau for all views within a project
    axios(options)
    .then( response => {

        //  Assume the view is not a favorite, until proven otherwise
        let viewIsFavorite = false;

        //  Loop through the user's favorites, and see if the current view id matches
        response.data.favorites.favorite.forEach( favorite => {
            favoriteId = tableauHelper.getProp(() => favorite.view.id, null)
            if (favoriteId === viewId){
                viewIsFavorite = true;
            }
        })

        //  Return the result
        res.send({
            isFavorite: viewIsFavorite
        })
    })
    .catch( error => {
        console.log(`Error: Tableau threw an error while trying to get a list of favorites`)
        console.log(error);
        res.send({
            error: true
        })
    })
})

//  Route to mark a given view as a favorite
router.post('/', (req, res) => {

    //  Get the API Token needed to talk to Tableau
    const token = req.body.apiToken,
          siteId = req.body.siteId,
          tableauUserId = req.body.tableauUserId;
          viewId = req.body.viewId,
          viewName = req.body.viewName,
          markFavorite = req.body.markFavorite;

    //    Get the tableau server/online details
    const tableau = tableauHelper.tableauDetails();

    //  Do we need to save as a favorite, or remove a favorite?
    let options;
    if (markFavorite) {
        /*  Mark a view as a favorite */
        options = {
            'method':'PUT',
            'headers': tableauHelper.tableauHeaders(token),
            'url': `${tableauHelper.tableauRestBaseUrl(siteId)}/favorites/${tableauUserId}`,
            'data': {
                'favorite': {
                    'label': viewName,
                    'view': {
                        'id': viewId
                    }
                }
            }
        }
    } else {
        /*  Delete a view's favorite status */
        options = {
            'method':'DELETE',
            'headers': tableauHelper.tableauHeaders(token),
            'url': `${tableauHelper.tableauRestBaseUrl(siteId)}/favorites/${tableauUserId}/views/${viewId}`,
        }
    }

    //  Make Login API call to Tableau
    axios(options)
    .then( response => {
        
        //    Tableau Server responds with an string containing the image in PNG format, handle the base64 decoding client side
        res.send({
            status: 'Success',
            isFavorite: markFavorite,
            details: `View ID ${viewId} ${markFavorite ? 'added to' : 'removed from'} favorites list`
        });
    })
    .catch(function (error) {
        console.log(`Error: Tableau threw an error while trying to save this view as a favorite`)
        console.log(error);
        res.send({
            error: true
        })
    })
})

//  Expose the route
module.exports = router;