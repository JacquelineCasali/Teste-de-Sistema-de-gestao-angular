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
  fornecedorSelecionado: any = null;
  modalAberto: boolean = false;
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



  visualizar(fornecedor: any) {
    this.fornecedorSelecionado = fornecedor;
    this.modalAberto = true;
  }
  
  fecharModal() {
    this.modalAberto = false;
    this.fornecedorSelecionado = null;
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
  deletar(id: number) {
    if (confirm('Tem certeza que deseja excluir?')) {
      this.fornecedorService.deletar(id).subscribe(() => {
        this.ngOnInit();
      });
    }
  }
}