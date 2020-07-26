import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService, AuthorizationService } from 'src/app/services';
import {
  transition,
  trigger,
  state,
  style,
  animate,
} from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [
    trigger('registerDiv', [
      state('shown', style({
        transform: 'translateX(0px)',
        opacity: 1
      })),
      state('hidden', style({
        transform: 'translateX(-480px)',
        opacity: 0
      })),
      state('wide', style({
        transform: 'translateX(12px)',
        opacity: 1
      })),
      transition('shown => hidden', [
        animate('0.2s')
      ]),
      transition('shown => wide', [
        animate('0.1s')
      ]),
      transition('wide => hidden', [
        animate('0.2s')
      ]),
      transition('hidden => wide', [
        animate('0.2s')
      ]),
      transition('wide => shown', [
        animate('0.1s')
      ])
    ])
  ]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  animationState = 'hidden';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authorizationService: AuthorizationService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    setTimeout(() => {
      this.animationState = 'wide';
    }, 100);
    setTimeout(() => {
      this.animationState = 'shown';
    }, 400);
    if (this.authorizationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: [''],
      emailId: ['', [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  routeTo(val) {
    this.animationState = 'wide';
    setTimeout(() => {
      this.animationState = 'hidden';
    }, 200);
    setTimeout(() => {
      this.router.navigate([val]);
    }, 300);
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.animationState = 'wide';
          setTimeout(() => {
            this.animationState = 'hidden';
          }, 200);
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 300);
        },
        error => {
          this.snackBar.open(error , "Close", {
            duration: 10000,
          });
          this.loading = false;
        });
  }
}