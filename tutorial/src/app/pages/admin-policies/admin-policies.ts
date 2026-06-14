import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from '../../services/cookie.service';
import { AuthService } from '../../services/auth.service'; // 🟢 Importamos el AuthService
import { Policy } from '../../models/policy'; 

@Component({
  selector: 'app-admin-policies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-policies.html',
  styleUrl: './admin-policies.css'
})
export class AdminPolicies implements OnInit {

  policies: Policy[] = [];

  policy: Policy = {
    id: 0,
    title: '',
    description: ''
  };

  isEditing = false;
  message = '';
  isLoading = false; 
  
  // 🔒 Estructura idéntica a ultimas-conexiones
  permitido = false;

  constructor(
    private cookieService: CookieService,
    private authService: AuthService, // 🟢 Inyectamos el AuthService
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    // 🌟 Validamos el rol antes de hacer cualquier cosa
    const rol = this.authService.getUserRole()?.toLowerCase().trim();
    
    if (rol === 'admin') {
      this.permitido = true;
      this.loadPolicies(); // 🔓 Solo carga si está permitido
    }
    this.cdr.detectChanges();
  }

  loadPolicies() {
    this.isLoading = true; 
    
    this.cookieService.getPolicies().subscribe({
      next: (data: Policy[]) => { 
        this.policies = data;
        this.isLoading = false; 
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al cargar políticas:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  savePolicy() {
    this.isLoading = true; 

    if(this.isEditing){
      this.cookieService.updatePolicy(this.policy).subscribe({
        next: () => {
          const index = this.policies.findIndex(
            p => p.id === this.policy.id
          );

          if(index !== -1){
            this.policies[index] = { ...this.policy };
          }

          this.message = 'Política actualizada correctamente';
          this.resetForm();
          this.isLoading = false; 
          this.cdr.detectChanges(); 

          setTimeout(() => {
            this.message = '';
            this.cdr.detectChanges(); 
          }, 3000);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.cookieService.createPolicy(this.policy).subscribe({
        next: (res: Policy) => {
          this.policies.push(res);

          this.message = 'Política creada correctamente';
          this.resetForm();
          this.isLoading = false; 
          this.cdr.detectChanges(); 

          setTimeout(() => {
            this.message = '';
            this.cdr.detectChanges(); 
          }, 3000);
        },
        error: (err) => {
          console.error('Error al crear:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  editPolicy(policy: Policy) {
    this.policy = { ...policy };
    this.isEditing = true;
  }

  deletePolicy(id: number) {
    if(confirm('¿Eliminar política?')){
      this.isLoading = true; 

      this.cookieService.deletePolicy(id).subscribe({
        next: () => {
          this.policies = this.policies.filter(
            p => p.id !== id
          );

          this.message = 'Política eliminada correctamente';
          this.isLoading = false; 
          this.cdr.detectChanges(); 

          setTimeout(() => {
            this.message = '';
            this.cdr.detectChanges(); 
          }, 3000);
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  resetForm() {
    this.policy = {
      id: 0,
      title: '',
      description: ''
    };
    this.isEditing = false;
  }

  trackByPolicy(index: number, policy: Policy): number {
    return policy.id;
  }
}