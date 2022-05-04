/*  Utility class for shared functions throughout the web app */
export default class TableauHelper {

    //  Define how date objects get formatted for rendering
    static dateFormatter = (myDate:Date) => {
        return myDate.toDateString();
    }
};