import { Component, OnInit, Input, HostListener } from '@angular/core';



const bufferSize = 25;
@Component({
  selector: 'app-tableau-embeded-viz',
  templateUrl: './tableau-embeded-viz.component.html',
  styleUrls: ['./tableau-embeded-viz.component.css']
})
export class TableauEmbededVizComponent implements OnInit {

  constructor() { }

  //  Inherit attributes from the parent component
  @Input() vizUrl = ''; 
  @Input() divId = ''; 
  @Input() workbookOwner = '';
  @Input() workbookDescription = '';
  
  //  Make sure the dashboard is as wide as the user's screen, and uses a 4:3 aspect ratio
  public getScreenWidth: any;
  public getScreenHeight: any;
  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth-bufferSize;
    this.getScreenHeight = (window.innerWidth-bufferSize)*3/4;
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth-bufferSize;
    this.getScreenHeight = (window.innerWidth-bufferSize)*3/4;
  }

  //  Get information about the dashboard
  public dashboardName = '';
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
}
