import { InjectionToken, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotificationService } from './notification/notification.service';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './services/auth.service';
import { EventBusService } from './services/event-bus.service';
import { FileUploadService } from './services/fileUpload.service';
import { TokenStorageService } from './services/TokenStorageService.service';
import { NotFoundComponent } from './signup/not-found';
import { SignupComponent } from './signup/signup.component';
import { authGuard } from './_helpers/auth.guard';
import { authInterceptorProviders } from './_helpers/auth.interceptor';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [ 
   { path: 'home',canActivate: [authGuard], component: HomeComponent },
   { path: 'login', component: LoginComponent },
   { path: 'register', component: RegisterComponent },
   { path: 'signup', component: SignupComponent },
   { path: 'externalRedirect', resolve: { url: externalUrlProvider}, component: NotFoundComponent},
   { path: '', redirectTo: 'home', pathMatch: 'full' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ {    provide:  externalUrlProvider,    useValue: (route: ActivatedRouteSnapshot) => {   
    const externalUrl = route.paramMap.get('externalUrl');
    if(externalUrl)
      window.open(externalUrl, '_self');
},
},
authInterceptorProviders, FileUploadService, AuthService, TokenStorageService, EventBusService, NotificationService]
})
export class AppRoutingModule { }
