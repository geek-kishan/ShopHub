import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile:any = {};

  constructor(private auth:AuthService, private router:Router) { }

  userProfile() {
    this.auth.profile().subscribe((res:any)=>{
      this.profile = res;
      //console.log(this.profile);
    },
    (err) =>{
      err instanceof HttpErrorResponse;
      console.log(err.error);
    })
  }
  
  deleteUser(email:string) {
   const user = {
     email : email
   }
    this.auth.deleteUser(user).subscribe(
      (res:any) => {
        //console.log(res);
        //if(res == "")
        localStorage.removeItem('token');
        this.router.navigate(['/']);
      },
      (err:any) => {
        err instanceof HttpErrorResponse;
        console.log(err.error);
      }
    )
  }

  ngOnInit() {
    this.userProfile();
  }

}
