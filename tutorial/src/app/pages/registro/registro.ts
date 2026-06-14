import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      rol: ['usuario', [Validators.required]] 
    }, { validators: this.passwordMatchValidator }); 
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const datosParaEnviar = {
        correo: this.registerForm.value.correo,
        password: this.registerForm.value.password,
        rol: this.registerForm.value.rol
      };

      this.authService.registrarUsuario(datosParaEnviar).subscribe({
        next: (response) => {
          alert('¡Usuario guardado con éxito!');
          this.router.navigate(['/login']); 
        },
        error: (err) => {
          console.error('Error en el registro:', err);
          alert(err.error?.message || 'Hubo un error al registrar el usuario. Revisa si el backend está encendido.');
        }
      });
    }
  }
}