import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-myproducts',
  templateUrl: './myproducts.component.html',
  styleUrls: ['./myproducts.component.css']
})
export class MyproductsComponent implements OnInit {

  constructor(private data:DataService) { }
  responseData:any[];

  public totaldoc:number;
  public currentPage:number = 1;
  public totalPage:number;
  public pageSize:number = 9;

  getTotalDocumentCount() {
    this.data.getProductCount().subscribe(
      (res:any)=>{
        this.totaldoc = res.count;
        let totalPageP = Math.ceil(this.totaldoc/9);
        console.log(totalPageP);
        if(totalPageP == 0) {
          this.totalPage = 1;
          return;  
        }else {
          this.totalPage = totalPageP;
        }
      }
    )
    this.loadProducts();
  }

  loadProducts() {
    this.data.myproducts(this.currentPage,this.pageSize).subscribe(
      (res:any)=>{
        this.responseData = res;
      },
      (err:any)=>{
        console.log(err);
      }
    )
  }

  next() {
    this.currentPage += 1;
    this.loadProducts();
  }

  previous() {
    this.currentPage -= 1;
    this.loadProducts();
  }

  deleteProduct(value:any){
    const datatoSend = {
      productName : value
    }
    this.data.deleteProduct(datatoSend).subscribe(
      res => {
        console.log(res);
        this.loadProducts();
      },
      err => {
        console.log(err);
      }
    ) 
  }
  
  ngOnInit() {
    this.getTotalDocumentCount();
  }
}
