import { UsersService } from "./../../services/users.service";
import { ResearchesService } from "./../../services/researches.service";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-research-parameters",
  templateUrl: "./research-parameters.component.html",
  styleUrls: ["./research-parameters.component.scss"],
})
export class ResearchParametersComponent implements OnInit {
  @Input() data: any;
  edit: boolean;
  value: number;
  loading1: boolean;
  commonParameters: object;
  userResearch: object;
  loggedIn = JSON.parse(localStorage.getItem("currentUser"));
  public loading = false;
  public error = "";
  constructor(
    private researchesService: ResearchesService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.loadService();
  }

  loadService() {
    this.edit = false;
    this.loading = true;
    this.loading1 = true;
    this.userResearch = {};
    this.loading = true;
    this.getCommonParameters(this.data._id).subscribe(
      (result: any) => {
        this.commonParameters = result.commonParameters;
        this.loading = true;
        this.getUserParameters(this.data._id).subscribe(
          (res) => {
            this.userResearch = res.body;
            this.loading = false;
            this.resetParameters();
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

  exit() {
    this.edit = false;
    this.loadService();
  }

  resetParameters(): void {
    for (const key in this.commonParameters) {
      if (key === "submission" || key === "irb") continue;

      this.commonParameters[key] += this.userResearch["parameters"][key];
    }
    if (this.userResearch["parameters"]["submission"])
      this.commonParameters["submission"] = 0;
    if (this.userResearch["parameters"]["irb"])
      this.commonParameters["irb"] = 0;
  }

  parseParameters(): void {
    for (const key in this.commonParameters) {
      if (key === "submission" || key === "irb") continue;
      this.commonParameters[key] -= this.userResearch["parameters"][key];
    }
    this.commonParameters["submission"] |=
      this.userResearch["parameters"]["submission"];
    this.commonParameters["irb"] |= this.userResearch["parameters"]["irb"];
  }

  submit(status: string): void {
    this.loading = true;
    this.edit = false;
    this.parseParameters();
    this.userResearch["parameters"].status = status;
    this.updateUserParameters(this.loggedIn.id, this.userResearch).subscribe(
      (res) => {
        this.updateCommonParameters(this.data._id, {
          commonParameters: this.commonParameters,
        }).subscribe(
          (result) => {
            this.calcRank(this.data._id, this.loggedIn.id).subscribe(
              (result2) => {
                this.loadService();
                this.loading = false;
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
      },
      (error) => {
        this.error = error;
      }
    );
  }

  check(element: string) {
    if (this.edit) {
      if (element !== "irb" && element !== "submission") {
        this.userResearch["parameters"][element] =
          !this.userResearch["parameters"][element];
      } else if (element === "irb" && !this.commonParameters["irb"]) {
        this.userResearch["parameters"][element] =
          !this.userResearch["parameters"][element];
      } else if (
        element === "submission" &&
        !this.commonParameters["submission"]
      ) {
        this.userResearch["parameters"][element] =
          !this.userResearch["parameters"][element];
      }
    }

    // element = !element;
  }

  calcRank(researchId: string, userId: string) {
    return this.researchesService.calcRank(researchId, userId);
  }

  updateCommonParameters(researchId: string, data: object) {
    return this.researchesService.UpdateResearchesData(data, researchId);
  }

  updateUserParameters(id: string, data: object) {
    return this.userService.updateParameters(id, data);
  }

  getCommonParameters(researchId: string) {
    return this.researchesService.getSingleResearchCommonParameters(researchId);
  }

  getUserParameters(researchId: string) {
    return this.userService.getUserParameters(researchId);
  }
}
