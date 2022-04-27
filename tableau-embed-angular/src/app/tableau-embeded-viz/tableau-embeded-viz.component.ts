import { Component, OnInit, Input, HostListener, Inject, Output, EventEmitter } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import axios, {AxiosRequestConfig} from 'axios';
import { TableauDashboard } from '../common/models/tableau-dashboard';
import SessionHelper from '../common/user-session';

const bufferSize = 25;

//  Define function to login via API
let getJwt = (encryptedUserId: string):any => {

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
@Component({
  selector: 'app-tableau-embeded-viz',
  templateUrl: './tableau-embeded-viz.component.html',
  styleUrls: ['./tableau-embeded-viz.component.css']
})
export class TableauEmbededVizComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  @Output() hideDashboard:EventEmitter<boolean> = new EventEmitter();
  //@Output() selectedDashboard: EventEmitter<TableauDashboard> = new EventEmitter()

  //  Inherit attributes from the parent component
  @Input() vizUrl = ''; 
  @Input() divId = ''; 
  @Input() encryptedUserId = '';
  @Input() workbookName = '';
  @Input() workbookDescription = '';
  @Input() workbookOwner = '';
  @Input() workbookLastUpdated = '';
  @Input() isFavorite = false;
  @Input() toolbar = 'hidden';
  @Input() dashboard = {} as TableauDashboard;

  //  Use Connected Apps for SSO to Tableau Server/Online
  public connectedAppToken = '';
  
  
  //  Make sure the dashboard is as wide as the user's screen, and uses a 4:3 aspect ratio
  public getScreenWidth: any;
  public getScreenHeight: any;
  async ngOnInit() {
    this.getScreenWidth = window.innerWidth-bufferSize;
    this.getScreenHeight = (window.innerWidth-bufferSize)*3/4;

    //  Retrieve the user's session details from local storage
    let auth = SessionHelper.load();

    //  Generate a JWT for SSO
    this.connectedAppToken = await getJwt(auth.encryptedUserId);

    //  Determine the Viz URL for embedding
    this.vizUrl = `${auth.tableauBaseUrl}/views/${this.dashboard.workbook.contentUrl}/${this.dashboard.viewUrlName}`;

    console.log(this.dashboard);
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth-bufferSize;
    this.getScreenHeight = (window.innerWidth-bufferSize)*3/4;
  }

  //  Get information about the dashboard
  public dashboardName = '';
  public viewIsFavorite = this.isFavorite ? "favorite_border" : "favorite_border"
  public thisViz: any;
  ngAfterViewInit() {
    //  Store a reference to this
    let thisComponent = this;
    //  Define a function that can be run, on
    let viz = document.getElementById(this.divId);
    if (viz) {
      //  Add event handler to trigger once the viz is finished loading
      viz.addEventListener("firstinteractive", async (event) => {
        //  Need to cast the HtmlElement to an object (for TypeScript)
        thisComponent.thisViz = <any>viz;
        //  Update the name and attributes of this dashboard
        thisComponent.dashboardName = thisComponent.thisViz.workbook.activeSheet.name;
      });
    }
  }

  //  Open a modal window with more details of the workbook
  openDialog() {
    this.dialog.open(TableauEmbededVizComponentDialog, {
      minWidth: 350,
      data: {
        workbook: {
          name: this.workbookName,
          description: this.workbookDescription,
          owner: this.workbookOwner,
          lastUpdated: this.workbookLastUpdated
        }
      },
    });
  }

  closeDashboard(){
    this.hideDashboard.emit(true)
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