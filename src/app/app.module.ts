import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './services/auth.service';
import { EventBusService } from './services/event-bus.service';
import { FileUploadService } from './services/fileUpload.service';
import { TokenStorageService } from './services/TokenStorageService.service';
import { SignupComponent } from './signup/signup.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent, HomeComponent,  RegisterComponent, LoginComponent, SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [authInterceptorProviders, FileUploadService, AuthService, TokenStorageService, EventBusService],
  bootstrap: [AppComponent]
})
export class AppModule { }
