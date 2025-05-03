import { Injectable } from '@angular/core';

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
}