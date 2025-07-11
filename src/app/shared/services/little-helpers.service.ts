import { Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

export interface ToastMessage {
  error: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class LittleHelpersService {
  /** Default input type for password fields. */
  inputType: string = 'password';

  /** Default icon source for visibility toggle. */
  src: string = 'svgs/visibility.svg';

  /** Collection of password field configurations with input types and icons. */
  passwordFields = [
    { id: 'passwordField1', inputType: 'password', src: 'svgs/visibility.svg' },
    { id: 'passwordField2', inputType: 'password', src: 'svgs/visibility.svg' }
  ];
  private toastSubject = new Subject<ToastMessage>();
  toast$ = this.toastSubject.asObservable();
  toastSignal = signal<string>('');
  screenWidth!:number;

  /**
   * Toggles the visibility of a password field at the specified index.
   * Changes the input type and updates the corresponding icon.
   * @param index Index of the password field to toggle.
   */
  changeVisibility(index:number) {
    const field = this.passwordFields[index];
    if (field.inputType === 'password') {
      field.inputType = 'text';
      field.src = 'svgs/visibility_off.svg'; // Sichtbar-Icon
    } else {
      field.inputType = 'password';
      field.src = 'svgs/visibility.svg'; // Unsichtbar-Icon
    }
  }

  /**
   * Clears and resets all values and validation states of a given form.
   * @param form The FormGroup to be reset.
   */
  clearForm(form:FormGroup) {
    form.reset()
  }

  /**
   * Triggers a toast notification using RxJS stream with a message and error flag.
   * @param error Boolean indicating whether the toast is an error.
   * @param message Text content of the toast.
   */
  showToast(error: boolean, message: string) {
    this.toastSubject.next({ error, message });
  }

  /**
   * Displays a temporary toast-like message using a reactive signal.
   * Automatically resets the message after a short delay.
   * @param message Message text to show in the toast.
   */
  showToastSignal(message: string) {
    this.toastSignal.set(message);
    setTimeout(() => {
      this.toastSignal.set('');
    }, 2500);
  }

  /**
   * Retrieves the current screen width of the user's device.
   * @returns The screen width in pixels.
   */
  checkScreenWith() {
    return screen.width
  }
}