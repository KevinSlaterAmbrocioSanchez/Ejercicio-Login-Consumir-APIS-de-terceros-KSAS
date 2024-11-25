import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { currentUser } from './bussiness/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'SistemaWeb';
  currentUser = currentUser; // Usamos la señal del usuario autenticado
  menuOpen: boolean = false; // Controla si el menú está abierto o cerrado

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen; // Alternar entre abierto y cerrado
  }

  isRootRoute(): boolean {
    return this.router.url === '/'; // Verifica si estás en la raíz
  }

  logout() {
    currentUser.set(null); // Limpia los datos del usuario
    this.router.navigate(['/']); // Redirige al login
  }
}
