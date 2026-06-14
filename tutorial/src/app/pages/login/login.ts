import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
}) 
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {} 

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
      if (this.loginForm.valid) {
        const { correo, password } = this.loginForm.value;
        
        this.authService.login(correo, password).subscribe({
          next: (response: any) => {
            console.log('Login exitoso', response);

            // 🟢 PASO 1: Guardamos el Token real en el LocalStorage de inmediato
            if (response && response.token) {
              localStorage.setItem('token', response.token);
              
              // 🟢 PASO 2: Guardamos el rol en texto plano para asegurar que el Guard lo lea a la primera
              // (Se adapta si tu backend responde 'rol' o 'role')
              const rolBackend = response.rol || response.role || 'usuario';
              localStorage.setItem('rol', rolBackend);
            }

            alert('¡Inicio de sesión exitoso!');

            // 🟢 PASO 3: Ahora sí le preguntamos el rol al servicio con los datos ya guardados
            const rol = this.authService.getUserRole() || localStorage.getItem('rol');
            console.log('Rol detectado con éxito:', rol);

            // 🟢 PASO 4: Redirección inteligente según privilegios
            if (rol === 'admin') {
              this.router.navigate(['/configuracion']); // Te mandamos directo a tu panel de administración
            } else {
              this.router.navigate(['/ultimas-conexiones']); // Al usuario regular lo mandamos a ver sus conexiones
            }
          },
          error: (err: any) => {
            console.error('Error en login:', err);
            alert(err.error?.message || 'Credenciales incorrectas o error en el servidor');
          }
        });
      }
    }
}