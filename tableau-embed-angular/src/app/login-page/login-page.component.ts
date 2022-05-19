import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import axios, { AxiosRequestConfig} from 'axios';
import SessionHelper from '../common/user-session';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private router: Router){}

  //  Public property for error messages
  public error = ''
  
  //  Define a form group for the login dialog
  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
  }

  //  Private method for logging into Tableau via API
  private login = (username: string, password: string):any => {

    // Define option
    const options: AxiosRequestConfig = {
      'method': 'POST',
      'data': {
        'username': username,
        'password': password
       },
      'url': '/api/login'
    }
  
    //    Make the API call and return the results
    return axios(options).then(response => { 
      return response.data;
    })
  }

  //  Handler for when the user submits the login form
  public async submit() { 
    
    //  Did the user actually put anything in the input boxes?
    if (this.form.valid) {

      //  Get the username/password from the form
      const username = this.form.controls['username'].value,
        password = this.form.controls['password'].value;
      
      //  Make API call to login
      const loginResults = await this.login(username, password);

      //  Was there an error?
      if (loginResults.error) {

        //  Yes, pass along the message from the API
        this.error = loginResults.error.detail;
      } else {

        //  Create an Auth object
        let auth = SessionHelper.build(loginResults.encryptedUserId, loginResults.tableauUserId, loginResults.apiToken, loginResults.siteId, loginResults.tableauBaseUrl);

        //  Save it to local storage, so we don't have to re-login after each refresh
        SessionHelper.save(auth);
        
        //  Redirect to the home page
        this.router.navigateByUrl('/home');
      }

    } else {
      //  Display error message
      if (this.form.controls['username'].value.length<1){
        this.error = 'Please enter a username';
      } else if (this.form.controls['password'].value.length<1){
        this.error = 'Please specify a password';
      }
    }
  }

}
