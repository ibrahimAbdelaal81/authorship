import { Component, OnInit } from "@angular/core";

import { switchMap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { CoreConfigService } from "@core/services/config.service";
import { AuthenticationService } from "app/auth/service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-maintenance",
  templateUrl: "./maintenance.component.html",
  styleUrls: ["./maintenance.component.scss"],
})
export class MaintenanceComponent implements OnInit {
  public coreConfig: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _authenticationService: AuthenticationService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        menu: {
          hidden: true,
        },
        customizer: false,
        enableLocalStorage: false,
      },
    };
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.coreConfig = config;
      });

    this._route.paramMap
      .pipe(
        switchMap((params) =>
          this._authenticationService.verifyEmail({
            token: params.get("token"),
          })
        )
      )
      .subscribe((res) => {
        console.log(res);
        // this._router.navigate(["/"]);
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
