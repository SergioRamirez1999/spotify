import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
//Import components
import { UserEditComponent } from './components/user-edit.component';
//routing
import{ routingModule, appRoutingProviders } from './app.routing';


@NgModule({
  // In this place we'll load all the components to the main component(AppComponent)
  // We'll have access to components directives from others components
  declarations: [
    AppComponent,
    UserEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routingModule
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
