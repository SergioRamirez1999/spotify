import { Component } from '@angular/core';
import { User } from './models/user';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',

})
export class AppComponent {
    public title = 'MUSIFY';
    public user: User;
    //identity representara a la sesion del usuario, estara almacenado en local storage
    public identity;
    public token;

    constructor() {
        this.user = new User('', '', '', '', '', 'ROLE_USER', '');

    }

    public onSubmit(){
        console.log(this.user)
    }
}
