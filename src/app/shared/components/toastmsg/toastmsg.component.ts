import { Component } from '@angular/core';
import { LittleHelpersService, ToastMessage } from '../../services/little-helpers.service';

@Component({
  selector: 'app-toastmsg',
  imports: [],
  templateUrl: './toastmsg.component.html',
  styleUrl: './toastmsg.component.scss'
})
export class ToastmsgComponent {
  /**
   * Holds the current toast message object to be displayed.
   */
  toastMessage: ToastMessage | null = null;

  /**
   * Injects the helper service used for managing toast signals.
   *
   * @param {LittleHelpersService} lh - UI helper service for toast messaging.
   */
  constructor(
    private lh: LittleHelpersService,
  ) {}

  /**
   * Getter for observing toast signal messages.
   * 
   * @returns {Observable<string>} - Stream of current toast messages.
   */
  get errmsg() {
    return this.lh.toastSignal();
  }

  /**
   * Clears the current toast message.
   */
  close() {
    this.lh.toastSignal.set('');
  }
}
