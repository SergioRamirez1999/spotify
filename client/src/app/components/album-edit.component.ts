import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL } from '../services/global';
import { Album } from '../models/album';

@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit {
    public titleTemplate: string;
    public album: Album;
    public identity: string;
    public token: string;
    public urlAlbumImage: string;
    public infoMessage: string;
    public errorMessage: string;
    public isEdit: boolean;
    public filesToUpload: Array<File>;

    public constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService: UploadService,
        private _albumService: AlbumService
    ) {
        this.titleTemplate = "Edit Album";
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.album = new Album('', '', 2018, '', '');
        this.urlAlbumImage = GLOBAL.url + GLOBAL.urlAlbum + '/image/';
        this.isEdit = true;
    }

    ngOnInit() {
        this.getAlbum();
    }

    getAlbum() {
        this._route.params.forEach((params: Params) => {
            let album_id = params['id'];
            this._albumService.getAlbum(this.token, album_id).subscribe(
                response => {
                    let albumTemp = JSON.parse((<any>response)._body).album;
                    this.album = albumTemp;
                    console.log("Album obtenido");
                    console.log(this.album);

                },
                error => {
                    this.errorMessage = JSON.parse((<any>error)._body).message;
                    if (this.errorMessage)
                        console.log(error);
                }
            );
        });
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let album_id = params['id'];

            this._albumService.updateAlbum(this.token, album_id, this.album).subscribe(
                response => {
                    let albumTemp = JSON.parse((<any>response)._body).album_updated;
                    if (albumTemp) {
                        this.album = albumTemp;
                        //Upload album image
                        if (this.filesToUpload) {
                            this._uploadService.makeFileRequest(this.urlAlbumImage + albumTemp._id, [], this.filesToUpload, this.token, 'image')
                                .then(
                                    resolve => {},
                                    error => {
                                        console.log(new Error('SERVER ERROR'));
                                        console.log(error);
                                    }
                                );
                        }

                        this._router.navigate(['/artist/',  albumTemp.artist]);
                    } else {
                        this.errorMessage = 'SERVER ERROR';
                        console.log(new Error('SERVER ERROR'));
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

    //Method to get all image files 
    //Generic type
    fileChangeEvent(fileInput: any) {
        //casting
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}