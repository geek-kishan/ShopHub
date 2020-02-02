import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public signupUrl = "http://localhost:8100/api/signup";
  public loginUrl = "http://localhost:8100/api/login";
  public profileUrl = "http://localhost:8100/api/profile";
  public deleteUserUrl = "http://localhost:8100/api/deleteUser";

  constructor(private http:HttpClient, private router:Router) { }

  public signup(user:any) {
    return this.http.post(this.signupUrl,user);
  }

  public login(user:any) {
    return this.http.post(this.loginUrl,user);
  }

  public deleteUser(user:any) {
    return this.http.post(this.deleteUserUrl,user, {responseType: 'text' as 'json'});
  }

  public isLoggedin() {
    return !!localStorage.getItem("token");
  }

  public getToken() {
    return localStorage.getItem("token");
  }

  public logout() {
    localStorage.removeItem("token");
    this.router.navigate(["/"]);
  }

  public profile() {
    return this.http.get(this.profileUrl);
  }
}
