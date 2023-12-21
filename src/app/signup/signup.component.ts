import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MustMatch } from '../_helpers/must-match.validator';




@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signUpForm: any ;
  errorMessage!: string ; 
  hideBilling: boolean = true;



  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.initForm();     
 

  }

  initForm(){
    this.signUpForm = this.formBuilder.group(
{
  username: ['', [Validators.required]],
  email: ['', [Validators.required]],
  password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
  confirmPassword: ['', [Validators.required]],

}, {
  validator: MustMatch('password', 'confirmPassword')
        }
    );

  }
  get f(){
    return this.signUpForm.controls;
  }

  onSubmit(){
    const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;
    const username = this.signUpForm.get('username').value;


    this.authService.register( username, email,  password).subscribe({
       // next: (v) => ,
        error: (e) => {   this.errorMessage = e},
        complete: () =>     this.router.navigate(['/home'])
      }      
      ) 
   
  }

}