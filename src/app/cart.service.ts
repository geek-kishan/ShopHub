import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CartService {

  getLocalStorageProducts() {
    return JSON.parse(localStorage.getItem('cart'));
  }

  addProductsToLocalStorage(products) {
    localStorage.setItem('cart',JSON.stringify(products));
  }

}
