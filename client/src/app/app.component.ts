import { Component, OnInit } from '@angular/core';

import{ GLOBAL } from './services/global';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    //add services for dependency injection
    providers: [UserService]
})
export class AppComponent implements OnInit {
    public title = 'MUSIFY';
    public user: User;
    public user_register: User;
    //identity will represent the user session, it will stored in local storage
    public identity;
    public token;
    public errorMessage;
    public alertRegister;
    public url: string;

    constructor(private _userService: UserService, private _router: Router) {
        this.user = new User('', '', '', '', '', 'ROLE_USER', '');
        this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url + GLOBAL.urlUser + 'image/';

    }

    public ngOnInit() {
        
        
    }


    public onSubmitLogin() {

        this._userService.signin(this.user).subscribe(
            response => {
                this.identity = JSON.parse(((<any>response)._body)).user;
                
                if (this.identity._id) {
                    this._userService.signin(this.user, 'true').subscribe(
                        response => {
                            this.token = JSON.parse((<any>response)._body).token;
                            localStorage.setItem('identity', JSON.stringify(this.identity));
                            localStorage.setItem('token', this.token);
                            //set user for others user login(two-way data binding)
                            this.user = new User('', '', '', '', '', 'ROLE_USER', '');
                        },
                        error => {
                            console.log(error);
                        }
                    );
                }
            },
            error => {
                this.errorMessage = <any>error;
                if (this.errorMessage)
                    console.log(this.errorMessage);
            }
        );
    }

    public onSubmitRegister() {
        //create a module that sends an email for activation
        this._userService.signup(this.user_register).subscribe(
            response => {
                this.user_register = JSON.parse((<any>response)._body).user_stored;
                if(this.user_register._id)
                    this.alertRegister = 'User has been registered!! Please login via ' + this.user_register.email
                else
                    this.alertRegister = 'Error when register user. Please check the input data'
                //set user_register for others user registers(two-way data binding)    
                this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
            },
            error => {
                this.alertRegister = 'Error when register user';
                console.log(<any>error);
            }
        );
    }

    public onLogout() {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        this.identity = null;
        this.token = null;
        this._router.navigate(['/']);
    }
}
