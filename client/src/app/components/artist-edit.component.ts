import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit {
    public title: string;
    public artist: Artist;
    public identity: string;
    public token: string;
    public url: string;
    public urlArtistImage: string;
    public alertMessage: string;
    public isEdit: boolean;
    public filesToUpload: Array<File>;

    public constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService: UploadService,
        private _artistService: ArtistService
    ) {
        this.title = 'Edit Artist';
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
        this.isEdit = true;
        this.urlArtistImage = GLOBAL.url + GLOBAL.urlArtist + '/image/';
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

    onSubmit() {
        this._route.params.forEach(params => {
            let id = params['id'];
            this._artistService.updateArtist(this.token, id, this.artist).subscribe(
                response => {

                    let artistTemp = JSON.parse((<any>response)._body).artist_updated;
                    if (artistTemp) {
                        //Upload artist image
                        if (this.filesToUpload) {
                            this._uploadService.makeFileRequest(this.urlArtistImage + artistTemp._id, [], this.filesToUpload, this.token, 'image')
                                .then(
                                    resolve => {
                                    },
                                    error => {
                                        console.log(error);
                                    }
                                );
                        }

                        this._router.navigate(['artist/', artistTemp._id]);

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
        });
    }

    //Method to get all image files 
    //Generic type
    fileChangeEvent(fileInput: any) {
        //casting
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}