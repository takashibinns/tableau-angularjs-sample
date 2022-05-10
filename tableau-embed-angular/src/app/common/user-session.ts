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

    //  Method for ending the user's current session
    static end = ():void => {
        localStorage.removeItem(localStorageKey)
    }

    //  Method to verify if Auth is valid
    static authIsValid = (auth:Auth):boolean => {

        //  Is there a valid user id?
        if (auth && auth.tableauUserId && auth.tableauUserId.length>0) {
            //  Yes, but has the session token expired?
            const expiry = new Date(auth.expiry),
                now = new Date();
            if (expiry >= now){
                //  Yes, session is valid
                return true;
            } else {
                //  No, return false
                return false;
            }
        } else {
            //  No, return false
            return false;
        }
    }
};