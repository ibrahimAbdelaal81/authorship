import { ResearchesService } from "./../../services/researches.service";
import { UsersService } from "./../../services/users.service";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-research-details",
  templateUrl: "./research-details.component.html",
  styleUrls: ["./research-details.component.scss"],
})
export class ResearchDetailsComponent implements OnInit {
  // public

  public contentHeader: object;
  public data: any;
  public loading = false;
  public error = "";
  userRole: string;
  investigatorRole: string;
  select: string;
  research: any;
  investigator: any;
  loggedIn = JSON.parse(localStorage.getItem("currentUser"));
  researchDetails = JSON.parse(localStorage.getItem("researchDetails"));

  // private
  private _unsubscribeAll: Subject<any>;
  /**
   * Constructor
   *
   */
  constructor(private router: Router, private httpUserService: UsersService) {
    this._unsubscribeAll = new Subject();
  }
  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: "Researches",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Researches",
            isLink: true,
            link: "/",
          },
          {
            name: "Details",
            isLink: false,
          },
        ],
      },
    };
    this.userRole = this.loggedIn.role;
    this.loadService();
  }
  loadService() {
    this.select = "";
    this.loading = true;
    this.researchDetails.progress =
      this.researchDetails.status === "NEW"
        ? 0
        : this.researchDetails.status === "IN PROGRESS"
        ? 50
        : 100;
    for (const investigator of this.researchDetails.investigators) {
      if (investigator === this.loggedIn.id) {
        this.getUserInvestigator(
          this.researchDetails._id,
          this.loggedIn.id
        ).subscribe(
          (res) => {
            this.investigator = res.body;
            this.investigatorRole = this.investigator.roles[0];
            this.loading = false;
          },
          (error) => {
            console.log(error);
            this.error = error;
            this.loading = false;
          }
        );
      }
    }
  }
  getUserInvestigator(researchId: string, userId: string) {
    return this.httpUserService.getUserResearch(userId, researchId);
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
