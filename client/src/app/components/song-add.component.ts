import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';

@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService]
})

export class SongAddComponent implements OnInit {
    public titleTemplate: string;
    public song: Song;
    public identity: string;
    public token: string;
    public urlSong: string;
    public infoMessage: string;
    public errorMessage: string;

    public constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService
    ) {
        this.titleTemplate = "Add Song";
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.song = new Song('','', '', '', '');
        this.urlSong = GLOBAL.url + GLOBAL.urlSong + '/file/';
    }

    ngOnInit() {

    }

    
    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let album_id = params['id'];
            this.song.album = album_id;
            this._songService.addSong(this.token, this.song).subscribe(
                response => {
                    let songTemp = JSON.parse((<any>response)._body).song_stored;
                    if (songTemp) {
                        this.song = songTemp;
                        this._router.navigate(['/song-edit/', songTemp._id]);
                    } else {
                        this.errorMessage = 'SERVER ERROR';
                        console.log(new Error('SERVER ERROR'));
                    }
                },
                error => {
                    this.errorMessage = JSON.parse((<any>error)._body).message;
                    if (this.errorMessage) {
                        console.log(error);
                        console.log(new Error('SERVER ERROR'));
                    }
                }
            );

        });
        
    }
    

}