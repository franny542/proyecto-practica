import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from '../../services/cookie.service';
import { Policy } from '../../models/policy';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './policies.html',
  styleUrl: './policies.css' 
})
export class PoliciesComponent implements OnInit {

  policies: Policy[] = [];
  isLoading = false;

  constructor(
    private cookieService: CookieService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.isLoading = true; 
    
    this.cookieService
      .getPolicies()
      .subscribe({
        next: (data: Policy[]) => {
          this.policies = data;
          this.isLoading = false; 
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          console.error('Error al conectar con la API de políticas:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  trackByPolicy(index: number, policy: Policy): number {
    return policy.id;
  }
}