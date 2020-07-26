import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthorizationService } from 'src/app/services';

@Injectable({ providedIn: 'root' })
export class AuthHelper implements CanActivate {
    constructor(
        private router: Router,
        private authorizationService: AuthorizationService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authorizationService.currentUserValue;
        if (currentUser) {
            return true;
        }

        // redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}