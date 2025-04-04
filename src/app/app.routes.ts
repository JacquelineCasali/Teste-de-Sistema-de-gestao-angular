import {  Routes } from '@angular/router';
import { ListaComponent } from './empresa/lista/lista.component';

import { EditarComponent } from './empresa/editar/editar.component';
import { CadastrarComponent } from './empresa/cadastrar/cadastrar.component';
import { ListaFornecedorComponent } from './fornecedor/lista/lista.component';
import { CadastrarFornecedorComponent } from './fornecedor/cadastrar/cadastrar.component';
import { EditarFornecedorComponent } from './fornecedor/editar/editar.component';

export const routes: Routes = [

    { path: '', redirectTo: 'empresas', pathMatch: 'full' },
    { path: 'empresas', component: ListaComponent },
    { path: 'empresas/editar/:id', component: EditarComponent } ,
    { path: 'empresas/cadastrar', component: CadastrarComponent },
    { path: 'fornecedores', component: ListaFornecedorComponent },
    { path: 'fornecedores/cadastrar', component: CadastrarFornecedorComponent },
    { path: 'fornecedores/editar/:id', component: EditarFornecedorComponent },
];
// @NgModule({
//     imports: [RouterModule.forRoot(routes)],
//     exports: [RouterModule]
//   })

