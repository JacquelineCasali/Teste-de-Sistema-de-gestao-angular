import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router ,RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FornecedorService } from '../../services/fornecedor.service';
import { EmpresaService } from '../../services/empresa.service';
import { HttpClient } from '@angular/common/http';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-cadastrar-fornecedor',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule,
    NgxMaskDirective, NgxMaskPipe

  ],
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarFornecedorComponent {
  fornecedor = {
    cpfCnpj: '',
    nome: '',
    email: '',
    cep: '',
    rg: '',
    dataNascimento: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    uf: '',
    empresaIds:  []as number[]
  };
  empresas: any[] = [];
  mensagensErro: string[] = [];
  carregandoCep: boolean = false;
cidadeUfVisivel: any;
  constructor(private fornecedorService: FornecedorService, 
    private empresaService: EmpresaService,
    private router: Router,
    private http: HttpClient) {}

    ngOnInit(): void {
        this.empresaService.listar().subscribe(data => {
          this.empresas = data;
        });
      }
  // Verifica se o CPF/CNPJ digitado é de pessoa física (11 dígitos numéricos)
  isPessoaFisica(): boolean {
    const cpfCnpj = this.fornecedor.cpfCnpj?.replace(/\D/g, '');
    return !!cpfCnpj && cpfCnpj.length === 11;
  }
    // Limpa os dados de RG e dataNascimento se mudar para CNPJ
    onCpfCnpjChange(): void {
        if (!this.isPessoaFisica()) {
          this.fornecedor.rg = '';
          this.fornecedor.dataNascimento = '';
        }
      }
    

      toggleEmpresa(id: number, event: any): void {
        if (event.target.checked) {
          this.fornecedor.empresaIds.push(id);
        } else {
          this.fornecedor.empresaIds = this.fornecedor.empresaIds.filter((fId: number) => fId !== id);
        }
      }
   

      buscarEnderecoPorCep(cep: string) {
        if (!cep) return;
      
        cep = cep.replace(/\D/g, '');
      
        this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((res: any) => {
          if (res.erro) {
            alert('CEP não encontrado.');
            this.cidadeUfVisivel = false;
            return;
          }
      
          this.fornecedor.cidade = res.localidade;
          this.fornecedor.uf = res.uf;
          this.cidadeUfVisivel = true;
        }, err => {
          alert('Erro ao buscar o CEP.');
          this.cidadeUfVisivel = false;
        });
      }
  cadastrar(): void {
    this.mensagensErro = [];
    this.fornecedorService.criar(this.fornecedor).subscribe({
      next: () => {
        alert('Empresa cadastrada com sucesso!');
        this.router.navigate(['/fornecedores']);
    
      },
  
      error: (erro) => {
        console.error('Erro ao cadastrar fornecedor:', erro);
        this.mensagensErro = [];
      
        if (erro.error) {
          if (typeof erro.error === 'string') {
            this.mensagensErro.push(erro.error);
          } else if (erro.error.message) {
            this.mensagensErro.push(erro.error.message);
          } else if (Array.isArray(erro.error)) {
            this.mensagensErro = erro.error;
          } else {
            // É um objeto com múltiplos campos de erro
            const chaves = Object.keys(erro.error);
            chaves.forEach((key) => {
              this.mensagensErro.push(erro.error[key]);
            });
          }
        } else {
          this.mensagensErro.push('Erro ao conectar com o servidor.');
        }
      }
      
    });
  }

  voltar() {
    this.router.navigate(['/fornecedores']);
  }
}