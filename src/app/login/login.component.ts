import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;

  submitted:boolean = false;
  isWrongCredentials:boolean = false;

  constructor(private formBuilder:FormBuilder, 
              private auth:AuthService, 
              private router:Router) { 
    this.loginForm = this.formBuilder.group({
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required]
    })
  }

  ngOnInit() {
  }

  onLogin() {
    this.submitted = true;
    if(this.loginForm.invalid) {
      return;
    }else{
      this.auth.login(this.loginForm.value).subscribe(
        (res:any)=>{
        localStorage.setItem('token',res.token);
        this.router.navigate(['/']);
        },
        err=>{  
          if(err instanceof HttpErrorResponse){
            if(err.status === 401){
              console.log(err);
              this.isWrongCredentials = true;
            }
          }
        }
      );
    }
  }

}
