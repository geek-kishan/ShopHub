import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  public uploadUrl = "http://localhost:8100/api/upload";
  public myproductsUrl = "http://localhost:8100/api/myproducts";
  public homeUrl = "http://localhost:8100/api/homeproducts";
  public deleteUrl = "http://localhost:8100/api/deleteproduct";
  public productCount = "http://localhost:8100/api/productcount";
  public companyListUrl = "http://localhost:8100/api/companylist";
  public findByCompanyUrl = "http://localhost:8100/api/findbycompany";
  public findByCatUrl = "http://localhost:8100/api/findbycat";

  constructor(private http:HttpClient) { }

  uploadProduct(data:any){
    return this.http.post<any>(this.uploadUrl,data,{responseType: 'text' as 'json'});
  }

  myproducts(reqPage:number,pageSize:number) {
    const query:String = `?pagesize=${pageSize}&pageno=${reqPage}`;
    const newMyProductUrl = this.myproductsUrl+query;
    return this.http.get<any>(newMyProductUrl);
  }

  homeProducts(){
    return this.http.get<any>(this.homeUrl);
  }

  deleteProduct(product:any){
    return this.http.post<any>(this.deleteUrl,product, {responseType: 'text' as 'json'});
  }

  getProductCount(){
    return this.http.get<any>(this.productCount);
  }

  companyList() {
    return this.http.get<any>(this.companyListUrl);
  }
  
  findByCompany(companyName:any){
    return this.http.post<any>(this.findByCompanyUrl, companyName);
  }

  findByCat(data:any){
    return this.http.post<any>(this.findByCatUrl,data);
  }

}
