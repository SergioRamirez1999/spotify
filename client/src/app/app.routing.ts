//In this script we'll configurate all routes-component
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserEditComponent } from './components/user-edit.component';

//array with all routes configuration
const appRoutes: Routes = [
    {path:'edit-profile', component: UserEditComponent}
]


//export route configuration and route module(basic angular configuration)
export const appRoutingProviders: any[] = [];

export const routingModule: ModuleWithProviders = RouterModule.forRoot(appRoutes);

