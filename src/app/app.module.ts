import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogContentDirective } from './dialog/dialog-content.directive';
import { DialogFooterDirective } from './dialog/dialog-footer.directive';
import { DialogHeaderDirective } from './dialog/dialog-header.directive';
import { DialogComponent } from './dialog/dialog.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotificationListComponent } from './notification/notification.component';
import { RegisterComponent } from './register/register.component';
import { NotFoundComponent } from './signup/not-found';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    AppComponent, HomeComponent,  RegisterComponent, LoginComponent, SignupComponent, NotFoundComponent, NotificationListComponent,
    DialogComponent,
    DialogFooterDirective,
    DialogHeaderDirective,
    DialogContentDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule     
  ],
 
  bootstrap: [AppComponent]
})
export class AppModule { }
