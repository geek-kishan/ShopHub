import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  productCategories = ['Electronics','Mobiles','Books',
                       'Accessories','Home appliances',
                       'Cloths'];
  sellersList = [];
  explore = [];
  
  submitted:boolean = false;
  searchingIn:string;
  currentSearchValue:string;
  notShowingRandomProducts = false; 
  currentPage:number;
  pageSize:number = 8;
  totalPages:number = 1;
  message:string;

/************************** Creating Search From **************************/ 
  
  searchForm:FormGroup;
  constructor(private formBuilder:FormBuilder, 
              private data:DataService,
              private cartService:CartService,
              private router:Router) {
                this.searchForm = this.formBuilder.group({
                  query: ['',[Validators.required,Validators.maxLength(12)]],
                })
  }

/******************** Load Random Products At Website Load ****************/

  randomProduct(){
    this.data.homeProducts().subscribe(
      res =>{
        this.explore = res;
        //console.log(this.explore);
        this.notShowingRandomProducts = false;
        this.currentSearchValue = "";
      },
      (err)=>{
        console.log(err);
      }
    )
    this.companyList();
  }

/********************** Find List of Companies at Load *******************/   

  companyList() {
    this.data.companyList().subscribe(
      (res:any)=>{
        //console.log(res);
        this.sellersList = res;
      },
      (err:any)=>{
        console.log(err);
      }
    )
  }

/*********************** Find By Selected Category ***********************/

  findAllByCat(value:any) {
    this.currentSearchValue = value;
    this.searchingIn = "Category";
    this.currentPage = 1;
    this.findByCat();
    this.notShowingRandomProducts = true;
  }

/********************** Find By Category Function ************************/

findByCat() {
  var data = {
   "category": this.currentSearchValue,
   "currentpage": this.currentPage,
   "pagesize": this.pageSize
  }
  this.data.findByCat(data).subscribe(
    (res:any)=>{
      //console.log(res);
      this.explore = res.data;
      this.totalPages = Math.ceil(res.count/8);
    },
    (err:any)=>{
      console.log(err);
    }
  )
}

/********************* Find By Selected Company *************************/

findAllByCompany(value:any) {
  this.currentSearchValue = value;
  this.searchingIn = "Company";
  this.currentPage = 1;
  this.findByCompany();
}

/**************************Find By Company Function *********************/

findByCompany() {
  let data = {
    "company": this.currentSearchValue,
    "currentpage": this.currentPage,
    "pagesize": this.pageSize
  }
  this.data.findByCompany(data).subscribe(
    (res:any)=> {
      //console.log(res);
      this.totalPages = Math.ceil(res.count/8);
      this.explore = res.data;
      this.notShowingRandomProducts = true;
    },
    (err:any)=> {
      console.log(err);
    }
  )
}

/**************************** Pagination Next Button *******************/

next(){
  this.currentPage += 1;
  if(this.searchingIn == "Company"){
    this.findByCompany();
  } else if(this.searchingIn == "Category"){
    this.findByCat();
  }
}
/**************************** Pagination Previous Button ***************/

previous(){
  this.currentPage -= 1;
  if(this.searchingIn == "Company") {
    this.findByCompany();
  }else if(this.searchingIn == "Category"){
    this.findByCat();
  }
}
/************************ Products Search function *********************/

  onSearch() {
    this.submitted = true;
    if(this.searchForm.invalid) {
      return;
    }
  }

/**************************** Add To Cart *****************************/  

cart(product:any) {
  let alreadyAddedProducts = this.cartService.getLocalStorageProducts();
    if(alreadyAddedProducts == null) {
      alreadyAddedProducts = [];
      product.quantity = 1;
      product.totalPrice = product.price * product.quantity;
      alreadyAddedProducts.push(product);
      this.cartService.addProductsToLocalStorage(alreadyAddedProducts);
    }else {
      let isAlreadyExists = alreadyAddedProducts.find(p => p._id === product._id);
      if(isAlreadyExists == null) {
        product.quantity = 1;
        product.totalPrice = product.price * product.quantity;
        alreadyAddedProducts.push(product);
        this.cartService.addProductsToLocalStorage(alreadyAddedProducts);
      }else {
        console.log("Already exists!");
      }
    }
}

/**************************** Add To Cart Button **********************/

addToCart(product:any) {
    this.cart(product);
}

/*************************** Add And Buy ******************************/

addAndBuy(product:any) {
  this.cart(product);
  this.router.navigate(['/cart']);
}

/*************************** On component Load Function ***************/

ngOnInit() {
    this.randomProduct();
}

}
