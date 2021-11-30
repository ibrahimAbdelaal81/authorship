import { ResearchesService } from "./../../services/researches.service";
import { UsersService } from "./../../services/users.service";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-investigator-parameters",
  templateUrl: "./investigator-parameters.component.html",
  styleUrls: ["./investigator-parameters.component.scss"],
})
export class InvestigatorParametersComponent implements OnInit {
  edit: boolean;
  investigator: any;
  research: any;
  @Input() data: any;
  public loading = false;
  public error = "";
  constructor(
    private httpUserService: UsersService,
    private httpResearchesService: ResearchesService
  ) {}

  ngOnInit() {
    this.edit = false;
    this.investigator = this.data.investigator;
    this.research = this.data.research;
    this.resetParameters();
  }

  submit() {
    this.loading = true;
    this.investigator.researches.parameters.status = "Validate";
    this.edit = false;
    this.parseParameters();
    this.updateUserParameters(
      this.investigator._id,
      this.investigator.researches
    ).subscribe(
      (res) => {
        this.updateCommonParameters(this.research._id, {
          commonParameters: this.research.commonParameters,
        }).subscribe(
          (res) => {
            this.calcRank(this.research._id, this.investigator._id).subscribe(
              (res) => {
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
        console.log(error);
        this.error = error;
        this.loading = false;
      }
    );
  }

  check(element: string) {
    if (this.edit) {
      if (element !== "irb" && element !== "submission") {
        this.investigator.researches["parameters"][element] =
          !this.investigator.researches["parameters"][element];
      } else if (element === "irb" && !this.research.commonParameters["irb"]) {
        this.investigator.researches["parameters"][element] =
          !this.investigator.researches["parameters"][element];
      } else if (
        element === "submission" &&
        !this.research.commonParameters["submission"]
      ) {
        this.investigator.researches["parameters"][element] =
          !this.investigator.researches["parameters"][element];
      }
    }
  }

  resetParameters(): void {
    for (const key in this.research.commonParameters) {
      if (key === "submission" || key === "irb") continue;

      this.research.commonParameters[key] +=
        this.investigator.researches["parameters"][key];
    }
    if (this.investigator.researches["parameters"]["submission"])
      this.research.commonParameters["submission"] = 0;
    if (this.investigator.researches["parameters"]["irb"])
      this.research.commonParameters["irb"] = 0;
  }

  parseParameters(): void {
    for (const key in this.research.commonParameters) {
      if (key === "submission" || key === "irb") continue;
      this.research.commonParameters[key] -=
        this.investigator.researches["parameters"][key];
    }
    this.research.commonParameters["submission"] |=
      this.investigator.researches["parameters"]["submission"];
    this.research.commonParameters["irb"] |=
      this.investigator.researches["parameters"]["irb"];
  }

  updateUserParameters(id: string, data: object) {
    return this.httpUserService.updateParameters(id, data);
  }

  updateCommonParameters(researchId: string, data: object) {
    return this.httpResearchesService.UpdateResearchesData(data, researchId);
  }

  calcRank(researchId: string, userId: string) {
    return this.httpResearchesService.calcRank(researchId, userId);
  }
  exit() {}
}
