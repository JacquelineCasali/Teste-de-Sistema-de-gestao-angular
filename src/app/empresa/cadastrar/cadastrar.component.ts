import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../services/empresa.service';
import { Router } from '@angular/router';
import { FornecedorService } from '../../services/fornecedor.service';

@Component({
  selector: 'app-cadastrar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastrar.component.html',
  styleUrl: './cadastrar.component.css'
})
export class CadastrarComponent implements OnInit {
  empresa: any = {
    cnpj: '',
    nomeFantasia: '',
    cep: '',
    fornecedorIds: []as number[]
  };
  fornecedores: any[] = [];
  mensagemErro: string = '';
  constructor(private empresaService: EmpresaService, 
    private fornecedorService: FornecedorService,
    private router: Router) {}


    ngOnInit(): void {
      this.fornecedorService.listar().subscribe(data => {
        this.fornecedores = data;
      });
    }
    voltar() {
      this.router.navigate(['/empresas']);
    }
  cadastrar(): void {
    this.mensagemErro = '';
    this.empresaService.criarEmpresa(this.empresa).subscribe({
      next: () => {
        alert('Empresa cadastrada com sucesso!');
        this.router.navigate(['/empresas']);
      },
      error: (erro) => {
        this.mensagemErro = erro.error.message || 'Erro ao cadastrar empresa.';
      }
    });
  }

  toggleFornecedor(id: number, event: any) {
    if (event.target.checked) {
      this.empresa.fornecedorIds.push(id);
    } else {
      this.empresa.fornecedorIds = this.empresa.fornecedorIds.filter((fId: number) => fId !== id);
    }
  }
}