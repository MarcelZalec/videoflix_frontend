import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  /**
 * Optional input property to specify the page identifier.
 * This can be used to adjust component behavior or display based on the provided value.
 */
  @Input() page = ''
}
