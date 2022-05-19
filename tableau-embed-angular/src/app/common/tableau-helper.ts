import { TableauDashboard } from "./models/tableau-dashboard";

//  Define the path to the loading image for dashboard previews
const dashboardPreviewLoadingImage = '/assets/loading.gif';

/*  Utility class for shared functions throughout the web app */
export default class TableauHelper {

    //  Define how date objects get formatted for rendering
    static dateFormatter = (myDate:Date) => {
        return myDate.toDateString();
    }

    //  Method to create a TableauDashboard from json object
    static createDashboard = (dashboardObject:any):TableauDashboard => {

        //  Initialize variable
        let dashboard = {} as TableauDashboard;

        //  Populate the TableauDashboard model using the JSON
        if (dashboardObject) {
            dashboard = {
                id: dashboardObject.id,
                name:dashboardObject.name,
                preview: dashboardPreviewLoadingImage,
                viewUrlName: dashboardObject.viewUrlName,
                createdAt: new Date(dashboardObject.createdAt),
                updatedAt: new Date(dashboardObject.createdAt),
                isFavorite: dashboardObject.isFavorite ? dashboardObject.isFavorite : false,
                usage: {
                totalViewCount: parseInt(dashboardObject.usage.totalViewCount)
                },
                workbook: {
                    id: dashboardObject.workbook.id,
                    name: dashboardObject.workbook.name,
                    description: dashboardObject.workbook.description,
                    contentUrl: dashboardObject.workbook.contentUrl
                },
                owner: {
                    id: dashboardObject.owner.id,
                    email: dashboardObject.owner.email,
                    fullName: dashboardObject.owner.fullName
                }
            };
        }

        //  Return the TableauDashboard object
        return dashboard;
    }
};