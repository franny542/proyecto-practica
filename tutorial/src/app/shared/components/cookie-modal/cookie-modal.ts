import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cookie-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cookie-modal.html',
  styleUrl: './cookie-modal.css'
})
export class CookieModal {

  @Output() close = new EventEmitter<void>();

  analytics = false;
  functional = false;
  commercial = false;
  marketing = false;

  goBack() {
    this.close.emit();
  }

  savePreferences() {
    localStorage.setItem('analytics', this.analytics.toString());
    localStorage.setItem('functional', this.functional.toString());
    localStorage.setItem('commercial', this.commercial.toString());
    localStorage.setItem('marketing', this.marketing.toString());
    localStorage.setItem('cookiesAccepted', 'true');

    this.close.emit();
  }
}