import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {emailAvailabilityValidator, passwordMatchValidator} from './RegistrationValidator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;

  // snackBar configuration details
  private readonly unknownErrorMessage = 'Registration unsuccessful. Do you already have an account?';
  private readonly successMessage = 'Registration successful. Feel free to login.';
  private readonly snackBarConfiguration: MatSnackBarConfig = {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center'
  };

  constructor(fb: FormBuilder,
              private router: Router,
              private authService: AuthenticationService,
              private snackBar: MatSnackBar) {

    this.registerForm = fb.group({
      email: ['', [Validators.required, Validators.email], emailAvailabilityValidator(authService)],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {validators: passwordMatchValidator});
  }

  /**
   * Form submission callback
   */
  onSubmit(formValues: any) {
    const email = formValues.email;
    const password = formValues.password;

    this.authService.registerNewUser(email, password).subscribe({
      error: () => this.failure(),
      complete: () => this.success()
    });
  }

  /**
   * Registration failure callback.
   *
   * Display failure notification and reset password fields.
   */
  private failure() {
    this.registerForm.controls.password.reset();
    this.registerForm.controls.confirmPassword.reset();

    this.snackBar.open(this.unknownErrorMessage, 'ok', this.snackBarConfiguration);
  }

  /**
   * Registration success callback.
   *
   * Redirect user to login page and display success confirmation.
   */
  private success() {
    this.router.navigateByUrl('/user/login');
    this.snackBar.open(this.successMessage, 'ok', this.snackBarConfiguration);
  }

  get emailErrors(): string[] {
    const errors = this.registerForm.controls.email.errors;
    return errors ? Object.keys(errors) : [];
  }

  get passwordErrors(): string[] {
    const errors = this.registerForm.controls.password.errors;
    return errors ? Object.keys(errors) : [];
  }

  get confirmPasswordErrors(): string[] {
    const errors = this.registerForm.controls.confirmPassword.errors;
    return errors ? Object.keys(errors) : [];
  }
}
