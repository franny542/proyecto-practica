import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './configuracion.html',
  styleUrls: ['./configuracion.css']
})
export class ConfiguracionComponent implements OnInit {
  usuarios: any[] = [];
  mensaje: string = '';
  
  permitido = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    const rol = this.authService.getUserRole()?.toLowerCase().trim();
    
    if (rol === 'admin') {
      this.permitido = true;
      this.cargarUsuarios(); 
    }
    this.cdr.detectChanges();
  }

  cargarUsuarios(): void {
    this.authService.getUsuarios().subscribe({
      next: (data: any[]) => {
        this.usuarios = data;
        this.mensaje = '';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar usuarios desde el Backend:', err);
        this.mensaje = 'Error: No se pudo conectar con el servidor para listar los usuarios.';
        this.cdr.detectChanges();
      }
    });
  }

  cambiarRango(usuario: any): void {
    const rolOriginal = usuario.rol;
    
    usuario.rol = rolOriginal === 'admin' ? 'usuario' : 'admin';
    this.cdr.detectChanges(); 

    this.authService.cambiarRolUsuario(usuario.id, usuario.rol).subscribe({
      next: (response: any) => {
        this.mensaje = `¡Éxito! El usuario con el correo ${usuario.correo} ahora es: ${usuario.rol.toUpperCase()}.`;
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.mensaje = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err: any) => {
        console.error('Error al actualizar el rol en C#:', err);
        usuario.rol = rolOriginal;
        this.mensaje = 'Hubo un error en el servidor. No se pudo guardar el cambio.';
        this.cdr.detectChanges();
      }
    });
  }
}