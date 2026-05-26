import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieModal } from '../cookie-modal/cookie-modal';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [
    CommonModule,
    CookieModal,
    RouterModule
  ],
  templateUrl: './cookie-banner.html',
  styleUrl: './cookie-banner.css'
})
export class CookieBanner {

  showModal = false;

  get cookiesAccepted(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cookiesAccepted') === 'true';
    }
    return false;
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.setItem('analytics', 'true');
    localStorage.setItem('functional', 'true');
    localStorage.setItem('commercial', 'true');
    localStorage.setItem('marketing', 'true');
  }

  rejectCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.setItem('analytics', 'false');
    localStorage.setItem('functional', 'false');
    localStorage.setItem('commercial', 'false');
    localStorage.setItem('marketing', 'false');
  }
}