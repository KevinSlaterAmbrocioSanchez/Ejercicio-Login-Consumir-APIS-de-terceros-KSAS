import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon'; // Importa MatIconModule


@Component({
  selector: 'app-tablas',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, MatIconModule],
  templateUrl: './tablas.component.html',
  styleUrls: ['./tablas.component.css'],
})
export class TablasComponent implements OnInit {
  products: any[] = []; // Lista completa de productos obtenidos
  filteredProducts: any[] = []; // Lista filtrada de productos según la búsqueda
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 10; // Productos por página
  selectedProduct: any = null; // Producto seleccionado para mostrar en detalles
  editableProduct: any = {}; // Producto a editar en el modal de edición
  productToDelete: any = null; // Producto seleccionado para eliminar
  searchTerm: string = ''; // Término de búsqueda

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}


  ngOnInit(): void {
    this.fetchProducts(); // Obtiene los productos al cargar el componente
  }

  // Obtiene los productos desde la API de Fake Store
  fetchProducts(): void {
    this.http.get<any[]>('https://api.escuelajs.co/api/v1/products').subscribe((response) => {
      this.products = response.map(product => ({
        id: product.id,
        title: product.title,
        description: product.description,
        image: product.images && product.images.length > 0 ? product.images[0] : 'assets/default-image.png', // Imagen por defecto si no hay imágenes
      }));
      this.filteredProducts = this.products;
    });
  }
  
  
  

  // Filtra los productos en base al término de búsqueda
  searchProducts(): void {
    const term = this.searchTerm.toLowerCase(); // Convierte el término a minúsculas
    this.filteredProducts = this.products.filter((product) =>
      product.title.toLowerCase().includes(term)
    );
    this.currentPage = 1; // Reinicia a la primera página
  }

  // Obtiene los productos paginados según la lista filtrada
  get paginatedProducts(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
  }

  // Cambia a la página anterior
  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  // Cambia a la página siguiente
  nextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.filteredProducts.length) {
      this.currentPage++;
    }
  }

  // Abre el modal de detalles para mostrar información de un producto
  openModal(product: any): void {
    this.selectedProduct = product;
  }

  // Abre el modal de edición para modificar un producto
  openEditModal(product: any): void {
    this.editableProduct = { ...product }; // Crea una copia del producto seleccionado
  }

  // Guarda los cambios realizados en el producto editado
  saveChanges(): void {
    const index = this.products.findIndex((p) => p.id === this.editableProduct.id);
    if (index !== -1) {
      this.products[index] = { ...this.editableProduct }; // Actualiza el producto en la lista completa
      this.filteredProducts = [...this.products]; // Actualiza la lista filtrada
    }
    this.editableProduct = {}; // Limpia el producto editable
  }

  // Abre el modal de confirmación para eliminar un producto
  openDeleteModal(product: any): void {
    this.productToDelete = product;
  }

  // Elimina un producto seleccionado de las listas
  deleteProduct(): void {
    this.products = this.products.filter((p) => p.id !== this.productToDelete.id);
    this.filteredProducts = this.filteredProducts.filter(
      (p) => p.id !== this.productToDelete.id
    );
    this.productToDelete = null; // Limpia la referencia del producto eliminado
  }
}