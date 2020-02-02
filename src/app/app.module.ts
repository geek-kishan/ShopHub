import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './token-interceptor.service';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { CartComponent } from './cart/cart.component';
import { ProfileComponent } from './profile/profile.component';
import { MyproductsComponent } from './myproducts/myproducts.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AddProductComponent } from './add-product/add-product.component';
import { UploadComponent } from './upload/upload.component';
import { SiteHeadingComponent } from './navigation/site-heading/site-heading.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    CartComponent,
    ProfileComponent,
    MyproductsComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    FooterComponent,
    AddProductComponent,
    UploadComponent,
    SiteHeadingComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [AuthService, AuthGuard,{provide: HTTP_INTERCEPTORS,useClass: TokenInterceptorService,multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
