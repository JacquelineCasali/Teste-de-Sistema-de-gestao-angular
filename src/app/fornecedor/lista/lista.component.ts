import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FornecedorService } from '../../services/fornecedor.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-fornecedor',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaFornecedorComponent implements OnInit {
  fornecedores: any[] = [];
  fornecedoresFiltrados: any[] = [];
  fornecedoresPaginados: any[] = [];
  paginas: number[] = [];
  paginaAtual = 1;
  itensPorPagina = 5;
  totalPaginas = 1;
  filtro: string = '';

  fornecedorSelecionado: any = null;
  modalAberto: boolean = false;

  constructor(private fornecedorService: FornecedorService, private router: Router) {}


  
  ngOnInit(): void {
    this.fornecedorService.listar().subscribe(data => {
      this.fornecedores = data.sort((a, b) => a.nome.localeCompare(b.nome));
      this.filtro = ''; 
      this.aplicarFiltro();
    });
  }

  

  aplicarFiltro(): void {

    const termo = (this.filtro || '').toLowerCase().trim();
    const termoNumerico = this.filtro.replace(/\D/g, '');
         this.fornecedoresFiltrados = this.fornecedores.filter(f => {
        const nome = (f.nome || '').toLowerCase().trim();
        const cpfCnpj = (f.cpfCnpj || '').replace(/\D/g, '');
         // Se tiver algum caractere não numérico, é busca por nome
   if (/\D/.test(this.filtro)) {
    return nome.includes(termo);
  }
          // Se for só números, pode ser CPF ou CNPJ
    return cpfCnpj.includes(termoNumerico) || nome.includes(termo);
     
      });
       
    this.totalPaginas = Math.ceil(this.fornecedoresFiltrados.length / this.itensPorPagina);
    this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
    this.paginaAtual = 1;
    this.atualizarPaginacao();
  }


  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.fornecedoresPaginados = this.fornecedoresFiltrados.slice(inicio, fim);
  }

  anteriorPagina(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPaginacao();
    }
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.atualizarPaginacao();
    }
  }

  irParaPagina(pagina: number): void {
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
 // Método para abrir a modal de confirmação
 deletar(fornecedor: any) {
  if (confirm(`Tem certeza que deseja excluir o fornecedor ${fornecedor.nome}?`)) {
    this.fornecedorService.deletar(fornecedor.id).subscribe({
      next: () => {
        this.fornecedores = this.fornecedores.filter(f => f.id !== fornecedor.id);
        this.aplicarFiltro();
        this.atualizarPaginacao();
      },
      error: (error) => {
        console.error('Erro ao excluir fornecedor:', error);
        alert(`Erro ao excluir fornecedor: ${error.message || error}`);
      }
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
    } else if (num.length === 20) {
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