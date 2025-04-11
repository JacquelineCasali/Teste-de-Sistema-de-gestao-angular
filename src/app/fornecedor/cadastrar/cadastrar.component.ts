import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router ,RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FornecedorService } from '../../services/fornecedor.service';
import { EmpresaService } from '../../services/empresa.service';
import { HttpClient } from '@angular/common/http';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-cadastrar-fornecedor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,
    NgxMaskDirective],
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
   cidade: '',
    uf: '',
    empresaIds:  []as number[]
  };
  empresas: any[] = [];
  mensagensErro: string[] = [];
  carregandoCep: boolean = false;
cidadeUfVisivel: any;
editando: boolean = false;
fornecedorId: number | null = null;

  constructor(private fornecedorService: FornecedorService, 
    private empresaService: EmpresaService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient) {}

     ngOnInit(): void {
        this.empresaService.listar().subscribe(data => {
          this.empresas = data;
        });
        this.route.paramMap.subscribe(params => {
          const id = params.get('id');
          if (id) {
            this.editando = true;
            this.fornecedorId = +id;
            this.carregarFornecedor(this.fornecedorId);
          }
        });

      }
  // Verifica se o CPF/CNPJ digitado é de pessoa física (11 dígitos numéricos)
  isPessoaFisica(): boolean {
    const cpfCnpj = this.fornecedor.cpfCnpj?.replace(/\D/g, '');
    return !!cpfCnpj && cpfCnpj.length === 11;
  }
    // Limpa os dados de RG e dataNascimento se mudar para CNPJ
    onCpfCnpjChange(): void {
      let cpfCnpj = this.fornecedor.cpfCnpj?.replace(/\D/g, ''); // Remove caracteres não numéricos
    
      if (cpfCnpj.length <= 11) {
        // Máscara para CPF
        this.fornecedor.cpfCnpj = cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else if (cpfCnpj.length > 11 && cpfCnpj.length <= 14) {
        // Máscara para CNPJ
        this.fornecedor.cpfCnpj = cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
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


      carregarFornecedor(id: number) {
          this.fornecedorService.buscarPorId(id).subscribe({
            next: (data) => {
              this.fornecedor = {
                cpfCnpj: this.formatarCpfCnpj(data.cpfCnpj),
                nome: data.nome,
                email: data.email,
                cep: data.cep,
                rg: data.rg,
                dataNascimento: data.dataNascimento,
                cidade: data.cidade,
                uf: data.uf,
                empresaIds: data.empresas.map((e: any) => e.id)
              };
              this.cidadeUfVisivel = true;
            },
            error: () => {
              alert('Erro ao carregar fornecedor para edição.');
              this.router.navigate(['/fornecedores']);
            }
          });
        }


      cadastrar(): void {
                this.mensagensErro = [];
        
                const requisicao = this.editando && this.fornecedorId
                ? this.fornecedorService.atualizar(this.fornecedorId, this.fornecedor)
                : this.fornecedorService.criar(this.fornecedor);
        
               requisicao.subscribe({
                     
                next: () => {
                //  alert(`Fornecedor ${this.editando ? 'atualizado' : 'cadastrado'} com sucesso!`);
                  this.router.navigate(['/fornecedores']);
                },
                  error: (erro) => {
                    console.error(`Erro ao ${this.editando ? 'atualizar' : 'cadastrar'} fornecedor:`, erro);
                  
                    const mensagens: string[] = [];
                  
                    const erroOriginal = erro.error;
                  
                    if (erroOriginal) {
                      if (typeof erroOriginal === 'string') {
                        mensagens.push(erroOriginal);
                      } else if (erroOriginal.erro) {
                        mensagens.push(erroOriginal.erro); // 👈 pega exatamente esse caso
                      } else if (erroOriginal.message) {
                        mensagens.push(erroOriginal.message);
                      } else if (Array.isArray(erroOriginal)) {
                        mensagens.push(...erroOriginal);
                      } else {
                        Object.values(erroOriginal).forEach(msg => {
                          if (Array.isArray(msg)) {
                            mensagens.push(...msg);
                          } else {
                            mensagens.push(String(msg));
                          }
                        });
                      }
                    } else {
                      mensagens.push('Erro ao conectar com o servidor.');
                    }
                  
                    alert(mensagens.join('\n'));
                  }
                
                  
                });
              }

  voltar() {
    this.router.navigate(['/fornecedores']);
  }
  formatarCpfCnpj(valor: string): string {
  const num = valor.replace(/\D/g, '');
  if (num.length === 11) {
    return num.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); // CPF
  } else if (num.length === 14) {
    return num.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5'); // CNPJ
  }
  return valor;
}
}