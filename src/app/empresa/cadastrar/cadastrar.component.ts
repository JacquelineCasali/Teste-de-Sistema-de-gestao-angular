import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../services/empresa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastrar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastrar.component.html',
  styleUrl: './cadastrar.component.css'
})
export class CadastrarComponent {
  empresa: any = {
    cnpj: '',
    nomeFantasia: '',
    cep: '',
    fornecedorIds: []
  };
  fornecedores: any[] = [];
  mensagemErro: string = '';
  constructor(private empresaService: EmpresaService, private router: Router) {}
  ngOnInit(): void {
    // Buscar fornecedores disponíveis
    this.empresaService.getFornecedores().subscribe((data) => {
      this.fornecedores = data;
    });
  }

  cadastrar(): void {
    this.mensagemErro = '';
    this.empresaService.criarEmpresa(this.empresa).subscribe({
      next: () => {
        alert('Empresa cadastrada com sucesso!');
        this.router.navigate(['/empresas']);
      },
      error: (erro) => {
        this.mensagemErro = erro.error?.message || 'Erro ao cadastrar empresa.';
      }
    });
  }
}