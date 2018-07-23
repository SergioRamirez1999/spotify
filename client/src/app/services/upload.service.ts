import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

//Dependency injection
@Injectable()
export class UploadService {
    public url: string;
    public filesToUpload: Array<File>;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    

     //AJAX REQUEST
     makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string) {

        return new Promise((resolve, reject) => {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            for (let i = 0; i < files.length; i++) {
                //adding elements to formData
                formData.append(name, files[i], files[i].name);
            }

            //check state of xhr
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }

            //send request with Authorization header
            xhr.open('PUT', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }


}