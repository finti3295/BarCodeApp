import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthTokenModel } from '../_model/authtokenmodel';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) {   
   }

   getPublic(){
    return this.http.get(environment.serverUrl+`${environment.AUTH_API}Public`);
   }
  RefreshLogin(refreshtoken: string): Observable<any> {
   return this.http.post<AuthTokenModel>(environment.serverUrl+`${environment.AUTH_API}connect/token`, 
  new URLSearchParams( {refresh_token: refreshtoken, grant_type: 'refresh_token', scope: 'openid offline_access' }).toString(),
  httpOptions);
  }

  login(Username: string,  Password: string): Observable<any> { 
    console.log(environment.serverUrl+`${environment.AUTH_API}/connect/token`);
    return this.http.post<AuthTokenModel>(environment.serverUrl+`${environment.AUTH_API}connect/token`, 
    new URLSearchParams( { username: Username, password: Password, grant_type: 'password', scope: 'openid offline_access' }).toString(),
    httpOptions)
}

  register(username: string, email: string, password: string): Observable<any> {
    // console.log(environment.AUTH_API );
    // var ret =this.http.get("https://localhost:7261/BarCode/api/Test")
    // console.log(ret);
    // return ret;
    //console.log(environment.AUTH_API );
    //console.log("username="+ username +"&email="+email +"&password "+password);
    //var body = "username="+ username +"&email="+email +"&password "+password;
    const body = new HttpParams()
    .set('UserName', username)
    .set('Email', email)
    .set('Password', password);
    return this.http.post(environment.serverUrl+environment.ACC_API + 'Register',  body, httpOptions);
  }

  refreshToken(token: string) {
    return this.http.post(environment.serverUrl+environment.AUTH_API + 'refreshtoken', {
      refreshToken: token
    }, httpOptions);
  }

  // logout() {
  //    this.http.post<AuthTokenModel>(environment.serverUrl+`${environment.AUTH_API}connect/logout`, {
  //     refreshToken: 'test'
  //   }, 
  //   httpOptions).subscribe({
  //     next: (data) => {
  //       console.log("logout next");
  //       console.log(data);
  //       this.tokenStorage.signOut();

  //     },
  //     error: (err) => {
  //       console.log("logout error");
  //       console.log(err);
  //     },
  //     complete: () => {    
  //       console.log("logout complete");
  //       this.router.navigate(['/login'])
  //     }
  //   }
  //   );
  //   ;}
}

  

