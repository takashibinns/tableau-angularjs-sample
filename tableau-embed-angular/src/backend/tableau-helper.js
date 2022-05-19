const CryptoJS = require('crypto-js');

//  Load environment variables
const dotenv = require('dotenv');
dotenv.config();
const encryptionString = process.env.ENCRYPTION_STRING || 'DefaultEncryptionString'
const tableauBaseUrl =  process.env.TABLEAU_URL || 'https://online.tableau.com'
const tableauApiVersion =  process.env.TABLEAU_API_VERSION || '3.15'
const tableauSite =  process.env.TABLEAU_SITE || ''
const tableauProject = process.env.TABLEAU_PROJECT || 'default'


/*  Define a helper utility for the Tableau API endpoints   */
const helper = {
    //  Encrypt Username
    encryptUsername: function(username) {
        //    Encrypt the username, using our secure key (env variable)
        var b64 = CryptoJS.AES.encrypt(username, encryptionString).toString();
            e64 = CryptoJS.enc.Base64.parse(b64),
            encryptedUserId = e64.toString(CryptoJS.enc.Hex);
        return encryptedUserId
    },
    //  Decrypt Username
    decryptUserId: function(encryptedUserId) {
        //    Decript the username, using our secure key
        var reb64 = CryptoJS.enc.Hex.parse(encryptedUserId);
        var bytes = reb64.toString(CryptoJS.enc.Base64);
        var decrypt = CryptoJS.AES.decrypt(bytes, encryptionString);
        var username = decrypt.toString(CryptoJS.enc.Utf8);
        return username
    },
    //  Get Tableau base url
    tableauDetails: function(){
        return {
            baseUrl: tableauBaseUrl,
            apiVersion: tableauApiVersion,
            site: tableauSite,
            project: tableauProject
        }
    },
    //  Build the Tableau Embed base URL
    tableauEmbedBaseUrl: function(){

        //  Embed API calls have a different base url, depending on what site is being used
        if (tableauSite.length>0){
            //  Using a named site
            return `${tableauBaseUrl}/t/${tableauSite}`;
        } else {
            //  Using the default site
            return `${tableauBaseUrl}`;
        }

    },
    //  Build the Tableau REST API base URL
    tableauRestBaseUrl: function(siteId){
        //  REST API calls have a different base url, depending on what site is being used
        if (siteId && siteId.length>0){
            //  Using a named site
            return `${tableauBaseUrl}/api/${tableauApiVersion}/sites/${siteId}`;
        } else {
            //  Using the default site
            return `${tableauBaseUrl}/api/${tableauApiVersion}`;
        }
    },
    //  Tableau REST API Request Headers
    tableauHeaders: function(token){
        let headers = {
            'Content-Type':'application/json',
            'Accept':'application/json'
        }
        if (token) {
            headers['X-Tableau-Auth'] = token;
        }
        return headers
    },
    //  Safely traverse a javascript object
    getProp: function(fn, defaultVal) {
        try {
          return fn();
        } catch (e) {
          return defaultVal;
        }
      }
}

module.exports = helper;