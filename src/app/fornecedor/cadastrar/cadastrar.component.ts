import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FornecedorService } from '../../services/fornecedor.service';

@Component({
  selector: 'app-cadastrar-fornecedor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarFornecedorComponent {
  fornecedor = {
    cnpjCpf: '',
    nome: '',
    email: '',
    cep: '',
    rg: '',
    dataNascimento: ''
  };

  erro: string = '';

  constructor(private fornecedorService: FornecedorService, private router: Router) {}
  voltar() {
    this.router.navigate(['/fornecedores']);
  }
  cadastrar(): void {

    this.fornecedorService.criar(this.fornecedor).subscribe({
      next: () => {
        alert('Empresa cadastrada com sucesso!');
        this.router.navigate(['/fornecedor']);
    
      },
      error: (err) => {
        this.erro = err?.error?.message || 'Erro ao cadastrar fornecedor';
      }
    });
  }
}