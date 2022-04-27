import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/cdk/overlay/overlay-directives';
import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import axios, {AxiosRequestConfig} from 'axios';
import SessionHelper from '../common/user-session';
import {TableauDashboard} from '../common/models/tableau-dashboard';
//  Define the path to the loading image for dashboard previews
const dashboardPreviewLoadingImage = '/assets/loading.gif';
/*
interface TableauDashboard {
  id:string,
  name:string,
  preview: string,
  contentUrl: string,
  createdAt: Date,
  updatedAt: Date,
  usage: {
    totalViewCount: number
  },
  owner: {
    id:string,
    email: string,
    fullName:string
  },
  workbook: {
    id:string,
    name:string
  }
}
*/
@Component({
  selector: 'app-dashboard-cards',
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['./dashboard-cards.component.css']
})
export class DashboardCardsComponent implements OnInit {

  constructor() { }

  //  Inherit the authentication object
  @Input() authString = '';
  @Output() selectedDashboard: EventEmitter<TableauDashboard> = new EventEmitter()

  //  Default to 3 cards per row, but this is dependant on the screen size
  public cardsPerRow = '33%';
  //  Cards will all have a width of 300px
  public cardWidth = 300;
  //  List of tableau dashboards to display as cards
  public dashboards: TableauDashboard[] = [];
  //public dashboards = []

  //  Method to format datetime
  public formatDatetime = (dateString:Date) => {
    //const timestamp = new Date(dateString);
    return dateString.toDateString();
  }

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
          console.log(`Image fetched for dashboard ${dashboardIndex}`);
        })
        .catch(error => {
          console.log(error.response)
        })
    }
  }

  //  Method to fetch the 
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

              let newDashboard:TableauDashboard = {
                id: dashboard.id,
                name: dashboard.name,
                viewUrlName: dashboard.viewUrlName,
                preview: dashboardPreviewLoadingImage,
                createdAt: new Date(dashboard.createdAt),
                updatedAt: new Date(dashboard.updatedAt),
                usage: {
                  totalViewCount: parseInt(dashboard.usage.totalViewCount)
                },
                workbook: {
                  id: dashboard.workbook.id,
                  name: dashboard.workbook.name,
                  contentUrl: dashboard.workbook.contentUrl
                },
                owner: {
                  id: dashboard.owner.id,
                  email: dashboard.owner.email,
                  fullName: dashboard.owner.fullName
                }
              }

              myDashboards[index] = newDashboard;
  
              //  Set the preview image as the loading spinner by default
              //dashboard.preview = dashboardPreviewLoadingImage;
  
              //  Trigger an async call to get the real preview image via REST API and assign it to the dashboard later
              this.getDashboardPreview(apiToken,siteId,newDashboard.workbook.id, newDashboard.id, index);
  
            })
          
            //  Return a list of dashboard objects
            //return response.data.data;
            return myDashboards;
          }
        })
        .catch( error => {
          console.log(error)
          return [];
        })
    } else {
      return [];
    }
  }

  //  Method to determine how many cards to show on each row
  private calculateCardsPerRow = (thisComponent:any) => {

    //  Calculate the screen width (25px buffer)
    let screenWidth = window.innerWidth-25;

    //  Calculate how many cards to show on 1 line
    thisComponent.cardsPerRow = Math.round( 100 / (Math.floor(screenWidth / thisComponent.cardWidth) ) ) + '%';
    console.log(`Show ${Math.floor(screenWidth / thisComponent.cardWidth)} cards, or ${thisComponent.cardsPerRow}`);
    return null;
  }

  //  Event handler to watch for window resize events
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.calculateCardsPerRow(this);
  }

  //  Run when the component is loaded
  async ngOnInit(): Promise<void> {

    //  Retrieve the user's session details from local storage
    let auth = SessionHelper.load();
    /*
    //  Parse the auth object
    //let auth = JSON.parse(this.authString);
    //  Check localstorage for un-expired credentails
    let authString = localStorage.getItem('appCredentails')
    let auth = JSON.parse(authString ? authString : "{}");
    */

    //  Get the list of Dashboards via API
    this.dashboards = await this.getDashboards(auth.apiToken, auth.siteId);

    //  Calculate how many cards to show per row
    this.calculateCardsPerRow(this);
  }

  //  Click handler (user clicks on a card)
  public viewDashboard = (dashboard:TableauDashboard) => {
    //  Notify parent that login was successful
    this.selectedDashboard.emit(dashboard)
    //console.log(`clicked on the dashboard named ${dashboard.name}`)
  }

}
