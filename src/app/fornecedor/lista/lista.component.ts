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
  fornecedoresPaginados: any[] = [];
  paginas: number[] = [];
  constructor(private fornecedorService: FornecedorService, private router: Router) {}

  paginaAtual = 1;
  itensPorPagina = 5;
  totalPaginas = 1;
  
  ngOnInit(): void {
    this.fornecedorService.listar().subscribe(data => {
      this.fornecedores = data;
      this.atualizarPaginacao();
    });
  }
  atualizarPaginacao() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.totalPaginas = Math.ceil(this.fornecedores.length / this.itensPorPagina);
    this.fornecedoresPaginados = this.fornecedores.slice(inicio, fim);
    this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }
  anteriorPagina() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPaginacao();
    }
  }
  
  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.atualizarPaginacao();
    }
  }
  irParaPagina(pagina: number) {
    this.paginaAtual = pagina;
    this.atualizarPaginacao();
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

  ehPessoaJuridica(cpfCnpj: string): boolean {
    return cpfCnpj?.replace(/\D/g, '').length === 14;
  }
  formatarCpfCnpj(valor: string): string {
    const num = valor.replace(/\D/g, '');
    if (num.length === 11) {
      return num.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); // CPF
    } else if (num.length === 14) {
      return num.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5'); // CNPJ
    }
    return valor;
  }
  
  formatarCep(cep: string): string {
    const num = cep.replace(/\D/g, '');
    return num.length === 8 ? num.replace(/(\d{5})(\d{3})/, '$1-$2') : cep;
  }
  formatarRg(rg: string): string {
    const num = rg.replace(/\D/g, '');
    return num.length === 9
      ? num.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
      : rg;
  }
}