import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios, {AxiosRequestConfig} from 'axios';
import SessionHelper from '../common/user-session';
import {TableauDashboard} from '../common/models/tableau-dashboard';
import TableauHelper from '../common/tableau-helper';

@Component({
  selector: 'app-dashboard-cards',
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['./dashboard-cards.component.css']
})
export class DashboardCardsComponent implements OnInit {

  constructor(private router: Router) {}

  //  List of tableau dashboards to display as cards
  public dashboards: TableauDashboard[] = [];

  //  Method to format datetime
  public formatDatetime = (dateString:Date) => {
    return TableauHelper.dateFormatter(dateString);
  }

  //  Method to get the preview image of a dashboard
  private getDashboardPreview = (apiToken:string, siteId:string, workbookId:string, viewId:string, dashboardIndex:number):void => {

    //  Verify we have an API token, Site ID, Workbook ID, and View ID
    const authValid = apiToken && apiToken.length>0 && siteId && siteId.length>0 && workbookId && workbookId.length>0 && viewId && viewId.length>0;
    if (authValid){
  
      // Define options for API call
      const options: AxiosRequestConfig = {
        'method': 'GET',
        'url': `/api/dashboardPreview?apiToken=${apiToken}&siteId=${siteId}&workbookId=${workbookId}&viewId=${viewId}`
      }
  
      //  Make the API call
      axios(options)
        .then(response => { 
          //  Update the dashboard object
          this.dashboards[dashboardIndex].preview = response.data.data;
        })
        .catch(error => {
          console.log(error.response)
        })
    }
  }

  //  Method to fetch the list of dashboards from Tableau
  private getDashboards = (apiToken:string, siteId:string) => {

    //  Verify we have an API token & Site ID
    const authValid = apiToken && apiToken.length>0 && siteId && siteId.length>0;
    if (authValid){
  
      // Define option
      const options: AxiosRequestConfig = {
        'method': 'GET',
        'url': `/api/dashboards?apiToken=${apiToken}&siteId=${siteId}`
      }
  
      //	Make the API call and return the results
      return axios(options)
        .then(response => { 
          if (response.data.error){           
            //  Return an empty array 
            return [];
          } else {
            
            let myDashboards = <any>[];

            //  Loop through each dashboard in the response
            response.data.data.forEach( (dashboard:any, index:number) => {

              //  Use the API call's response data to create a TableauDashboard object
              let newDashboard = TableauHelper.createDashboard(dashboard);

              //  Save it to the list of dashboards
              myDashboards[index] = newDashboard;
  
              //  Trigger an async call to get the real preview image via REST API and assign it to the dashboard later
              this.getDashboardPreview(apiToken,siteId,newDashboard.workbook.id, newDashboard.id, index);
            })
          
            //  Return a list of dashboard objects
            return myDashboards;
          }
        })
        .catch( error => {
          console.log(error)
          return [];
        })
    } else {
      console.log('No valid user session, so no dashboards to display')
      return [];
    }
  }

  //  Run when the component is loaded
  async ngOnInit(): Promise<void> {

    //  Retrieve the user's session details from local storage
    let auth = SessionHelper.load();

    //  Get the list of Dashboards via API
    this.dashboards = await this.getDashboards(auth.apiToken, auth.siteId);
  }

  //  Click handler (user clicks on a card)
  public viewDashboard = (dashboard:TableauDashboard) => {
    this.router.navigateByUrl(`dashboard/${dashboard.id}`) 
  }
}