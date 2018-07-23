import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';


@Injectable()
export class ArtistService implements OnInit{
    public url: string;
    public urlArtist: string;

    constructor(
        private _http: Http
    ){
        this.url = GLOBAL.url;
        this.urlArtist = GLOBAL.url + GLOBAL.urlArtist;
    }

    ngOnInit(){

    }

    getArtists(token, page){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let options = new RequestOptions({ headers: headers });

        return this._http.get(this.urlArtist + '?page=' + page, options)
                    .pipe(map(res => res));
    }

    getArtist(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let options = new RequestOptions({ headers: headers });

        return this._http.get(this.urlArtist + '/' + id, options)
                    .pipe(map(res => res));
    }

    addArtist(token, artist: Artist){
        let params = JSON.stringify(artist);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.post(this.urlArtist, params, {headers: headers})
                    .pipe(map(res => res));
    }

    updateArtist(token, id: string, artist: Artist){
        let params = JSON.stringify(artist);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.urlArtist + '/' + id, params, {headers: headers})
                    .pipe(map(res => res));
    }

    deleteArtist(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.delete(this.urlArtist + '/' + id, {headers: headers})
                    .pipe(map(res => res));
    }
}