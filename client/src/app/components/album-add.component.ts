import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit {
    public titleTemplate: string;
    public artist: Artist;
    public album: Album;
    public identity: string;
    public token: string;
    public infoMessage: string;
    public errorMessage: string;

    public constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
    ) {
        this.titleTemplate = "Create Album";
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.album = new Album('', '', 2018, '', '');
    }

    ngOnInit() {
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let artist_id = params['id'];
            this.album.artist = artist_id;

            this._albumService.addAlbum(this.token, this.album).subscribe(
                response => {
                    let albumTemp = JSON.parse((<any>response)._body).album_stored;
                    if (albumTemp) {
                        this.album = albumTemp;
                        this._router.navigate(['/album-edit', albumTemp._id]);
                    } else {
                        this.errorMessage = 'SERVER ERROR';
                    }
                },
                error => {
                    this.errorMessage = JSON.parse((<any>error)._body).message;
                    if (this.errorMessage)
                        console.log(error);
                }
            );
        });
    }

}