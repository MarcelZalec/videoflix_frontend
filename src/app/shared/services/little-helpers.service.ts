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
  inputType: string = 'password';
  src: string = 'svgs/visibility.svg';
  passwordFields = [
    { id: 'passwordField1', inputType: 'password', src: 'svgs/visibility.svg' },
    { id: 'passwordField2', inputType: 'password', src: 'svgs/visibility.svg' }
  ];
  private toastSubject = new Subject<ToastMessage>();
  toast$ = this.toastSubject.asObservable();
  toastSignal = signal<string>('');

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

  clearForm(form:FormGroup) {
    form.reset()
  }

  showToast(error: boolean, message: string) {
    this.toastSubject.next({ error, message });
  }

  showToastSignal(message: string) {
    this.toastSignal.set(message);
    setTimeout(() => {
      this.toastSignal.set('');
    }, 2500);
  }
}