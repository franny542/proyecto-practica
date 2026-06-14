import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../../services/auth.service'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule], 
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  constructor(public authService: AuthService) {}

}