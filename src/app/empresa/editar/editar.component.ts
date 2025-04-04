import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';
@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.css'
})
export class EditarComponent {
  empresa: any = { id: null, nomeFantasia: '',cnpj:'',cep: ''  };
  mensagemErro: string = '';

  constructor(
    private route: ActivatedRoute,
    private empresaService: EmpresaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.empresaService.getEmpresaPorId(id).subscribe((data) => {
        this.empresa = data;
      });
    }
  }
  editar(): void {
    this.mensagemErro = '';
    this.empresaService.atualizarEmpresa(this.empresa).subscribe({
      next: () => {
        alert('Empresa atualizada com sucesso!');
        this.router.navigate(['/empresas']);
      },
      error: (erro) => {
        this.mensagemErro = erro.error?.message || 'Erro ao atualizar empresa.';
      }
    });
  }
}
