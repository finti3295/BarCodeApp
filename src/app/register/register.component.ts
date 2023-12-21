import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';




@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {

    const { username, email, password } = this.form;
console.log("Register " );
    this.authService.register(username, email, password).subscribe(
      {
        next: (data) => {    
          console.log("next "+data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;},
        error: (err) => { 
           this.errorMessage = err.error;
           console.log(err);
             this.isSignUpFailed = true;},
        complete: () =>     this.router.navigate(['/home'])
      }      
      // data => {
      //   console.log(data);
      //   this.isSuccessful = true;
      //   this.isSignUpFailed = false;
      // },
      // err => {
      //   this.errorMessage = err.error.message;
      //   this.isSignUpFailed = true;
      // }
    );
  }
}