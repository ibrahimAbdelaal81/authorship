import { ColumnMode } from "@swimlane/ngx-datatable";
import { UsersService } from "./../../services/users.service";
import { ToastService } from "app/main/components/toasts/toasts.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ResearchesService } from "../../services/researches.service";
import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-research-investigators",
  templateUrl: "./research-investigators.component.html",
  styleUrls: ["./research-investigators.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ResearchInvestigatorsComponent implements OnInit {
  public allInvestigators: any = [];
  public loading = false;
  public error = "";
  public selectOptions = ["Approved", "Pending", "Declined"];
  public rolesOptions = [
    { label: "Principal Investigator", value: "admin" },
    { label: "Investigator", value: "investigator" },
  ];
  public toastStyle: object = {};
  selectStatus = "";
  selectCanShowResult = "";
  selectedRole = "";
  selectedItems;
  editModal;
  updateParameterModal;
  @Input() data: any;
  userRole: string;
  loggedIn = JSON.parse(localStorage.getItem("currentUser"));
  selectedElement;
  public ColumnMode = ColumnMode;
  constructor(
    private researchesService: ResearchesService,
    private usersService: UsersService,
    public toastService: ToastService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getResearchInvestigators();
    this.userRole = this.loggedIn.role;
  }
  getResearchInvestigators(): any {
    this.loading = true;
    this.researchesService
      .getSingleResearchInvestigators(this.data._id)
      .subscribe(
        (result) => {
          this.allInvestigators = result;
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
  modalOpenForm(modalForm, items) {
    this.selectedItems = items;
    this.selectStatus = items.researches.status;
    this.selectCanShowResult = items.researches.canShowResult;
    this.selectedRole = items.researches.roles[0];
    this.editModal = this.modalService.open(modalForm);
  }
  updateParameters(modalLG, element: object) {
    this.selectedElement = { investigator: element, research: this.data };
    this.updateParameterModal = this.modalService.open(modalLG, {
      centered: true,
      size: "lg",
    });
  }

  edit() {
    this.loading = true;
    this.selectedItems.researches.status = this.selectStatus;
    this.selectedItems.researches.canShowResult = this.selectCanShowResult;
    this.selectedItems.researches.roles[0] = this.selectedRole;
    this.usersService
      .updateInvestigator(this.selectedItems._id, this.selectedItems)
      .subscribe(
        (result) => {
          this.loading = false;
          this.editModal.close();
        },
        (error) => {
          console.log(error);
          this.error = error;
          this.loading = false;
        }
      );
  }
  delete(item) {
    this.loading = true;
    this.researchesService
      .deleteInvestigator(this.data._id, item._id)
      .subscribe(
        (result) => {
          this.loading = false;
          this.getResearchInvestigators();
          this.toastService.show("Data has been deleted successfully", {
            delay: 4000,
          });
        },
        (error) => {
          console.log(error);
          this.error = error;
          this.loading = false;
        }
      );
  }
}
