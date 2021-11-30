import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'app/auth/service';

@Component({
  selector: 'app-investigator-thumbnail',
  templateUrl: './investigator-thumbnail.component.html',
  styleUrls: ['./investigator-thumbnail.component.scss']
})
export class InvestigatorThumbnailComponent implements OnInit {

  constructor(private userService: UserService) { }
  @Input() data: string;
  public investigator: any;

  load(): void {
    this.userService.getByUniqueId(this.data).subscribe(user => {
      this.investigator = {
        name: user.firstName + " " + user.lastName,
        thumbnail: user["image"]
      };
    }, error => {
      console.log(error);
      this.investigator = {
        name: 'Unknown',
        thumbnail: null
      }
    });
  }

  ngOnInit(): void {
    console.log("data in onInit: " + this.data);
    this.load();
  }
  ngAfterViewInit() : void{
    console.log("data in afterViewInit: " + this.data)
  }


}
