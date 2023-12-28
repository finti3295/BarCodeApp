import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { EventBusService } from './services/event-bus.service';
import { TokenStorageService } from './services/TokenStorageService.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  username?: string;

  eventBusSub?: Subscription;
  constructor(private tokenStorageService: TokenStorageService, private eventBusService: EventBusService, private authService: AuthService,private router: Router) { }

  ngOnInit(): void {
    // this.authService.getPublic().subscribe({
    //   //next: (v) => ,
    //   error: (e) => console.error(e),
    //   complete: () => {
    //     console.info('AuthService init complete'), 
    //     this.router.navigate(['/login']);}
    // } ) 
    
    var backendInitialized = window.sessionStorage.getItem("backend");
    var url = environment.serverUrl+`Public`;
    //console.log(url);
    //console.log(backendInitialized);
    if(!backendInitialized){
      backendInitialized =  "true";
      window.sessionStorage.setItem("backend", backendInitialized);
      console.log(backendInitialized);
        this.router.navigate(['/externalRedirect', { externalUrl: url }]);
     
      }
        else {
        //console.log("nav");
        //console.log(backendInitialized);
      //console.log(nav); // true if navigation is successful
      this.isLoggedIn = !!this.tokenStorageService.getToken();

      if (this.isLoggedIn) {
        const user = this.tokenStorageService.getUser();
        this.roles = user.roles;
  
       // this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
  
        this.username = user.username;
      }
  
      this.eventBusSub = this.eventBusService.on('logout', () => {
        this.logout();
      });}
    // }, err => {
    //   console.log("err");
    //   console.log(err) // when there's an error
    // }
    ;
    // this.router.navigate('/externalRedirect', { externalUrl: (environment.serverUrl+`${environment.AUTH_API}Public` )}])
    // .then(nav => {
    //   console.log("nav");
    //   console.log(nav); // true if navigation is successful
    //   this.isLoggedIn = !!this.tokenStorageService.getToken();

    //   if (this.isLoggedIn) {
    //     const user = this.tokenStorageService.getUser();
    //     this.roles = user.roles;
  
    //    // this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
  
    //     this.username = user.username;
    //   }
  
    //   this.eventBusSub = this.eventBusService.on('logout', () => {
    //     this.logout();
    //   });
    // }, err => {
    //   console.log("err");
    //   console.log(err) // when there's an error
    // });
    

  }

  ngOnDestroy(): void {
    if (this.eventBusSub)
      this.eventBusSub.unsubscribe();
  }

  logout(): void {
    this.tokenStorageService.signOut();

    this.isLoggedIn = false;
    this.roles = [];
  }
}
