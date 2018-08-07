import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit {
    public artist: Artist;
    public albums: Album[];
    public identity: string;
    public token: string;
    public url: string;
    public urlArtist: string;
    public urlImage: string;
    public urlAlbumImage: string;
    public confirm_delete: string;

    public constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _artistService: ArtistService
    ) {
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.url = GLOBAL.url;
        this.urlArtist = GLOBAL.url + GLOBAL.urlArtist;
        this.urlImage = GLOBAL.url + GLOBAL.urlArtist + '/image/';
        this.urlAlbumImage = GLOBAL.url + GLOBAL.urlAlbum + '/image/';
    }

    ngOnInit() {
        this.getArtist();
    }

    getArtist() {
        //get param id of request 
        this._route.params.forEach(params => {
            let id = params['id'];
            this._artistService.getArtist(this.token, id).subscribe(
                response => {
                    let artistTemp = JSON.parse((<any>response)._body).artist;
                    if (artistTemp) {
                        //Request all albums by artist
                        this.artist = artistTemp;
                        this._albumService.getAlbums(this.token, artistTemp._id).subscribe(
                            response => {
                                let albums_artist = JSON.parse((<any>response)._body)
                                if (albums_artist) {
                                    this.albums = albums_artist.albums;
                                } else {
                                    console.log(new Error("SERVER ERROR"));
                                    this._router.navigate(['/artists/', 1]);
                                }
                            },
                            error => {
                                let err = JSON.parse((<any>error)._body).message;
                                if (err)
                                    console.log(err);
                            }
                        );

                    } else {
                        this._router.navigate(['/']);
                    }

                },
                error => {
                    let err = JSON.parse((<any>error)._body).message;
                    if (err)
                        console.log(err);
                }
            );
        })
    }

    onConfirmDelete(id: string) {
        this.confirm_delete = id;
    }

    onCancel() {
        this.confirm_delete = null;
    }

    //ACORDARSE DE ELMINAR TODOS LOS ARCHIVOS DE AUDIO ASOCIADOS AL ALBUM COMO TAMBIEN LA IMG DE ALBUM
    onDeleteAlbum(id) {
        this._albumService.deleteAlbum(this.token, id).subscribe(
            response => {
                let albumTemp = JSON.parse((<any>response)._body).album_removed;
                if (albumTemp) {
                    this.getArtist();
                } else {
                    console.log(new Error('SERVER ERROR'))
                }
            },
            error => {
                let err = JSON.parse((<any>error)._body).message;
                if (err)
                    console.log(err);
            }
        );
    }

}