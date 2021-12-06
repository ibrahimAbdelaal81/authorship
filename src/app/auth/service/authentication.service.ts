import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "environments/environment";
import { User, Role } from "app/auth/models";
import { ToastrService } from "ngx-toastr";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(
    private _http: HttpClient,
    private _toastrService: ToastrService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return (
      this.currentUser && this.currentUserSubject.value.role === Role.Admin
    );
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    return (
      this.currentUser && this.currentUserSubject.value.role === Role.Client
    );
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(email: string, password: string) {
    return (
      this._http
        // .post<any>(`${environment.apiUrl}/users/authenticate`, {
        .post<any>(`${environment.apiUrl}/auth/local/login`, {
          // .post<any>(`https://backend.realauthor.com/auth/local/login`, {
          username: email,
          // email,
          password,
        })
        .pipe(
          map((user) => {
            // login successful if there's a jwt token in the response
            if (user.user.appStatus == "Pending") {
              // this._router.navigate(["/pages/miscellaneous/not-authorized"]);
              const obj = {
                msg: "Your account is pending approval by admin",
                status: "401",
              };
              return obj;
            } else if (user.user.appStatus == "Declined") {
              // this._router.navigate(["/pages/miscellaneous/not-authorized"]);
              const obj = {
                msg: "Your account is rejected by admin",
                status: "403",
              };
              return obj;
            } else if (user && user.token) {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              // localStorage.setItem("currentUser", JSON.stringify(user));
              const role = user.user.roles[0] == "admin" ? "Admin" : "User";
              const obj: any = {
                token: user.token,
                avatar: "avatar-s-11.jpg",
                email: user.user.email,
                appStatus: user.user.appStatus,
                firstName: user.user.firstName,
                id: user.user._id,
                lastName: user.user.lastName,
                role,
                image: user.user.image,
              };
              localStorage.setItem("currentUser", JSON.stringify(obj));

              // Display welcome toast!
              setTimeout(() => {
                this._toastrService.success(
                  "You have successfully logged in as an " +
                    // user.role +
                    role +
                    " user to RealAuthor. Now you can start to explore. Enjoy! 🎉",
                  "👋 Welcome, " + user.user.firstName + "!",
                  { toastClass: "toast ngx-toastr", closeButton: true }
                );
              }, 2500);

              // notify
              this.currentUserSubject.next(obj);
            }

            return user;
          })
        )
    );
  }

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    // notify
    this.currentUserSubject.next(null);
  }

  /**
   * Reset password
   *
   * @param resetPasswordCredentials
   */
  resetPassword(resetPasswordCredentials: any) {
    return this._http
      .post(
        `${environment.apiUrl}/auth/local/reset-password`,
        resetPasswordCredentials
      )
      .pipe(
        map((res) => {
          setTimeout(() => {
            this._toastrService.success(
              "An email has been sent to reset your password",
              "Check you email",
              { toastClass: "toast ngx-toastr", closeButton: true }
            );
          }, 2500);
          return res;
        })
      );
  }

  /**
   * Reset password
   *
   * @param resetPasswordCredentials
   */
  verifyResetPassword(resetPasswordCredentials: any) {
    return this._http
      .post(
        `${environment.apiUrl}/auth/local/verify-reset-password`,
        resetPasswordCredentials
      )
      .pipe(
        map((user: any) => {
          if (user && user.token) {
            const role = user.user.roles[0] == "admin" ? "Admin" : "User";
            const obj: any = {
              token: user.token,
              avatar: "avatar-s-11.jpg",
              email: user.user.email,
              appStatus: user.user.appStatus,
              firstName: user.user.firstName,
              id: user.user._id,
              lastName: user.user.lastName,
              role,
              image: user.user.image,
            };
            localStorage.setItem("currentUser", JSON.stringify(obj));

            // notify
            this.currentUserSubject.next(obj);
          }

          return user;
        })
      );
  }
}
