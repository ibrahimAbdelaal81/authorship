import { Router } from "@angular/router";
import { ResearchesService } from "./../services/researches.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UsersService } from "./../services/users.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UserProfileComponent implements OnInit {
  loggedIn = JSON.parse(localStorage.getItem("currentUser"));
  user;
  research;
  selfProfile: boolean;
  userRole: string;
  imagePreview: any;
  image: any;
  public editUserForm: FormGroup;
  public submitted = false;
  public loading = false;
  public error = "";
  public ColumnMode = ColumnMode;
  editModal;
  constructor(
    private usersService: UsersService,
    private researchesService: ResearchesService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.userRole = this.loggedIn.role;
    this.getUserData();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.editUserForm.controls;
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editUserForm.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append("image", this.image);
    formData.append("data", JSON.stringify(this.editUserForm.value));
    this.loading = true;
    this.usersService.update(this.user._id, formData).subscribe(
      (data) => {
        this.loading = false;
        this.editModal.close();
        this.getUserData();
      },
      (error) => {
        this.error = error;
        this.loading = false;
      }
    );
  }
  getUserData() {
    this.loading = true;
    this.usersService.getUser(this.loggedIn.id).subscribe(
      (res) => {
        this.user = res.body;
        this.editUserForm = this._formBuilder.group({
          firstName: [this.user.firstName, [Validators.required]],
          lastName: [this.user.lastName, [Validators.required]],
          email: [this.user.email, [Validators.required, Validators.email]],
          mobile: [this.user.mobile, Validators.required],
          title: [this.user.title, Validators.required],
        });
        this.selfProfile = this.user._id === this.loggedIn.id;
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.error = error;
        this.loading = false;
      }
    );
  }
  // modal Open Primary
  modalOpenPrimary(modalPrimary) {
    this.editModal = this.modalService.open(modalPrimary, {
      centered: true,
      windowClass: "modal modal-primary",
    });
  }
  onChooseImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
    }
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  showResearchDetails(selectedResearch) {
    this.getSelectedResearch(selectedResearch.id._id);
  }
  getSelectedResearch(id) {
    this.loading = true;
    this.researchesService.getSingleResearch(id).subscribe(
      (res) => {
        localStorage.setItem("researchDetails", JSON.stringify(res));
        this.router.navigate(["researchDetails"]);
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.error = error;
        this.loading = false;
      }
    );
  }
  deleteResearch(data) {
    this.loading = true;
    this.usersService.deleteResearch(this.user._id, data.id._id).subscribe(
      (result) => {
        this.loading = false;
        this.getUserData();
        // this.toastService.show("Data has been deleted successfully", {
        //   delay: 4000,
        // });
      },
      (error) => {
        console.log(error);
        this.error = error;
        this.loading = false;
      }
    );
  }
}
