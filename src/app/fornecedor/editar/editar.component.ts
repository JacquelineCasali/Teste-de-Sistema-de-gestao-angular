import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FornecedorService } from '../../services/fornecedor.service';

@Component({
  selector: 'app-editar-fornecedor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarFornecedorComponent implements OnInit {
  fornecedor: any = {};
  erro = '';

  constructor(
    private fornecedorService: FornecedorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
    this.fornecedorService.buscarPorId(id).subscribe({
      next: data => this.fornecedor = data,
      error: () => (this.erro = 'Erro ao carregar fornecedor')
    });
  }
  }
  voltar() {
    this.router.navigate(['/fornecedores']);
  }



    atualizar() {
    this.fornecedorService.atualizar(this.fornecedor).subscribe({
      next: () => this.router.navigate(['/fornecedores']),
      error: (err) => {
        this.erro = err?.error?.message || 'Erro ao atualizar fornecedor';
      }
    });
  }
}