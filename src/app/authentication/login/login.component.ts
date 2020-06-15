import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationFailedError, AuthenticationService} from '../services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

/**
 * Login form
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;

  // snackBar configuration details
  private readonly successMessage = 'Login successful';
  private readonly invalidDetailsMessage = 'Invalid login details';
  private readonly unknownErrorMessage = 'Unknown error while authenticating. Try again later';
  private readonly snackBarConfiguration: MatSnackBarConfig = {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center'
  };

  constructor(fb: FormBuilder,
              private authService: AuthenticationService,
              private router: Router,
              private location: Location,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute) {
    // build the FormGroup to bind to the for
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  /**
   * Submit button callback
   */
  onSubmit(formValues: any) {
    const email = formValues.email;
    const password = formValues.password;
    this.authService.login(email, password).subscribe(
      {
        error: err => {
          this.failure(err);
        },
        complete: () => {
          this.success();
        }
      }
    );
  }

  /**
   * Called if the AuthenticationService throws error on login
   */
  private failure(error) {
    this.loginForm.controls.password.reset();

    const message = error instanceof AuthenticationFailedError ?
      this.invalidDetailsMessage :
      this.unknownErrorMessage;

    this.snackBar.open(message, 'ok', this.snackBarConfiguration);
  }

  /**
   * Called when the AuthenticationService successfully logs in
   */
  private success() {
    const snapshot = this.route.snapshot;
    const params = snapshot.queryParamMap;
    if (params.has('return_to_previous') &&
      params.get('return_to_previous') === 'true') {
      this.location.back();
    } else {
      this.router.navigateByUrl('/forums');
    }
    this.snackBar.open(this.successMessage, 'ok', this.snackBarConfiguration);
  }

  get emailErrors(): string[] {
    const errors = this.loginForm.controls.email.errors;
    return errors ? Object.keys(errors) : [];
  }

  get passwordErrors(): string[] {
    const errors = this.loginForm.controls.password.errors;
    return errors ? Object.keys(errors) : [];
  }
}
