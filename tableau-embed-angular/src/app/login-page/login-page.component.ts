import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import axios, { AxiosRequestConfig, AxiosResponse} from 'axios';
import SessionHelper from '../common/user-session';

//  Define function to login via API
let login = (username: string, password: string):any => {

  // Define option
  const options: AxiosRequestConfig = {
    'method': 'POST',
    'data': {
      'username': username,
      'password': password
     },
    'url': '/api/login'
  }

  //	Make the API call and return the results
  return axios(options).then(response => { 
    if (response.data.error){
      
      //  Return the error code, to propegate to the user
      return {
        'error': response.data.errorMessage
      };
    } else {
      
      //  Include an expiration date, so we can ask for new credentials if necessary
      let results = response.data;
      let expiryDate = new Date();
      expiryDate.setHours( expiryDate.getHours() + 2)
      results['expiry'] = expiryDate
      
      //  Return the object
      return results;
    }
  })
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  
  @Input() authStorageKey = 'appCredentails';
  @Output() userLoggedIn: EventEmitter<boolean> = new EventEmitter()

  error = ''
  
  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private router: Router){}

  ngOnInit(): void {
    
  }

  async submit() { 
    
    //  Did the user actually put anything in the input boxes?
    if (this.form.valid) {

      //  Get the username/password from the form
      const username = this.form.controls['username'].value,
        password = this.form.controls['password'].value;
      
      //  Make API call to login
      const loginResults = await login(username, password);

      //  Was there an error?
      if (loginResults.error) {

        //  Yes, pass along the message from the API
        this.error = loginResults.errorMessage;
      } else {

        let auth = SessionHelper.build(loginResults.encryptedUserId, loginResults.tableauUserId, loginResults.apiToken, loginResults.siteId, loginResults.tableauBaseUrl);

        SessionHelper.save(auth);

        //  Login successful, store auth data in local storage
        //localStorage.setItem(this.authStorageKey, JSON.stringify(loginResults))

        //  Notify parent that login was successful
        this.userLoggedIn.emit(true)
        
        //  Redirect to the home page
        //this.router.navigate(['/home']);

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
