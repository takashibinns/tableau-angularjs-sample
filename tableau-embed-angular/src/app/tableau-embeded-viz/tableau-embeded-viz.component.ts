import { Component, OnInit, Input, HostListener, Inject, Output, EventEmitter } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import axios, {AxiosRequestConfig} from 'axios';
import { Auth } from '../common/models/authentication';
import { TableauDashboard } from '../common/models/tableau-dashboard';
import SessionHelper from '../common/user-session';
import TableauHelper from '../common/tableau-helper';

const bufferSize = 25;

@Component({
  selector: 'app-tableau-embeded-viz',
  templateUrl: './tableau-embeded-viz.component.html',
  styleUrls: ['./tableau-embeded-viz.component.css']
})
export class TableauEmbededVizComponent implements OnInit {

  constructor(public dialog: MatDialog, private router: Router, private activatedRoute:ActivatedRoute){}

  @Output() hideDashboard:EventEmitter<boolean> = new EventEmitter();
  //@Output() selectedDashboard: EventEmitter<TableauDashboard> = new EventEmitter()

  //  Inherit attributes from the parent component
  @Input() vizUrl = ''; 
  @Input() dashboardIndex = 0; 
  @Input() encryptedUserId = '';
  @Input() workbookName = '';
  @Input() workbookDescription = '';
  @Input() workbookOwner = '';
  @Input() workbookLastUpdated = '';
  @Input() isFavorite = false;
  @Input() toolbar = 'hidden';
  //@Input() dashboard = {} as TableauDashboard;

  //  Dashboard properties
  public auth = {} as Auth
  public connectedAppToken = '';
  public VizIndex = 'Tableau-Viz-' + this.dashboardIndex;
  public getScreenWidth: any;
  public getScreenHeight: any;
  public dashboard = {} as TableauDashboard;

  //  Method to return a JWT for Tableau SSO
  private getJwt = (encryptedUserId: string):any => {

    // Define option
    const options: AxiosRequestConfig = {
      'method': 'GET',
      'url': `/api/jwt?encryptedUserId=${encryptedUserId}`
    }
  
    //	Make the API call and return the results
    return axios(options).then(response => { 
      if (response.data.error){
        
        //  Return an empty string, 
        return ''
      } else {
        
        //  Return a JWT for the connected app
        return response.data.connectedAppToken;
      }
    })
  }

  //  Method to get info about a specific dashboard
  private getDashboard = (id: string) => {

    // Do we have an Id?
    if (id.length<=0 && this.auth.apiToken.length>0) {

      //  Return an emtpy dashboard if no ID supplied
      return TableauHelper.createDashboard(null);
    } else {

      //  Fetch the dashboard details via API call
      const options: AxiosRequestConfig = {
        'method': 'GET',
        'url': `/api/dashboards/${id}?apiToken=${this.auth.apiToken}&siteId=${this.auth.siteId}`
      }
    
      //	Make the API call and return the results
      return axios(options).then(response => { 
        if (response.data.error){
          
          //  Return an empty string, 
          return TableauHelper.createDashboard(null);
        } else {
          
          //  Return a JWT for the connected app
          return TableauHelper.createDashboard(response.data.view);
        }
      })
    }
  }

  //  Run when the component is first loaded
  async ngOnInit() {

    //  Retrieve the user's session details from local storage
    this.auth = SessionHelper.load();

    //  Fetch the dashboard's details from the ID in the URL
    this.activatedRoute.params.subscribe(async params => {

      //  Save a reference to the dashboard as a whole
      this.dashboard = await this.getDashboard(params['id']);

      //  Make sure we've got a valid dashboard id
      if (this.dashboard.id) {

        //  Determine the URL for embedding this dashboard
        this.vizUrl = `${this.auth.tableauBaseUrl}/views/${this.dashboard.workbook.contentUrl}/${this.dashboard.viewUrlName}`;

        //  Figure out if this view is in the user's favorites list
        this.getFavorite(this.dashboard.id)
      }
    });

    //  Calculate the available screen size
    this.getScreenWidth = window.innerWidth-bufferSize;
    this.getScreenHeight = (window.innerWidth-bufferSize)*3/4;

    //  Generate a JWT for SSO
    this.connectedAppToken = await this.getJwt(this.auth.encryptedUserId);
  }

