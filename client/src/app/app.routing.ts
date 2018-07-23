//In this script we'll configurate all routes-component
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import components
import { HomeComponent } from './components/home.component';
import { UserEditComponent } from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

//array with all routes configuration
const appRoutes: Routes = [
    {path:'', component: HomeComponent},
    {path:'edit-profile', component: UserEditComponent},
    {path:'artists/:page', component: ArtistListComponent},
    {path:'artist/:id', component: ArtistDetailComponent},
    {path:'artist-create', component: ArtistAddComponent},
    {path:'artist-edit/:id', component: ArtistEditComponent},
    {path:'**', component: HomeComponent}
    
]


//export route configuration and route module(basic angular configuration)
export const appRoutingProviders: any[] = [];

export const routingModule: ModuleWithProviders = RouterModule.forRoot(appRoutes);

