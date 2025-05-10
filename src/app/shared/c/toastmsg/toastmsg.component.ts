import { Component } from '@angular/core';
import { LittleHelpersService, ToastMessage } from '../../services/little-helpers.service';

@Component({
  selector: 'app-toastmsg',
  imports: [],
  templateUrl: './toastmsg.component.html',
  styleUrl: './toastmsg.component.scss'
})
export class ToastmsgComponent {
  toastMessage: ToastMessage | null = null;

  constructor(
    private lh: LittleHelpersService,
  ) {}

  get errmsg() {
    return this.lh.toastSignal();
  }
}
