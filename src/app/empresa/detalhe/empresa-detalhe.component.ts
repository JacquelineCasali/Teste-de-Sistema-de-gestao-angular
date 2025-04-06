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
  modalAberto: boolean = false;
  fornecedorSelecionado: any = null;
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
      });
    }
  }
  visualizarFornecedor(fornecedor: any): void {
    this.router.navigate(['/fornecedores', fornecedor.id]); // redireciona para a tela de detalhes
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

  abrirModalFornecedor(fornecedor: any): void {
    this.fornecedorSelecionado = fornecedor;
    this.modalAberto = true;
  }
  
  fecharModal(): void {
    this.modalAberto = false;
    this.fornecedorSelecionado = null;
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}





