import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthorizationService } from './services';
import { User } from './models/user';

@Component({ selector: 'app-root', templateUrl: 'app.component.html'})
export class AppComponent {
    currentUser: User;

    constructor(
        private router: Router,
        private authorizationService: AuthorizationService
    ) {
        this.authorizationService.currentUser.subscribe(x => this.currentUser = x);
    }

    logout() {
        this.authorizationService.logout();
        this.router.navigate(['/login']);
    }
}