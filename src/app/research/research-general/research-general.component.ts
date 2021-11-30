import { ToastService } from "./../../main/components/toasts/toasts.service";
import { UsersService } from "./../../services/users.service";
import { ResearchesService } from "./../../services/researches.service";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-research-general",
  templateUrl: "./research-general.component.html",
  styleUrls: ["./research-general.component.scss"],
})
export class ResearchGeneralComponent implements OnInit {
  @Input() data: any;
  public loading = false;
  public error = "";
  currentUser: any;
  userRole: string;
  investigatorRole: string;
  select: string;
  loggedIn = JSON.parse(localStorage.getItem("currentUser"));
  investigator: any;
  participated: boolean;
  public toastStyle: object = {};
  constructor(
    private researchesService: ResearchesService,
    private toastService: ToastService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.userRole = this.loggedIn.role;
    this.loadService();
  }

  async participateInResearch() {
    this.loading = true;
    this.data.investigators.push(this.loggedIn.id);
    this.researchesService
      .UpdateResearchesData(this.data, this.data._id)
      .subscribe(
        (result) => {
          this.userService
            .participate(
              { id: this.data._id, parameters: {} },
              this.loggedIn.id
            )
            .subscribe(
              (result2) => {
                this.loading = false;
                this.loadService();
                this.toastService.show("You have participated successfully");
                this.toastStyle = { left: 0, right: "unset" };
              },
              (error) => {
                console.log(error);
                this.error = error;
                this.loading = false;
              }
            );
        },
        (error) => {
          console.log(error);
          this.error = error;
          this.loading = false;
        }
      );
  }
  loadService() {
    this.select = "";
    this.participated = false;
    this.data.progress =
      this.data.status === "NEW"
        ? 0
        : this.data.status === "IN PROGRESS"
        ? 50
        : 100;
    for (const investigator of this.data.investigators) {
      if (investigator === this.loggedIn.id) {
        this.participated = true;
        this.getUserInvestigator(this.data._id, this.loggedIn.id).subscribe(
          (res) => {
            this.investigator = res.body;
            this.investigatorRole = this.investigator.roles[0];
          },
          (error) => {
            console.log(error);
            this.error = error;
          }
        );
      }
    }
  }
  getUserInvestigator(researchId: string, userId: string) {
    return this.userService.getUserResearch(userId, researchId);
  }
}
