import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Song } from '../models/song';


@Injectable()
export class SongService implements OnInit{
    public url: string;
    public urlSong: string;

    constructor(
        private _http: Http
    ){
        this.url = GLOBAL.url;
        this.urlSong = GLOBAL.url + GLOBAL.urlSong;
    }

    ngOnInit(){

    }

    addSong(token, song: Song){
        let params = JSON.stringify(song);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.post(this.urlSong, params, {headers: headers})
                    .pipe(map(res => res));
    }

    getSong(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let options = new RequestOptions({headers: headers});

        return this._http.get(this.urlSong + '/' + id, options)
                    .pipe(map(res => res));
    }

    getSongs(token, albumId = null){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let options = new RequestOptions({headers: headers});

        if(albumId){
            return this._http.get(this.urlSong + '/?album=' + albumId, options)
                    .pipe(map(res => res));
        }

        return this._http.get(this.urlSong + '?page=' + 1, options)
                    .pipe(map(res => res));
        
    }

    updateSong(token, id: string, song: Song ){
        let params = JSON.stringify(song);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.urlSong + '/' + id, params, {headers: headers})
                    .pipe(map(res => res));
    }

    deleteSong(token, id: string){
        let headers = new Headers ({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.delete(this.urlSong + '/' + id, {headers: headers})
                   .pipe(map(res => res));
    }

    
}