import { HistoryService } from "./../../../services/history.service";
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
} from "@angular/core";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CalendarOptions, EventClickArg } from "@fullcalendar/angular";

import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreConfigService } from "@core/services/config.service";

import { CalendarService } from "app/main/apps/calendar/calendar.service";
import { EventRef } from "app/main/apps/calendar/calendar.model";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit, AfterViewInit {
  // Public
  public allHistories = [];
  public slideoutShow = false;
  public events = [];
  public event;
  public loading = false;
  public error = "";

  public calendarOptions: CalendarOptions = {
    headerToolbar: {
      start: "sidebarToggle, prev,next, title",
      end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
    },
    initialView: "dayGridMonth",
    initialEvents: this.events,
    weekends: true,
    editable: true,
    eventResizableFromStart: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: 2,
    navLinks: true,
    eventClick: this.handleUpdateEventClick.bind(this),
    eventClassNames: this.eventClass.bind(this),
    select: this.handleDateSelect.bind(this),
  };

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param {CalendarService} _calendarService
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _calendarService: CalendarService,
    private _coreConfigService: CoreConfigService,
    private historyService: HistoryService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Add Event Class
   *
   * @param s
   */
  eventClass(s) {
    const calendarsColor = {
      Business: "primary",
      Holiday: "success",
      Personal: "danger",
      Family: "warning",
      ETC: "info",
    };

    const colorName = calendarsColor[s.event._def.extendedProps.calendar];
    return `bg-light-${colorName}`;
  }

  /**
   * Update Event
   *
   * @param eventRef
   */
  handleUpdateEventClick(eventRef: EventClickArg) {
    this._coreSidebarService
      .getSidebarRegistry("calendar-event-sidebar")
      .toggleOpen();
    this._calendarService.updateCurrentEvent(eventRef);
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
   * Date select Event
   *
   * @param eventRef
   */
  handleDateSelect(eventRef) {
    const newEvent = new EventRef();
    newEvent.start = eventRef.start;
    this._coreSidebarService
      .getSidebarRegistry("calendar-event-sidebar")
      .toggleOpen();
    this._calendarService.onCurrentEventChange.next(newEvent);
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
    //     // ! If we have zoomIn route Transition then load calendar after 450ms(Transition will finish in 400ms)
    //     if (config.layout.animation === "zoomIn") {
    //       setTimeout(() => {
    //         // Subscribe to Event Change
    //         this._calendarService.onEventChange.subscribe((res) => {
    //           console.log("aaa", res);

    //           this.events = res;
    //           this.calendarOptions.events = res;
    //         });
    //       }, 450);
    //     } else {
    //       // Subscribe to Event Change
    //       this._calendarService.onEventChange.subscribe((res) => {
    //         console.log("www", res);

    //         this.events = res;
    //         this.calendarOptions.events = res;
    //       });
    //     }
    //   });

    // this._calendarService.onCurrentEventChange.subscribe((res) => {
    //   this.event = res;
    // });
    this.getAllHistories();
  }

  /**
   * Calendar's custom button on click toggle sidebar
   */
  ngAfterViewInit() {
    // Store this to _this as we need it on click event to call toggleSidebar
    let _this = this;
    this.calendarOptions.customButtons = {
      sidebarToggle: {
        text: "",
        click() {
          _this.toggleSidebar("calendar-main-sidebar");
        },
      },
    };
  }
  getAllHistories(): any {
    this.loading = true;
    this.historyService.getAllHistories().subscribe(
      (result) => {
        // this.allHistories = result;
        for (const element of result) {
          const obj = {
            allDay: true,
            end: element.created_at,
            id: element._id,
            start: element.created_at,
            title: element.record,
          };
          this.allHistories.push(obj);
        }
        this.calendarOptions.events = this.allHistories;
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
