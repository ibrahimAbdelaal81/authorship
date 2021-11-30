import { HistoryService } from "./../services/history.service";
import { Component, OnInit } from "@angular/core";
import * as snippet from "app/main/components/timeline/timeline.snippetcode";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"],
})
export class HistoryComponent implements OnInit {
  // public
  public contentHeader: object;
  public showReportBasic = true;
  public showReportIcons = true;

  // snippet code variables
  public _snippetCodeBasic = snippet.snippetCodeBasic;
  public _snippetCodeIcons = snippet.snippetCodeIcons;

  public loading: boolean;
  public allHistoryItems: any[];
  public error: any;

  constructor(private historyService: HistoryService) {}

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // content header
    this.contentHeader = {
      headerTitle: "Timeline",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: "/",
          },
          {
            name: "Components",
            isLink: true,
            link: "/",
          },
          {
            name: "Timeline",
            isLink: false,
          },
        ],
      },
    };
    this.getAllHistories();
  }

  getAllHistories(): any {
    this.loading = true;
    this.allHistoryItems = [];
    this.historyService.getAllHistories().subscribe(
      (result) => {
        // this.allHistoryItems = result;
        for (const element of result) {
          const historyStatementSplit = element.record
            .replace("updated Research", ",")
            .replace("created Research", ",")
            .replace("added Research", ",")
            .split(",");
          const obj = {
            id: element._id,
            created_at: element.created_at,
            record: element.record,
            userName: historyStatementSplit[0],
            testName: historyStatementSplit[1],
          };
          this.allHistoryItems.push(obj);
        }
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