  //  Handle changes to the window's size
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth-bufferSize;
    this.getScreenHeight = (window.innerWidth-bufferSize)*3/4;
  }

  //  Get information about the dashboard, using the Embed API
  public dashboardName = '';
  public viewIsFavorite = "favorite_border"
  public thisViz: any;

  //  Method to update the icon, after a status change
  public setFavoriteIcon = (isFavorite:boolean) => {
    this.isFavorite = isFavorite;
    this.viewIsFavorite = isFavorite ? "favorite" : "favorite_border"
  }

  //  Run when this component is first loaded
  ngAfterViewInit() {

    //  Define a function that can be run, on
    let viz = document.getElementById(this.VizIndex);
    if (viz) {
      //  Add event handler to trigger once the viz is finished loading
      viz.addEventListener("firstinteractive", async (event) => {
        //  Need to cast the HtmlElement to an object (for TypeScript)
        this.thisViz = <any>viz;
        //  Update the name and attributes of this dashboard
        this.dashboardName = this.thisViz.workbook.activeSheet.name;
      });
    }
  }

  //  Method to determine if the current viz is a favorite
  public getFavorite = (vizId:string) => {
    let thisComponent = this;

    // Define options
    const options: AxiosRequestConfig = {
      'method': 'GET',
      'url': `/api/dashboardFavorite?siteId=${this.auth.siteId}&viewId=${vizId}&apiToken=${this.auth.apiToken}&tableauUserId=${this.auth.tableauUserId}`
    }
  
    //	Make the API call and return the results
    axios(options).then(response => { 
      if (response.data.error){
        //  Error with the API call, return false by default
        console.log(console.error);
      } else {
        //  This API call returns a list of the user's favorites.  Need to parse the list and see if this view is included
        thisComponent.setFavoriteIcon(response.data.isFavorite)
      }
    })
  }

  //  Method to update the dashboard's favorite status
  public setFavorite = (isFavorite:boolean) =>{

    let thisComponent = this;

    // Define options
    const options: AxiosRequestConfig = {
      'method': 'POST',
      'data': {
        'viewId': this.dashboard.id,
        'viewName': this.dashboard.name,
        'tableauUserId': this.auth.tableauUserId,
        'siteId': this.auth.siteId,
        'apiToken': this.auth.apiToken,
        'markFavorite': !isFavorite
      },
      'url': `/api/dashboardFavorite`
    }
  
    //	Make the API call and return the results
    axios(options).then(response => { 
      if (response.data.error){
        //  Return an empty string, 
        console.log(console.error);
      } else {
        //  Favorite saved, update the icon
        thisComponent.setFavoriteIcon(response.data.isFavorite)
      }
    })
  }

  //  Method to reset the dashboard filters
  public resetFilters = () => {
    console.log(this)
    //  Use the Embeding API to revert all filter changes
    this.thisViz.revertAllAsync()
  }

  //  Open a modal window with more details of the workbook
  public openDialog = () => {
    this.dialog.open(TableauEmbededVizComponentDialog, {
      minWidth: 350,
      data: {
        workbook: {
          name: this.dashboard.workbook.name,
          owner: this.dashboard.owner.fullName,
          description: this.dashboard.workbook.description,
          lastUpdated: TableauHelper.dateFormatter(this.dashboard.updatedAt)
        }
      },
    });
  }

  //  Close out of this page
  public closeDashboard = () => {
    //this.hideDashboard.emit(true)
    this.router.navigateByUrl('home');
  }
}

//  Declare the component for providing more details via a modal window
export interface DialogData {
  workbook: {
    name: 'Workbook Name',
    description: 'Workbook desc',
    owner: 'Workbook Owner',
    lastUpdated: 'today'
  }
}
@Component({
  selector: 'app-tableau-embeded-viz-details',
  templateUrl: 'tableau-embeded-viz-details.component.html',
})
export class TableauEmbededVizComponentDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}