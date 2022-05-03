import {Auth} from './models/authentication';

const localStorageKey = 'appCredentials';
const expiryHours = 2;
const expiryDefault = '1/1/1900';

export default class SessionHelper {

    //  Constructor for Auth object
    static build = (encyptedUserId:string, tableauUserId:string, apiToken:string, siteId:string, tableauBaseUrl:string) => {
        
        //  Determine a new expiration date for this session
        let expiryDate = new Date();
        expiryDate.setHours( expiryDate.getHours() + expiryHours)
        
        //  Create a new Auth object
        let newAuth:Auth = {
            encryptedUserId: encyptedUserId,
            tableauUserId: tableauUserId,
            apiToken: apiToken,
            siteId: siteId,
            tableauBaseUrl: tableauBaseUrl,
            expired: false,
            expiry: expiryDate
        }

        return newAuth;
    }
    
    //  Method for saving the user's current session details
    static save = (auth:Auth):void =>{
        //  Save to local storage
        localStorage.setItem(localStorageKey, JSON.stringify(auth))
        console.log('saving user session')
    }

    //  Method for saving the user's current session details
    static load = ():Auth => {
        //  Get the session object from local storage, and parse as JSON
        const authString = localStorage.getItem(localStorageKey);
        const auth = JSON.parse(authString ? authString : "{}");

        //  Need to check to see if the session data is expired
        const expiry = auth.expiry ? new Date(auth.expiry) : new Date(expiryDefault);
        if (expiry> new Date()) {
            //  Session data still valid, return Auth
            console.log('loading user session')
            return auth;
        } else {
            //  Session data expired, return blank Auth object
            let blankAuth:Auth = {
                encryptedUserId: '',
                tableauUserId: '',
                apiToken: '',
                siteId: '',
                tableauBaseUrl: '',
                expiry: new Date(expiryDefault),
                expired: true
            }
            return blankAuth;
        }
    }
};