import { OnInit, Component } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit {
    public title: string;
    public user: User;
    public identity;
    public token;
    public alertUpdate;
    public filesToUpload: Array<File>;
    public url: string;

    constructor(
        private _userService: UserService
    ) {
        this.title = 'Update registration data';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url + GLOBAL.urlUser + 'image/';

    }

    ngOnInit() {

    }

    onSubmit() {
        this._userService.userUpdate(this.user).subscribe(
            response => {
                localStorage.setItem('identity', JSON.stringify(this.user));
                document.getElementById('identity_name').innerHTML = this.user.name;
                if (this.filesToUpload) {
                    let url = this.url + this.user._id;
                    this.makeFileRequest(url, [], this.filesToUpload).then(
                        (result: any) => {
                            this.user.image = result.image;
                            localStorage.setItem('identity', JSON.stringify(this.user));
                            let image_path = this.url + this.user.image;
                            document.getElementById('image_logged').setAttribute('src', image_path);
                            console.log(this.user);
                        },
                        (error: any) => {
                            console.log(Error('error when update image'));
                        }
                    );
                } else {
                    console.log('filesToUpload no seteado');
                }

                this.alertUpdate = 'The data was updated';
            },
            error => {
                this.alertUpdate = JSON.parse((<any>error)._body).message;
                if (this.alertUpdate)
                    console.log(error);

            }
        );
    }

    //Method to get all image files 
    //Generic type
    fileChangeEvent(fileInput: any) {
        //casting
        this.filesToUpload = <Array<File>>fileInput.target.files;

    }
    //AJAX REQUEST
    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        let token = this.token;

        return new Promise((resolve, reject) => {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            for (let i = 0; i < files.length; i++) {
                //adding elements to formData
                formData.append('image', files[i], files[i].name);
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
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }


}



