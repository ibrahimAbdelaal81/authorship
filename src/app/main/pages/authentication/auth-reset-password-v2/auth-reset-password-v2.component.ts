import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { switchMap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { CoreConfigService } from "@core/services/config.service";
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "app/auth/service";

@Component({
  selector: "app-auth-reset-password-v2",
  templateUrl: "./auth-reset-password-v2.component.html",
  styleUrls: ["./auth-reset-password-v2.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AuthResetPasswordV2Component implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public confPasswordTextType: boolean;
  public resetPasswordForm: FormGroup;
  public submitted = false;
  public verified: boolean;
  public verifying: boolean;
  public loading: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _route: ActivatedRoute
  ) {
    this._unsubscribeAll = new Subject();
    this.verified = false;
    this.loading = false;
    this.verifying = true;

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
    return this.resetPasswordForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * Toggle confirm password
   */
  toggleConfPasswordTextType() {
    this.confPasswordTextType = !this.confPasswordTextType;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.resetPasswordForm = this._formBuilder.group({
      newPassword: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
    });
    this.loading = true;
    this._route.queryParams
      .pipe(
        switchMap((params: any) =>
          this._authenticationService.verifyResetPassword({
            _id: params.id,
            token: params.token,
          })
        )
      )
      .subscribe(
        (res) => {
          console.log(res);
          this.loading = false;
          this.verifying = false;
          this.verified = true;
        },
        (err) => {
          console.log(err);
          this.verified = false;
          this.loading = false;
          this.verifying = false;
        }
      );

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
