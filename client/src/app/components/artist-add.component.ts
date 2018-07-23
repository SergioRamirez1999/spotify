import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit {
    public title: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public infoMessage;

    public constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ) {
        this.title = 'Add Artist';
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
    }

    ngOnInit() {
    }

    onSubmit() {
        this._artistService.addArtist(this.token, this.artist).subscribe(
            response => {
                let artistTemp = JSON.parse((<any>response)._body).artist;
                if (artistTemp) {
                    this.infoMessage = 'The Artist has been added';
                    this.artist = artistTemp;
                    this._router.navigate(['/artist-edit', artistTemp._id]);
                } else {
                    this.alertMessage = 'SERVER ERROR';
                }
            },
            error => {
                this.alertMessage = JSON.parse((<any>error)._body).message;
                if (this.alertMessage)
                    console.log(error);
            }
        );
    }
}