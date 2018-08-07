import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Album } from '../models/album';


@Injectable()
export class AlbumService implements OnInit{
    public url: string;
    public urlAlbum: string;

    constructor(
        private _http: Http
    ){
        this.url = GLOBAL.url;
        this.urlAlbum = GLOBAL.url + GLOBAL.urlAlbum;
    }

    ngOnInit(){

    }

    addAlbum(token, album: Album){
        let params = JSON.stringify(album);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.post(this.urlAlbum, params, {headers: headers})
                    .pipe(map(res => res));
    }

    getAlbum(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let options = new RequestOptions({headers: headers});

        return this._http.get(this.urlAlbum + '/' + id, options)
                    .pipe(map(res => res));
    }

    getAlbums(token, artistId = null){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let options = new RequestOptions({headers: headers});

        if(artistId){
            return this._http.get(this.urlAlbum + '?artist=' + artistId, options)
                    .pipe(map(res => res));
        } else{
            let page = 1;
            return this._http.get(this.urlAlbum + '?page=' + page, options)
                    .pipe(map(res => res));
        }

        
    }

    updateAlbum(token, id: string, album: Album){
        let params = JSON.stringify(album);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });


        return this._http.put(this.urlAlbum + '/' + id, params, {headers: headers})
                    .pipe(map(res => res));
    }

    deleteAlbum(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });


        return this._http.delete(this.urlAlbum + '/' + id, {headers: headers})
                    .pipe(map(res => res));
    }

    
}