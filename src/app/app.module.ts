import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import {SignInComponent} from './admin/sign-in/sign-in.component';
import {SignUpComponent} from './admin/sign-up/sign-up.component';
import {VerifyEmailComponent} from './admin/verify-email/verify-email.component';
import {ForgotPasswordComponent} from './admin/forgot-password/forgot-password.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AuthService} from './services/auth.service';
import { HomeComponent } from './home/home.component';
import {RouterModule} from '@angular/router';
import { HeaderComponent } from './admin/header/header.component';
import {PolicyComponent} from './admin/policy/policy.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { ListComponent } from './pages/list/list.component';
import { AddComponent } from './pages/add/add.component';
import { EditIngredientComponent } from './components/edit-ingredient/edit-ingredient.component';
import { EditCocktailComponent } from './dialog/edit-cocktail/edit-cocktail.component';
import { ConfirmComponent } from './dialog/confirm/confirm.component';
import { ShowCocktailComponent } from './components/show-cocktail/show-cocktail.component';
import { FilterComponent } from './pages/filter/filter.component';

const firebaseConfig = {
          apiKey: "AIzaSyDORDuZ14oLO1uhvBRuM8EqsoqBlpDQeWg",
          authDomain: "cocktytail.firebaseapp.com",
          projectId: "cocktytail",
          storageBucket: "cocktytail.appspot.com",
          messagingSenderId: "616333404314",
          appId: "1:616333404314:web:72dd40e83d4ccda739d723"
};

@NgModule({
  declarations: [
    AppComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    SignInComponent,
    SignUpComponent,
    HomeComponent,
    HeaderComponent,
    PolicyComponent,
    ListComponent,
    AddComponent,
    EditIngredientComponent,
    EditCocktailComponent,
    ConfirmComponent,
    ShowCocktailComponent,
    FilterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    RouterModule,
  ],
  exports: [MaterialModule],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
