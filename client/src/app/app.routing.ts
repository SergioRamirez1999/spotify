//In this script we'll configurate all routes-component
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Home imports
import { HomeComponent } from './components/home.component';

//User imports
import { UserEditComponent } from './components/user-edit.component';

//Artistsimports
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

//Album imports
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';



//array with all routes configuration
const appRoutes: Routes = [
    
    {path:'', component: HomeComponent},
    {path:'edit-profile', component: UserEditComponent},

    {path:'artists/:page', component: ArtistListComponent},
    {path:'artist/:id', component: ArtistDetailComponent},
    {path:'artist-add', component: ArtistAddComponent},
    {path:'artist-edit/:id', component: ArtistEditComponent},

    {path:'album/:id', component: AlbumDetailComponent},
    {path:'album-add/:id', component: AlbumAddComponent},
    {path:'album-edit/:id', component: AlbumEditComponent},

    {path:'song-add/:id', component: SongAddComponent},
    {path:'song-edit/:id', component: SongEditComponent},

    {path:'**', component: HomeComponent}
    
]


//export route configuration and route module(basic angular configuration)
export const appRoutingProviders: any[] = [];

export const routingModule: ModuleWithProviders = RouterModule.forRoot(appRoutes);

