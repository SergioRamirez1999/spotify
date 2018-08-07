import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';

@Component({
    selector: 'player',
    templateUrl: '../views/player.html',
    providers: [UserService]
})

export class PlayerComponent implements OnInit {
    public urlSongFile: string;
    public urlSong: string;
    public urlAlbum: string;
    public identity: string;
    public token: string;
    public song: Song;

    constructor(
        private _userService: UserService
    ) {
        this.urlSongFile = GLOBAL.url + GLOBAL.urlSong + '/file/';
        this.urlSong = GLOBAL.url + GLOBAL.urlSong;
        this.urlAlbum = GLOBAL.url + GLOBAL.urlAlbum;
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
    }

    ngOnInit() {

        let songTemp = JSON.parse(localStorage.getItem('sound_song'));
        if (songTemp) {
            this.song = songTemp;
        } else {
            this.song = new Song('1', '', '', '', '');
        }
    }

    getFilePath() {
        if (this.song.file != '') {
            return this.urlSongFile + this.song.file;
        } else {
            return '';
        }
    }

    onLoop() {
        let is_loop = document.querySelector('#player').getAttribute('loop');
        if (!is_loop) {
            document.querySelector('#player').setAttribute('loop', 'loop');
            document.querySelector('#loop-selector').classList.add('loop_checked');
        } else {
            document.querySelector('#player').removeAttribute('loop');
            document.querySelector('#loop-selector').classList.remove('loop_checked');
        }

    }
}
