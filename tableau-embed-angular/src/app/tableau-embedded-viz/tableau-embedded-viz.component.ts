import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableauDashboard } from '../common/models/tableau-dashboard';

@Component({
  selector: 'app-tableau-embedded-viz',
  templateUrl: './tableau-embedded-viz.component.html',
  styleUrls: ['./tableau-embedded-viz.component.css']
})
export class TableauEmbeddedVizComponent implements OnInit {

  constructor(public dialog: MatDialog){}

  //  Inherit attributes from the parent component
  @Input() dashboardIndex = 0; 
  @Input() toolbar = 'hidden';
  @Input() vizUrl = '';

  //  Dashboard properties
  public VizIndex = 'Tableau-Viz-' + this.dashboardIndex;
  public isFavorite = false;
  public dashboardName = '';
  public viewIsFavorite = "favorite_border"
  public thisViz: any;

  //  Handle dashboard resizing
  public getScreenWidth: any;
  public getScreenHeight: any;
  private calculateDashboardSize = () => {
    const bufferSize = 25;
    this.getScreenWidth = window.innerWidth-bufferSize;
    this.getScreenHeight = (window.innerWidth-bufferSize)*3/4;
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.calculateDashboardSize();
  }

  ngOnInit(): void {
    this.calculateDashboardSize();
  }
  //  Run after the component has been rendered
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

  //  Method to update the icon, after a status change
  private setFavoriteIcon = (isFavorite:boolean) => {
    this.isFavorite = isFavorite;
    this.viewIsFavorite = isFavorite ? "favorite" : "favorite_border"
  }

  //  Method to determine if the current viz is a favorite
  private getFavorite = (vizId:string) => {
    //  Business logic goes here
  }

  //  Method to update the dashboard's favorite status
  public setFavorite = (isFavorite:boolean) =>{
    //  Business logic goes here
  }

  //  Method to reset the dashboard filters
  public resetFilters = () => {
    //  Use the Embeding API to revert all filter changes
    this.thisViz.revertAllAsync()
  }
  
  //  Method to download the dashboard as a PDF
  public downloadPdf = () => {
    // Business logic goes here
  }
  
  //  Open a modal window with more details of the workbook
  openDialog() {
    //  Create a placeholder dashboard object
    const dash = {
      updatedAt: new Date(),
      workbook : {
        id: '',
        contentUrl: '',
        name: 'Some Workbook',
        description: 'some description'
      },
      owner: {
        id: '',
        email: '',
        fullName: 'Me'
      }
    } as TableauDashboard;
    //  Open the popup
    this.dialog.open(TableauEmbeddedVizComponentDialog, {
      minWidth: 350,
      data: dash
    });
  }

  //  Close out of this page
  public closeDashboard = () => {
    //  Business Logic goes here
  }

}

//  Declare the component for providing more details via a modal window
@Component({
  selector: 'app-tableau-embedded-viz-details',
  templateUrl: 'tableau-embedded-viz-details.component.html',
})
export class TableauEmbeddedVizComponentDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: TableauDashboard) {}
}