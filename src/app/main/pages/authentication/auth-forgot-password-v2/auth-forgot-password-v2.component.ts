import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { first, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { CoreConfigService } from "@core/services/config.service";
import { AuthenticationService } from "app/auth/service";
import { AnyPtrRecord } from "dns";
import { NotificationService } from "app/services/notification.service";

@Component({
  selector: "app-auth-forgot-password-v2",
  templateUrl: "./auth-forgot-password-v2.component.html",
  styleUrls: ["./auth-forgot-password-v2.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AuthForgotPasswordV2Component implements OnInit {
  // Public
  public emailVar;
  public coreConfig: any;
  public forgotPasswordForm: FormGroup;
  public submitted = false;
  public error: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   *
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _notificationService: NotificationService
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        menu: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        customizer: false,
        enableLocalStorage: false,
      },
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    const resetPasswordCredentials = this.forgotPasswordForm.value;
    this._authenticationService
      .resetPassword(resetPasswordCredentials)
      .pipe(first())
      .subscribe(
        (body) => {
          this._notificationService.success(
            "An email has been sent to your email",
            "Reset password"
          );
          console.log(body);
        },
        (err) => {
          console.log(err);
          this.error = err;
        }
      );
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });

    // Subscribe to config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.coreConfig = config;
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
