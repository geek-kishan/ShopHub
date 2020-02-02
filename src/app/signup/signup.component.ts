import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators} from '@angular/forms';
import { ContactValidator } from '../validators/contactNo';
import { MustMatch } from '../validators/PasswordMatch';
import { AuthService } from '.././auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  submitted:boolean = false;
  userAlreadyExists:boolean = false;

  signupForm:FormGroup;

  constructor(private formBuilder:FormBuilder, private auth:AuthService, private router:Router) { 
    this.signupForm = this.formBuilder.group({
    name:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    contact:['',[Validators.required, ContactValidator, Validators.minLength(10),Validators.maxLength(10)]],
    company:['',Validators.required],
    password:['',[Validators.required,Validators.minLength(8),Validators.maxLength(16)]],
    confirmPassword: ['',Validators.required] 
    },{
      validator: MustMatch('password','confirmPassword')
    });
  }

  onSubmit() {
    this.submitted = true;

    if(this.signupForm.invalid){
      return;
    }else{
      this.auth.signup(this.signupForm.value).subscribe(
        (res:any) => {
        console.log(res);
        localStorage.setItem('token',res.token);
        this.router.navigate(['/home']);
        },
        (err)=>{
          err instanceof HttpErrorResponse;
          console.log(err.error);
          const expectedError:string = "User already exist with this Email";
          if(expectedError == err.error){
            this.userAlreadyExists = true;
          }
        }
      );
    }
  }

  ngOnInit() {
  }
}
