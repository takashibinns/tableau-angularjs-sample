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

  //  Check local storage for existing auth credentials
  ngOnInit(){
    //  Make sure the user is logged in
    this.loginCheck()
    //  Is there a dashboard id specified within a querystring parameter

  }

  private signUserOut = () => {
    localStorage.removeItem(this.authStorageKey);
    this.userLoggedIn = false;
    this.authCredentials = '';
    this.encryptedUserId = '';
  }

  //  Event handler for after a user logs in via the Login component
  loginCheck() {

    let auth = SessionHelper.load();
    if (auth.expired){
      this.signUserOut();
    } else {
      this.userLoggedIn=true;
    }
    /*
    //  Check localstorage for un-expired credentails
    let authString = localStorage.getItem(this.authStorageKey)
    let auth = JSON.parse(authString ? authString : "{}");
    const expiry = auth.expiry ? new Date(auth.expiry) : new Date("01/01/1990");
    if (expiry> new Date()) {

      //  User is logged in!
      this.userLoggedIn = true;
      this.authCredentials = JSON.stringify(auth);
      this.encryptedUserId = auth.encryptedUserId;
    } else {

      //  User is not logged in (clear local storage just in case)
      this.signUserOut();
      //this.router.navigate(['/login']);
    }
    */
  }

  logout() {
    this.signUserOut();
  }

  viewDashboard(dashboard:TableauDashboard) {
    //  Set the selected dashboard object
    this.selectedDashboard = dashboard;
    //  Update the flag, so that the embedded view is shown
    this.showSpecificDashboard = true;
  }

  closeDashboard(hideDashboard:boolean){
    //  Don't show the embedded dashboard anymore
    this.showSpecificDashboard = !hideDashboard;
  }

  

}
