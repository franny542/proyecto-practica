import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router'; 
import { isPlatformBrowser } from '@angular/common'; 
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }
    
    const token = this.authService.getToken();
    const rawRol = this.authService.getUserRole() || '';
    const rol = rawRol.toLowerCase().trim();

    if (!token) {
      alert('Acceso Restringido: Esta sección requiere autenticación previa.');
      this.router.navigate(['/']); 
      return false;
    }

    if (route.data && route.data['roles']) {
      const rolesPermitidos = route.data['roles'] as Array<string>;
      const rolesLimpios = rolesPermitidos.map(r => r.toLowerCase().trim());

      if (rolesLimpios.includes(rol)) {
        return true;
      }

      if (rol === 'admin') {
        alert('Acceso Denegado: Su rol de Administrador no cuenta con los privilegios requeridos para auditar el módulo de Últimas Conexiones.');
        this.router.navigate(['/']); 
        return false;
      }

      alert('Acceso Denegado: No tienes los permisos necesarios para ver esta página.');
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}