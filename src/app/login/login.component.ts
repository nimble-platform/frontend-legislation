import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Globals } from '../globals';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../login.service';
import { UserInterface } from '../interfaces/user.interface';
import { AppComponent } from '../app.component';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
//import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  alerts: any[] = [];
	alert_msg: string = "";

  email = new FormControl("", Validators.email);
  password = new FormControl("", Validators.minLength(6));

  errorMsg: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private loginService: LoginService,
    private translate: TranslateService,
    private appComponent: AppComponent
  ) { 
    this.form = fb.group({
      "email": this.email,
      "password": this.password
    });
    translate.setDefaultLang(Globals.defaultLanguage);
    this.loginService.saveSelectedLanguage(Globals.defaultLanguage);
    this.translate.use(this.loginService.getSelectedLanguage());
  }

  ngOnInit() {
  }

  onSubmit() {
    this.errorMsg = null;
    
    var credentials = {
      "password": this.password.value,
      "username": this.email.value
    };

    let nimbleIdentityServiceUrl = Globals.nimbleIdentityServiceUrl;

    let headers = new HttpHeaders();
    headers = headers.set('content-type', 'application/json');
    headers = headers.set('accept', 'application/json');
    this.alerts = [];
    //var alert_type: string = ""
    
    this.appComponent.loading = true;
    this.http.post(nimbleIdentityServiceUrl,
      credentials,
      {headers: headers}
      )
      .subscribe(
        data => {
          // token correct > validate user roles
          // content moved to success in this.validateToken()
          //alert(JSON.stringify(data));
          this.validateToken(data);

          /*
          this.saveUserInfo(data);
          this.alert_msg = "Login Successful";
          this.alerts.push({
            type: 'success',
            message: this.alert_msg,
          });
          this.translate.get(this.alert_msg).subscribe((res: string) => {
            this.alert_msg = res;
          });
          this.appComponent.loading = false;
          this.router.navigate(['/search/']);
          */
        },
        error  => {
          console.log("Error", error);
          this.alert_msg = "Invalid email or password";
          this.alerts.push({
            type: 'danger',
            message: this.alert_msg,
          });
          this.translate.get(this.alert_msg).subscribe((res: string) => {
            this.alert_msg = res;
          });
          this.appComponent.loading = false;
      }
    );
  }

  saveUserInfo(data: any) {
    let user: UserInterface = {
      "username": data.username,
      "accessToken": data.accessToken
    };
    this.loginService.saveUser(user);
  }

  validateToken(data: any) {
    var url = Globals.urlServiceRoot + "/rest/user/get/" + 0;

    const params = new HttpParams()
        .set('aToken', 'Bearer ' + data.accessToken)
        .set('authMode', Globals.authMode);
  
    this.appComponent.loading = true;
    this.http.get(url, {params}).subscribe(
      (res : any[])=>{

        this.saveUserInfo(data);
        this.alert_msg = "Login Successful";
        this.alerts.push({
          type: 'success',
          message: this.alert_msg,
        });
        this.translate.get(this.alert_msg).subscribe((res: string) => {
          this.alert_msg = res;
        });
        this.appComponent.loading = false;
        this.router.navigate(['/search/']);
      },
      err => {
        console.log("err: " + JSON.stringify(err.error));
        this.alert_msg = err.error.description;
          
        this.alerts.push({
          type: 'danger',
          message: this.alert_msg,
        });
        this.appComponent.loading = false;
      }
    );
  }

  closeAlert(alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }
}
