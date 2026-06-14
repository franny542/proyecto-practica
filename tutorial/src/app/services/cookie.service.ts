import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Policy } from '../models/policy';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  private apiUrl = 'https://api-rukano-f0hafjcjd8dufqck.westus3-01.azurewebsites.net/api/policies';

  constructor(private http: HttpClient) {}

  getPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(this.apiUrl);
  }

  createPolicy(policy: Policy): Observable<Policy> {
    return this.http.post<Policy>(this.apiUrl, policy);
  }

  updatePolicy(policy: Policy): Observable<Policy> {
    return this.http.put<Policy>(`${this.apiUrl}/${policy.id}`, policy);
  }

  deletePolicy(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /* ==========================================
     MÉTODOS DE PREFERENCIAS (LOCAL STORAGE)
     ========================================== */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  savePreferences(preferences: { analytics: boolean; functional: boolean; commercial: boolean; marketing: boolean }) {
    if (this.isBrowser()) {
      localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
      localStorage.setItem('cookiesAccepted', 'true');
    }
  }

  getPreferences() {
    if (this.isBrowser()) {
      const data = localStorage.getItem('cookiePreferences');
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  hasPreferences(): boolean {
    if (this.isBrowser()) {
      return localStorage.getItem('cookiesAccepted') === 'true';
    }
    return false;
  }

  setAllPreferences(value: boolean) {
    const preferences = {
      analytics: value,
      functional: value,
      commercial: value,
      marketing: value
    };
    this.savePreferences(preferences);
  }

  clearPreferences() {
    if (this.isBrowser()) {
      localStorage.removeItem('cookiePreferences');
      localStorage.removeItem('cookiesAccepted');
    }
  }
}