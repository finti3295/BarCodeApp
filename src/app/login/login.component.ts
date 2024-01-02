import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../notification/notification.service';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/TokenStorageService.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
 
  private _isLoggedIn: boolean = false;
  isLoginFailed = false;
 
  errorMessage = '';
public get  isLoggedIn(){
  return this._isLoggedIn;
}
public set isLoggedIn(value:boolean){
  this._isLoggedIn = value;
  if(value){
    //console.log("isLoggedIn");
    this.router.navigate(['/home'])
  }
}

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router,
    protected _notificationSvc: NotificationService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      //this.router.navigate(['/home'])
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;
    console.log("login onSubmit");
    this.authService.login(username, password).subscribe({
      next: (data) => {
       // console.log("login next");
        //console.log(data);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        //this.reloadPage();
      },
      error: (err) => {
        console.log(err);
        //this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        this.isLoggedIn = false;
      },
      complete: () => {    
        //console.log("login complete");
        //this.isLoggedIn = true;
        //this.router.navigate(['/home'])
      }
    }
    );   
  }

  reloadPage(): void {
    window.location.reload();
  }
}