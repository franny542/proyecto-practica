import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core'; 
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-ultimas-conexiones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ultimas-conexiones.html',
  styleUrls: ['./ultimas-conexiones.css']
})
export class UltimasConexionesComponent implements OnInit {
  logs: any[] = [];
  cargando: boolean = true;
  permitido: boolean = false; // 🔒 Mantiene la pantalla invisible por defecto

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // 🟢 Nos aseguramos de actuar SOLO cuando el código llegue al navegador de tu Mac
    if (isPlatformBrowser(this.platformId)) {
      const token = this.authService.getToken(); 
      const rol = (this.authService.getUserRole() || '').toLowerCase().trim();

      // 🔴 SI NO HAY TOKEN O SI ES UN ADMIN: Trampa activada
      if (!token || rol === 'admin') {
        this.permitido = false; // La pantalla se queda 100% invisible
        this.cargando = false;
        this.cdr.detectChanges();

        // 💥 DISPARAMOS LA ALERTA (Al estar quietos en el componente, se congela sí o sí)
        alert('Acceso Denegado: Su rol de Administrador no cuenta con los privilegios requeridos para auditar el módulo de Últimas Conexiones.');
        
        // Lo echamos al Home después de que le dé a "Aceptar"
        this.router.navigate(['/']);
        return;
      }

      // 🟢 Si es un usuario real, le damos el pase de visibilidad y cargamos datos
      this.permitido = true;
      this.cargarHistorial();
    }
  }

cargarHistorial(): void {
    this.cargando = true;
    // 🟢 Agregamos explícitamente ': any' a data y err para cumplir con las reglas estrictas de tu TypeScript
    this.authService.getUltimasConexiones().subscribe({
      next: (data: any) => {
        this.logs = data.map((log: any) => {
          const fechaBaseStr = log.fechaHora.endsWith('Z') ? log.fechaHora : `${log.fechaHora}Z`;
          return {
            ...log,
            fechaHora: new Date(fechaBaseStr).toLocaleString('es-CL', { 
              timeZone: 'America/Santiago',
              hour12: false 
            })
          };
        });
        this.cargando = false; 
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        console.error('Error al cargar la trazabilidad:', err);
        this.cargando = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}