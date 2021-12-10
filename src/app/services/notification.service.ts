import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  iconClasses = {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  };

  success(message: string, title: string = ''): void {
    this.toastr.success(`${message}`, `${title}`, {
      timeOut: 8000,
      closeButton: true,
      enableHtml: true,
      positionClass: 'toast-' + 'top' + '-' + 'right',
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }

  error(message: string, title: string = ''): void {
    this.toastr.error(`${message}`, `${title}`, {
      timeOut: 8000,
      closeButton: true,
      enableHtml: true,
      positionClass: 'toast-' + 'top' + '-' + `right`,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }

  warning(message: string, title: string = ''): void {
    this.toastr.warning(`${message}`, `${title}`, {
      timeOut: 8000,
      closeButton: true,
      enableHtml: true,
      positionClass: 'toast-' + 'top' + '-' + `right`,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }

  info(message: string, title: string = ''): void {
    this.toastr.info(`${message}`, `${title}`, {
      timeOut: 8000,
      closeButton: true,
      enableHtml: true,
      positionClass: 'toast-' + 'top' + '-' + `right`,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }
}
