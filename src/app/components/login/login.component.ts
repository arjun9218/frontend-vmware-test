import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthorizationService } from 'src/app/services/index';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  transition,
  trigger,
  state,
  style,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('loginDiv', [
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
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = true;
  animationState = 'hidden';
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authorizationService: AuthorizationService,
    private snackBar: MatSnackBar
  ) {
    // redirect to home if already logged in
    if (this.authorizationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      emailId: ['', [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    setTimeout(() => {
      this.animationState = 'wide';
    }, 100);
    setTimeout(() => {
      this.animationState = 'shown';
    }, 400);
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
    if (this.loginForm.invalid) {
      return;
    }

    this.authorizationService.login(this.loginForm.controls.emailId.value, this.loginForm.controls.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.animationState = 'wide';
          setTimeout(() => {
            this.animationState = 'hidden';
          }, 200);
          setTimeout(() => {
            this.router.navigate([this.returnUrl]);
          }, 300)
        },
        error => {
          this.snackBar.open(error , "Close", {
            duration: 10000,
          });
        });
  }
}