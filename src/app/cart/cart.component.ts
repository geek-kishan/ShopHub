import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart = [];
  totalBill:number = 0;
  constructor(private cartService: CartService) {    
  }

  removeProduct(product) {
    let searchBy = product._id;
    let elementToDelete;
    for(var i=0; i<this.cart.length; i++) {
      if(searchBy == this.cart[i]._id) {
        elementToDelete = i;
        console.log(elementToDelete);
        this.cart.splice(elementToDelete,1);
        this.cartService.addProductsToLocalStorage(this.cart);
        this.totalBill = 0;
        for(let j=0; j<this.cart.length; j++) {
          this.totalBill += this.cart[j].totalPrice;
        }
      }
    }
  }

  findCartItems() {
    this.cart = this.cartService.getLocalStorageProducts();
    console.log(this.cart);
    if(this.cart == null) {
      this.totalBill = 0;
    }else {
      this.totalBill = 0;
        for(var n=0; n<this.cart.length; n++){
        this.totalBill += this.cart[n].totalPrice;      
    }
    }
  }

  incQuantity(id:any) {
    console.log(id);
    this.cart.forEach(product => {
      if(product._id == id) {
        product.quantity += 1;
        product.totalPrice = product.quantity * product.price;
        this.cartService.addProductsToLocalStorage(this.cart);
        this.findCartItems();
      }
    });
  }

  decQuantity(id:any) {
    this.cart.forEach(product => {
      if(product._id == id) {
        product.quantity -= 1;
        product.totalPrice = product.quantity * product.price;
        this.cartService.addProductsToLocalStorage(this.cart);
        this.findCartItems();
      }
    });
  }

  ngOnInit() {
    this.findCartItems();
  }
}