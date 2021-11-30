import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UsersService } from "./../../../../services/users.service";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { CoreConfigService } from "@core/services/config.service";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";

import { UserListService } from "app/main/apps/user/user-list/user-list.service";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UserListComponent implements OnInit {
  // Public
  public allUsers = [];
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = "";
  public previousPlanFilter = "";
  public loading = false;
  public error = "";
  public previousStatusFilter = "";
  public selectRole: any = [
    { name: "All", value: "" },
    { name: "Admin", value: "admin" },
    { name: "User", value: "user" },
  ];
  public selectStatus: any = [
    { name: "All", value: "" },
    { name: "Approved", value: "Approved" },
    { name: "Pending", value: "Pending" },
    { name: "Declined", value: "Declined" },
  ];
  public selectOptions: any = [
    { name: "Approved", value: "Approved" },
    { name: "Pending", value: "Pending" },
    { name: "Declined", value: "Declined" },
  ];

  public selectedRole = [];
  public selectedPlan = [];
  public selectedStatus = [];
  public searchValue = "";
  editModal;
  selectedUser;
  selectedUserVal;
  userRole: string;
  loggedIn = JSON.parse(localStorage.getItem("currentUser"));
  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {UserListService} _userListService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _userListService: UserListService,
    private _coreSidebarService: CoreSidebarService,
    private userService: UsersService,
    private modalService: NgbModal,
    private _coreConfigService: CoreConfigService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    // Reset ng-select on search
    this.selectedRole = this.selectRole[0];
    this.selectedStatus = this.selectStatus[0];

    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.allUsers.filter(function (d) {
      return (
        d.firstName.toLowerCase().indexOf(val) !== -1 ||
        d.lastName.toLowerCase().indexOf(val) !== -1 ||
        d.mobile.toLowerCase().indexOf(val) !== -1 ||
        d.email.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });

    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Filter By Roles
   *
   * @param event
   */
  filterByRole(event) {
    const filter = event ? event.value : "";
    this.previousRoleFilter = filter;
    this.temp = this.filterRows(
      filter,
      this.previousPlanFilter,
      this.previousStatusFilter
    );
    this.rows = this.temp;
  }

  /**
   * Filter By Status
   *
   * @param event
   */
  filterByStatus(event) {
    const filter = event ? event.value : "";
    this.previousStatusFilter = filter;
    this.temp = this.filterRows(
      this.previousRoleFilter,
      this.previousPlanFilter,
      filter
    );
    this.rows = this.temp;
  }

  /**
   * Filter Rows
   *
   * @param roleFilter
   * @param planFilter
   * @param statusFilter
   */
  filterRows(roleFilter, planFilter, statusFilter): any[] {
    // Reset search on select change
    this.searchValue = "";

    roleFilter = roleFilter.toLowerCase();
    planFilter = planFilter.toLowerCase();
    statusFilter = statusFilter.toLowerCase();

    return this.allUsers.filter((row) => {
      const isPartialNameMatch =
        row.roles[0].indexOf(roleFilter) !== -1 || !roleFilter;
      // const isPartialGenderMatch =
      //   row.currentPlan.toLowerCase().indexOf(planFilter) !== -1 || !planFilter;
      const isPartialStatusMatch =
        row.appStatus.toLowerCase().indexOf(statusFilter) !== -1 ||
        !statusFilter;
      return isPartialNameMatch && isPartialStatusMatch;
    });
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe config change
    // this._coreConfigService.config
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((config) => {
    //     //! If we have zoomIn route Transition then load datatable after 450ms(Transition will finish in 400ms)
    //     if (config.layout.animation === "zoomIn") {
    //       setTimeout(() => {
    //         this._userListService.onUserListChanged
    //           .pipe(takeUntil(this._unsubscribeAll))
    //           .subscribe((response) => {
    //             this.rows = response;
    //             this.tempData = this.rows;
    //           });
    //       }, 450);
    //     } else {
    //       this._userListService.onUserListChanged
    //         .pipe(takeUntil(this._unsubscribeAll))
    //         .subscribe((response) => {
    //           this.rows = response;
    //           this.tempData = this.rows;
    //         });
    //     }
    //   });
    this.userRole = this.loggedIn.role;
    this.getAllUsers();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  getAllUsers(): any {
    this.loading = true;
    this.userService.getAllUsers().subscribe(
      (result) => {
        this.rows = result;
        this.allUsers = result;
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.error = error;
        this.loading = false;
      }
    );
  }
  // modal Open Form
  modalOpenForm(modalForm, user) {
    this.selectedUser = user;
    this.selectedUserVal = user.appStatus;
    this.editModal = this.modalService.open(modalForm);
  }
  //  edit() {
  // this.loading = true;
  // const userData = this.finalUserData();
  // this.httpUserService.update(this.user._id, userData).subscribe(
  //   (data) => {
  //     if (data.status === 200) {
  //       this.dialogRef.close();
  //       this.notificationService.successNotification(
  //         "The user updated successfully"
  //       );
  //       this.loading = false;
  //     }
  //   },
  //   (err) => {
  //     this.loading = false;
  //     this.notificationService.errorNotification(err.message);
  //   }
  // );
  //}
  edit() {
    this.loading = true;
    this.userService
      .update(this.selectedUser._id, { appStatus: this.selectedUserVal })
      .subscribe(
        (result) => {
          this.loading = false;
          this.getAllUsers();
          this.editModal.close();
        },
        (error) => {
          console.log(error);
          this.error = error;
          this.loading = false;
        }
      );
  }
}
