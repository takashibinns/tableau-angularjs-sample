import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TableauDashboard } from './common/models/tableau-dashboard';
import SessionHelper from './common/user-session';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(private router: Router){}

  
  
  //  Define public properties
  title = 'tableau-embed-angular';
  public userLoggedIn = false;
  public authStorageKey = 'appCredentails';
  public authCredentials = '';
  public encryptedUserId = '';
  public currentDashboardId = '';
  public showSpecificDashboard = false;
  public selectedDashboard = {} as TableauDashboard;

  //  Event handler for after a user logs in via the Login component
  private loginCheck() {

    let auth = SessionHelper.load();
    if (auth.expired){
      this.userLoggedIn=false;
    } else {
      this.userLoggedIn=true;
    }
  }

  //  Check local storage for existing auth credentials
  ngOnInit(){
    //  Make sure the user is logged in
    this.loginCheck()
  }

  public onRouteChange = (event:any) =>{
    this.loginCheck()
  }

  public logout() {

    //  Clear session info from local storage
    SessionHelper.end();

    //  Hide the login button
    this.userLoggedIn = false;

    //  Redirect user to login page
    this.router.navigateByUrl('/login');
  }

  /*
  public viewDashboard(dashboard:TableauDashboard) {
    //  Set the selected dashboard object
    this.selectedDashboard = dashboard;
    //  Update the flag, so that the embedded view is shown
    this.showSpecificDashboard = true;
  }
  */

  /*
  public closeDashboard(hideDashboard:boolean){
    //  Don't show the embedded dashboard anymore
    this.showSpecificDashboard = !hideDashboard;
  }
  */

  

}
