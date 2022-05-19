import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import SessionHelper from './common/user-session';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router){}

  //  Define public properties
  public userLoggedIn = false;

  //  Check to see if the user has a valid session, if so we need to display the logout button in the toolbar
  private canShowLogoutButton() {
    let auth = SessionHelper.load();
    if (auth.expired){
      this.userLoggedIn=false;
    } else {
      this.userLoggedIn=true;
    }
  }

  //  Runs when the component is first loaded
  ngOnInit(){
    this.canShowLogoutButton()

    //  Always scroll to the top of the page, when changing the route
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
  });
  }

  //  Runs when the URL changes
  public onRouteChange = (event:any) =>{
    this.canShowLogoutButton()
  }

  //  Method to log out the current user and invalidate their session
  public logout() {

    //  Clear session info from local storage
    SessionHelper.end();

    //  Hide the login button
    this.userLoggedIn = false;

    //  Redirect user to login page
    this.router.navigateByUrl('/login');
  }
}
