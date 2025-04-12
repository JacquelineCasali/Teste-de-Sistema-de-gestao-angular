import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { capitalizarNome, formatarRg } from '../../shared/utils/utils';
@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
})
export class ListaComponent implements OnInit {
  empresas: any[] = [];
  empresasFiltradas: any[] = [];
  empresasPaginadas: any[] = [];
  paginas: number[] = [];
  paginaAtual = 1;
  itensPorPagina = 5;
  totalPaginas = 1;
  filtro: string = '';
  fornecedorSelecionado: any = null;
  modalAberto = false;
  constructor(private empresaService: EmpresaService, private router: Router) {}

  ngOnInit(): void {
    this.empresaService.listar().subscribe((data) => {
      this.empresas = data.sort((a, b) =>
        a.nomeFantasia.localeCompare(b.nomeFantasia)
      );

      // Ordena os fornecedores de cada empresa
      this.empresas.forEach((empresa) => {
        empresa.fornecedores.sort((a: { nome: string }, b: { nome: any }) =>
          a.nome.localeCompare(b.nome)
        );
      });

      this.aplicarFiltro();
    });
  }

  aplicarFiltro(): void {
    const termo = this.filtro.toLowerCase().trim();
    const termoNumerico = this.filtro.replace(/\D/g, '');

    this.empresasFiltradas = this.empresas.filter((e) => {
      const nome = (e.nomeFantasia || '').toLowerCase();
      const cnpj = (e.cnpj || '').replace(/\D/g, '');

      // Se não tiver filtro, retorna tudo
      if (!termo) return true;

      // Verifica se TODOS os termos do filtro estão no nome (busca por palavra)
      const termoPalavras = termo.split(/\s+/);
      const nomeMatch = termoPalavras.every((tp) => nome.includes(tp));

      // Verifica se o CNPJ inclui os números do filtro
      const cnpjMatch = termoNumerico && cnpj.includes(termoNumerico);

      return nomeMatch || cnpjMatch;
    });

    console.log('Filtro atual:', this.filtro);
    console.log('Empresas filtradas:', this.empresasFiltradas.length);

    this.totalPaginas = Math.ceil(
      this.empresasFiltradas.length / this.itensPorPagina
    );
    this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
    this.paginaAtual = 1;
    this.atualizarPaginacao();
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.empresasPaginadas = this.empresasFiltradas.slice(inicio, fim);
    console.log('Empresas paginadas:', this.empresasPaginadas);
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
    this.router.navigate(['/empresas/cadastrar']);
  }

  editar(empresa: any) {
    this.router.navigate(['/empresas/editar', empresa.id]);
  }

  visualizar(empresa: any) {
    this.router.navigate(['/empresas', empresa.id]);
  }

  deletar(empresa: any) {
    if (
      confirm(
        `Tem certeza que deseja excluir a empresa ${empresa.nomeFantasia}?`
      )
    ) {
      this.empresaService.deletar(empresa.id).subscribe({
        next: () => {
          this.empresas = this.empresas.filter((e) => e.id !== empresa.id);
          this.aplicarFiltro();
        },
        error: (error) => {
          console.error('Erro ao excluir empresa:', error);
          alert(`Erro ao excluir empresa: ${error.message || error}`);
        },
      });
    }
  }

  formatarCnpj(cnpj: string): string {
    const num = cnpj.replace(/\D/g, '');
    return num.length === 14
      ? num.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
      : cnpj;
  }
  formatarCep(cep: string): string {
    const num = cep.replace(/\D/g, '');
    return num.length === 8 ? num.replace(/(\d{5})(\d{3})/, '$1-$2') : cep;
  }
  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
  abrirModalFornecedor(fornecedor: any) {
    this.fornecedorSelecionado = fornecedor;
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  // Função no template
  capitalizarNome(nome: string): string {
    return capitalizarNome(nome); // Chama a função importada
  }
  formatarRg(rg: string): string {
    return formatarRg(rg);
  }
  ehPessoaJuridica(cpfCnpj: string): boolean {
    return cpfCnpj?.replace(/\D/g, '').length === 14;
  }
}
