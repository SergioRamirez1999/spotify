import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';

@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit {
    public titleTemplate: string;
    public song: Song;
    public identity: string;
    public token: string;
    public urlSongFile: string;
    public urlSong: string;
    public infoMessage: string;
    public errorMessage: string;
    public isEdit: boolean;
    public filesToUpload: Array<File>;

    public constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
        private _uploadService: UploadService
    ) {
        this.titleTemplate = "Add Song";
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.song = new Song('', '', '', '', '');
        this.urlSong = GLOBAL.url + GLOBAL.urlSong;
        this.urlSongFile = GLOBAL.url + GLOBAL.urlSong + '/file/';
        this.isEdit = true;
    }

    ngOnInit() {
        this.getSong();
    }

    getSong() {
        this._route.params.forEach((params: Params) => {
            let song_id = params['id'];

            this._songService.getSong(this.token, song_id).subscribe(
                response => {
                    let songTemp = JSON.parse((<any>response)._body).song;
                    if (songTemp) {
                        this.song = songTemp;
                    } else {
                        this.errorMessage = 'SERVER ERROR';
                        console.log(new Error('SERVER ERROR'))
                    }

                },
                error => {
                    this.errorMessage = JSON.parse((<any>error)._body).message;
                    if (this.errorMessage) {
                        console.log(error);
                        console.log(new Error('SERVER ERROR'))
                    }
                }
            );
        });
    }


    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let song_id = params['id'];
            this._songService.updateSong(this.token, song_id, this.song).subscribe(
                response => {
                    let songTemp = JSON.parse((<any>response)._body).song_updated;
                    if (songTemp) {

                        //Upload file song
                        if (this.filesToUpload) {
                            this._uploadService.makeFileRequest(this.urlSongFile + songTemp._id, [], this.filesToUpload, this.token, 'file')
                                .then(
                                    resolve => { 
                                        console.log(resolve);
                                        console.log(this.filesToUpload);
                                    },
                                    error => {
                                        this.errorMessage = JSON.parse((<any>error)._body).message;
                                        if (this.errorMessage) {
                                            console.log(error);
                                            console.log(new Error('SERVER ERROR'))
                                        }
                                    }
                                );
                        }

                        this._router.navigate(['/album/', songTemp.album]);

                    } else {
                        this.errorMessage = 'SERVER ERROR';
                        console.log(new Error('SERVER ERROR'))
                    }
                },
                error => {
                    this.errorMessage = JSON.parse((<any>error)._body).message;
                    if (this.errorMessage) {
                        console.log(error);
                        console.log(new Error('SERVER ERROR'))
                    }

                }
            );

        });

    }


    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}