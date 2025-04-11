import {  Routes } from '@angular/router';
import { ListaComponent } from './empresa/lista/lista.component';

import { CadastrarComponent } from './empresa/cadastrar/cadastrar.component';
import { ListaFornecedorComponent } from './fornecedor/lista/lista.component';
import { EmpresaDetalheComponent } from './empresa/detalhe/empresa-detalhe.component';
import { CadastrarFornecedorComponent } from './fornecedor/cadastrar/cadastrar.component';


export const routes: Routes = [

    { path: '', redirectTo: 'empresas', pathMatch: 'full' },
    { path: 'empresas', component: ListaComponent },

    { path: 'empresas/editar/:id', component: CadastrarComponent } ,
    { path: 'empresas/cadastrar', component: CadastrarComponent },
    { path: 'empresas/:id', component: EmpresaDetalheComponent },

    { path: 'fornecedores', component: ListaFornecedorComponent },
    { path: 'fornecedores/cadastrar', component: CadastrarFornecedorComponent },
    { path: 'fornecedores/editar/:id', component: CadastrarFornecedorComponent },
];


