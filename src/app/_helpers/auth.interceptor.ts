import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';



import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { TokenStorageService } from '../services/TokenStorageService.service';
import { AuthService } from '../services/auth.service';


// const TOKEN_HEADER_KEY = 'Authorization';  // for Spring Boot back-end
const TOKEN_HEADER_KEY = 'x-access-token';    // for Node.js Express back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private tokenService: TokenStorageService, private authService: AuthService) { }

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
  //   console.log("intercept");
  //   let authReq = req;
  //  // this.handle401Error(authReq, next);
  //   const token = this.tokenService.getToken();
  //   if (token != null) {
  //     authReq = this.addTokenHeader(req, token);
  //   }

  //   return next.handle(authReq).pipe(
  //     catchError((error) => {
  //       console.log("intercept error");
  //      return this.handle401Error(authReq, next);
  //       console.log(error);
  //      // return throwError(() => error);
  //     })
  //   );
  // }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let authReq = req;
    const token = this.tokenService.getToken();
    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse  && error.status === 401) {
        return this.handle401Error(authReq, next);
      }

      return throwError(() => error);
    }));
  }


//   private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
//     console.log("handle401Error "+ this.isRefreshing);
//     if (true) {
//       this.isRefreshing = true;
//       this.refreshTokenSubject.next(null);

//       const token = this.tokenService.getRefreshToken();
// console.log(" const token = this.tokenService.getRefreshToken() "+token)
//       if (token){
//         var ret = this.authService.RefreshLogin(token).subscribe({
//           next: (data) => {
//             console.log(" switchMap((token: any) "+ token)
//             this.isRefreshing = false;
//             console.log(data);
//             this.tokenService.saveToken(data.accessToken);
//             this.refreshTokenSubject.next(data.accessToken);
//             return next.handle(this.addTokenHeader(request, data.accessToken));
//            },
//            error: (err) => {
//             this.isRefreshing = false;
//             console.log("handle401Error error"+ err);
//             console.log( err);
//            // this.tokenService.signOut();
//            },
//            complete: () => { 
               
//              //console.log("login complete");
//              //this.isLoggedIn = true;
//              //this.router.navigate(['/home'])
//            }
//         })
        
//         // .pipe(
//         //   switchMap((token: any) => {
//         //    console.log(" switchMap((token: any) "+ token)
//         //     this.isRefreshing = false;

//         //     this.tokenService.saveToken(token.accessToken);
//         //     this.refreshTokenSubject.next(token.accessToken);
            
//         //     return next.handle(this.addTokenHeader(request, token.accessToken));
//         //   }),
//         //   catchError((error) => {
//         //     this.isRefreshing = false;
//         //     console.log("handle401Error error");
//         //     this.tokenService.signOut();
//         //     return throwError(() => error);
//         //   })
//         // );
//         // console.log("ret")
//         // return ret;
//       }
//     }

//     return this.refreshTokenSubject.pipe(
//       filter(token => token !== null),
//       take(1),
//       switchMap((token) => next.handle(this.addTokenHeader(request, token)))
//     );
//   }


private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
  if (!this.isRefreshing) {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    const token = this.tokenService.getRefreshToken();

    if (token)
      return this.authService.RefreshLogin(token).pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          console.log("handle401Error")
          console.log(token);
          this.tokenService.saveToken(token.access_token);
          this.refreshTokenSubject.next(token.access_token);
          
          return next.handle(this.addTokenHeader(request, token.access_token));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          
          this.tokenService.signOut();
          return throwError(() => err);
        })
      );
  }

  return this.refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap((token) => next.handle(this.addTokenHeader(request, token)))
  );}
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    console.log("addTokenHeader");
    return request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    /* for Spring Boot back-end */
    // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

    /* for Node.js Express back-end */
    //var ret = request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token) });
    // console.log("request after");
    // console.log(request);
    // return ret;
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];