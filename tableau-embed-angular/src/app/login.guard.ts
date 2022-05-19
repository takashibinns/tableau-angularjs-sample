import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import SessionHelper from './common/user-session';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      //  Try loading the user's session info
    const auth = SessionHelper.load();

    //  Does the user have a valid session?
    const isLoggedIn = SessionHelper.authIsValid(auth);
    if (isLoggedIn){

        //  User is logged in, so it's ok to display the content
        return true;
    } else {

        //  User is not logged in, redirect to the login page
        return this.router.parseUrl('/login');
   }
  }
  
}
