import { UsersService } from "./../services/users.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit {
  public allUsers = [];
  public loading = false;
  public error = "";
  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }
  getAllUsers(): any {
    this.loading = true;
    this.userService.getAllUsers().subscribe(
      (result) => {
        console.log(result);

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
}
