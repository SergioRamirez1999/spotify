import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit {
    public title: string;
    public artists: Artist[];
    public identity;
    public token;
    public url: string;
    public prev_page;
    public next_page;
    public urlImage;
    public confirm_delete: string;

    public constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ) {
        this.title = 'Artists';
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.url = GLOBAL.url;
        this.prev_page = 1;
        this.next_page = 1;
        this.urlImage = GLOBAL.url + GLOBAL.urlArtist + '/image/';
    }

    ngOnInit() {
        this.getArtists();
    }

    getArtists() {
        this._route.params.forEach((params: Params) => {
            // casting to number --> +
            let page = +params['page'];

            // check pagination
            if (!page) {
                page = 1;
            } else {
                this.prev_page = page - 1;
                this.next_page = page + 1;

                if (this.prev_page <= 0)
                    this.prev_page = 1

            }
            //implementar logica para que utilize solo paginas que tengan algun artista

            this._artistService.getArtists(this.token, page).subscribe(
                response => {
                    let artistsTemp = JSON.parse((<any>response)._body).artists;
                    if (artistsTemp) {
                        this.artists = artistsTemp;
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
        });
    }

    onConfirmDelete(id: string) {
        this.confirm_delete = id;
    }

    onCancel() {
        this.confirm_delete = null;
    }

    onDeleteArtist(id) {
        this._artistService.deleteArtist(this.token, id).subscribe(
            response => {
                let artistsTemp = JSON.parse((<any>response)._body).artist_removed;
                if (artistsTemp) {
                    this.getArtists();
                } else {
                    console.log(new Error('error re zarpado loco'))
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