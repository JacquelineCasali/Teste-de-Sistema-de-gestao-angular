import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit  {
  empresas: any[] = [];

  constructor(private empresaService: EmpresaService, private router: Router) {}

 
 
  ngOnInit(): void {
    this.carregarEmpresas();
  }
  carregarEmpresas(): void {
    this.empresaService.getEmpresas().subscribe((data) => {
      this.empresas = data;
    });
  }
  excluir(id: number): void {
    this.empresaService.excluirEmpresa(id).subscribe(() => {
      this.carregarEmpresas();
    });
  }
  editar(empresa: any): void {
    // Redireciona para a página de edição passando o ID da empresa
    this.router.navigate(['/empresas/editar', empresa.id]);
  }
}
