import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService, AuthorizationService } from 'src/app/services/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    currentUser: User;
    users = [];

    constructor(
        private authorizationService: AuthorizationService,
        private userService: UserService,
        private router: Router
    ) {
        this.currentUser = this.authorizationService.currentUserValue;
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    deleteUser(id: number) {
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllUsers());
    }

    private loadAllUsers() {
        this.userService.getUsersList()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    openGitHub() {
      window.open("https://github.com/arjun9218/frontend-vmware-test", "_blank");
    }

    logout() {
      this.authorizationService.logout();
      this.router.navigate(['/login']);
  }
}