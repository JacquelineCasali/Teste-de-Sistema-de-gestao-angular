import { Component, OnInit } from '@angular/core';

import { EmpresaService } from '../../services/empresa.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FornecedorService } from '../../services/fornecedor.service';


@Component({
  selector: 'app-empresa-detalhe',
  standalone: true,
   imports: [CommonModule],
  templateUrl: './empresa-detalhe.component.html',
  styleUrls: ['./empresa-detalhe.component.css']
})
export class EmpresaDetalheComponent implements OnInit {
  empresa: any;
  fornecedoresPaginados: any[] = [];
  paginaAtual = 1;
  itensPorPagina = 5;
  paginaTotal = 1;
 



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empresaService: EmpresaService,
    private fornecedorService:FornecedorService
  ) {}



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.empresaService.getEmpresaById(Number(id)).subscribe((empresa) => {
        this.empresa = empresa;
        
        // Ordena os fornecedores pelo nome
        this.empresa.fornecedores.sort((a: { nome: string; }, b: { nome: any; }) => a.nome.localeCompare(b.nome));
  
        // Atualiza a listagem paginada
        this.atualizarFornecedores();
      });
    }
  }

  atualizarFornecedores() {
    if (!this.empresa?.fornecedores) return;

    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;

    // Atualiza o total de páginas
    this.paginaTotal = Math.ceil(this.empresa.fornecedores.length / this.itensPorPagina);

    // Verifica se a página atual está dentro do limite total de páginas
    if (this.paginaAtual > this.paginaTotal) {
      this.paginaAtual = this.paginaTotal;
    }

    // Atualiza os fornecedores paginados
    this.fornecedoresPaginados = this.empresa.fornecedores.slice(inicio, fim);
  }
  mudarPagina(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.atualizarFornecedores();
  }

  visualizarFornecedor(fornecedor: any): void {
    this.router.navigate(['/fornecedores', fornecedor.id]);
  }

  cadastrar() {
    this.router.navigate(['/empresas/cadastrar']);
  }

  editarEmpresa() {
    this.router.navigate(['/empresas/editar', this.empresa?.id]);
  }

  voltar() {
    this.router.navigate(['/empresas']); // ajuste essa rota conforme a sua aplicação
  }
  


  
  editarFornecedor(fornecedor: any): void {
    this.router.navigate(['/fornecedores/editar', fornecedor.id]); // redireciona para a tela de edição
  }

  deletarFornecedor(id: number): void {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      this.fornecedorService.deletar(id).subscribe(() => {
        this.empresa.fornecedores = this.empresa.fornecedores.filter((f: any) => f.id !== id);
      });
    }
  }
  ehPessoaJuridica(cpfCnpj: string): boolean {
    return cpfCnpj?.replace(/\D/g, '').length === 14;
  }
  formatarCnpj(cnpj: string): string {
    if (!cnpj) return ''; // Retorna uma string vazia se o CNPJ for nulo ou indefinido
    const num = cnpj.replace(/\D/g, '');
    return num.length === 14
      ? num.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
      : cnpj;
  }
  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
  formatarCep(cep: string): string {
    if (!cep) return ''; // Retorna uma string vazia se o CEP for nulo ou indefinido
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





