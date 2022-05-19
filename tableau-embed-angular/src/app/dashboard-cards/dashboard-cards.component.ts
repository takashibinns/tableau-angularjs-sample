import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios, {AxiosRequestConfig} from 'axios';
import {TableauDashboard} from '../common/models/tableau-dashboard';
import {Auth} from '../common/models/authentication';
import SessionHelper from '../common/user-session';
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

  async ngOnInit(): Promise<void> {

    //  Retrieve the user's session details from local storage
    let auth = SessionHelper.load();

    //  Get the list of Dashboards via API
    this.dashboards = await this.getDashboards(auth);
  }

  //  Method to fetch the list of dashboards from Tableau
  private getDashboards = (auth:Auth) => {

    //  Verify we have an API token & Site ID
    const authValid = SessionHelper.authIsValid(auth);
    if (authValid){
  
      // Define option
      const options: AxiosRequestConfig = {
        'method': 'GET',
        'url': `/api/dashboards?apiToken=${auth.apiToken}&siteId=${auth.siteId}&tableauUserId=${auth.tableauUserId}`
      }
      
      //    Make the API call and return the results
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

              //  Make API call to fetch the dashboard's preview image
              this.getDashboardPreview(auth, newDashboard.workbook.id, newDashboard.id, index);

              //  Save it to the list of dashboards
              myDashboards[index] = newDashboard;
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
  
  //  Method to get the preview image of a dashboard
  private getDashboardPreview = (auth:Auth, workbookId:string, viewId:string, dashboardIndex:number):void => {

    //  Verify we have an API token, Site ID, Workbook ID, and View ID
    const authValid = SessionHelper.authIsValid(auth) && workbookId && workbookId.length>0 && viewId && viewId.length>0;
    if (authValid){
  
      // Define options for API call
      const options: AxiosRequestConfig = {
        'method': 'GET',
        'url': `/api/dashboardPreview?apiToken=${auth.apiToken}&siteId=${auth.siteId}&workbookId=${workbookId}&viewId=${viewId}`
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

  //  Click handler (user clicks on a card)
  public viewDashboard = (dashboard:TableauDashboard) => {
    this.router.navigateByUrl(`dashboard/${dashboard.id}`) 
  }

  //  Format dates, using TableauHelper
  public dateFormatter = (myDate:Date) => {
    return TableauHelper.dateFormatter(myDate);
  }
}
