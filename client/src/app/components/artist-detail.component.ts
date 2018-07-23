import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService]
})

export class ArtistDetailComponent implements OnInit {
    public artist: Artist;
    public identity: string;
    public token: string;
    public url: string;
    public urlArtist: string;
    public urlImage: string;

    public constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ) {
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.url = GLOBAL.url;
        this.urlArtist = GLOBAL.url + GLOBAL.urlArtist;
        this.urlImage = GLOBAL.url + GLOBAL.urlArtist + '/image/';
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
                        this.artist = artistTemp;
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
    
}