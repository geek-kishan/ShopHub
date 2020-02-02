import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {


  uploadForm:FormGroup;
  categories = ['Electronics','Mobiles','Books','Accessories','Home appliances','Cloths'];
  submitted:boolean = false;
  isImageSelected = false;

  createUploadForm(){
  this.uploadForm = this.formBuilder.group({
    productName: ['',Validators.required],
    category: ['',Validators.required],
    price: ['',Validators.required],
    image: ['',Validators.required]
  })}

  constructor(private formBuilder:FormBuilder, 
              private data:DataService,  
              private router:Router) {}

   imagePicked(event:any){
     if(event.target.files.length>0){
       const file = event.target.files[0];
       this.uploadForm.patchValue({image:file});
       this.uploadForm.get('image').updateValueAndValidity();
       if(this.uploadForm.value.image !== null) {
         this.isImageSelected = true;
       }
     }
   }

   onSubmit(){
    this.submitted = true;
     if(this.uploadForm.invalid){
       return;
     }else{
     const uploadData = new FormData();
     uploadData.append('name',this.uploadForm.value.productName);
     uploadData.append('category',this.uploadForm.value.category);
     uploadData.append('price',this.uploadForm.value.price);
     uploadData.append('image',this.uploadForm.value.image,this.uploadForm.value.productName);
     this.data.uploadProduct(uploadData).subscribe(
       (res:any)=>{
         console.log(res)
         this.router.navigate(['/myproducts']);
        },
       (err)=>{
         console.log(err)
        }
     ) 
    }
   }

  ngOnInit() {
    this.createUploadForm();
  }

}
