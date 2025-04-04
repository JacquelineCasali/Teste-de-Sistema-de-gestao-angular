import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FornecedorService } from '../../services/fornecedor.service';

@Component({
  selector: 'app-lista-fornecedor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaFornecedorComponent implements OnInit {
  fornecedores: any[] = [];

  constructor(private fornecedorService: FornecedorService, private router: Router) {}

  ngOnInit(): void {
    this.fornecedorService.listar().subscribe(data => {
      this.fornecedores = data;
    });
  }
  cadastrar() {
    this.router.navigate(['/fornecedores/cadastrar']);
  }
  editar(fornecedor: any) {
    this.router.navigate(['/fornecedores/editar', fornecedor.id]);
  }

  deletar(id: number) {
    if (confirm('Tem certeza que deseja excluir?')) {
      this.fornecedorService.deletar(id).subscribe(() => {
        this.ngOnInit();
      });
    }
  }
}
