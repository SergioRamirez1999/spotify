import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

//Dependency injection
@Injectable()
export class UserService {
    public identity;
    public token;
    public url: string;
    public urlUser: string;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.urlUser = this.url + GLOBAL.urlUser;
    }

    //login 
    public signin(user_to_login, gethash = null) {
        if (gethash != null) {
            //add property gethash initialized to gethash param value
            user_to_login.gethash = gethash;
        }

        let json = JSON.stringify(user_to_login);
        let params = json;

        let headers = new Headers({ 'Content-Type': 'application/json' });

        //send request by post method 
        return this._http.post(this.urlUser + 'login', params, { headers: headers })
            .pipe(map(res => res));

    }

    public signup(user_to_register) {
        let json = JSON.stringify(user_to_register);
        let params = json;

        let headers = new Headers({ 'Content-Type': 'application/json' });

        return this._http.post(this.urlUser + 'register', params, { headers: headers })
            .pipe(map(res => res));

    }

    public userUpdate(user_to_update) {
        let json = JSON.stringify(user_to_update);
        let params = json;

        let headers = new Headers(
            {
                'Content-Type': 'application/json',
                'Authorization':this.getToken()
            }
        );


        return this._http.put(this.urlUser + user_to_update._id, params, { headers: headers })
            .pipe(map(res => res));
    }

    public getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));

        if (identity != 'undefined')
            this.identity = identity
        else
            this.identity = null

        return identity;
    }

    public getToken() {
        let token = localStorage.getItem('token');

        if (token != 'undefined')
            this.token = token
        else
            this.token = null

        return token;
    }
}