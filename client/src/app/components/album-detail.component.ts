import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Album } from '../models/album';

import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit {
    public album: Album;
    public songs: Song[];
    public identity: string;
    public token: string;
    public url: string;
    public urlImage: string;
    public confirm_delete: string;

    public constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService
    ) {
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.url = GLOBAL.url;
        this.urlImage = GLOBAL.url + GLOBAL.urlAlbum + '/image/';
    }

    ngOnInit() {
        this.getAlbum();
    }

    getAlbum() {

        //get param id of request 
        this._route.params.forEach(params => {
            let id = params['id'];
            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    let albumTemp = JSON.parse((<any>response)._body).album;
                    if (albumTemp) {
                        this.album = albumTemp;
                        this.getSongs(albumTemp._id);
                    } else {
                        console.log(new Error('SERVER ERROR'))
                        this._router.navigate(['/artist/', this.album.artist]);
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

    getSongs(id_album: string) {
        this._songService.getSongs(this.token, id_album).subscribe(
            response => {

                let songTemp = JSON.parse((<any>response)._body).songs;
                if (songTemp) {
                    this.songs = songTemp;
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

    onConfirmDelete(id: string) {
        this.confirm_delete = id;
    }

    onCancel() {
        this.confirm_delete = null;
    }

    onDeleteSong(id: string) {
        this._songService.deleteSong(this.token, id).subscribe(
            response => {
                let songTemp = JSON.parse((<any>response)._body).song_removed;
                if (songTemp) {
                    this.getSongs(songTemp.album);
                }
            },
            error => {
                let err = JSON.parse((<any>error)._body).message;
                if (err)
                    console.log(err);
            }
        );
    }

    onStartPlayer(song){
        let tempSong = JSON.stringify(song);
        let file_path = GLOBAL.url + GLOBAL.urlSong + '/file/' + song.file;
        let album_image = GLOBAL.url + GLOBAL.urlAlbum + '/image/' + song.album.image;

        localStorage.setItem('sound_song', tempSong);

        //src request file song
        document.querySelector('#mp3_source').setAttribute("src", file_path);

        //play song 
        (document.querySelector('#player') as any).load();
        (document.querySelector('#player') as any).play();

        document.querySelector('#play_song_title').innerHTML = song.name;
        document.querySelector('#play_song_artist').innerHTML = song.album.artist.name;
        document.querySelector('#play_image_album').setAttribute('src', album_image);

    }

}