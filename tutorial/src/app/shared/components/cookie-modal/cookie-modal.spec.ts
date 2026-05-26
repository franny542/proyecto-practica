import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cookie-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cookie-modal.html',
  styleUrl: './cookie-modal.css'
})
export class CookieModalComponent {

  @Output() close = new EventEmitter<void>();

  analytics = false;
  functional = false;
  commercial = false;
  marketing = false;

  savePreferences() {

    const preferences = {
      analytics: this.analytics,
      functional: this.functional,
      commercial: this.commercial,
      marketing: this.marketing
    };

    localStorage.setItem(
      'cookiePreferences',
      JSON.stringify(preferences)
    );

    this.close.emit();
  }

}