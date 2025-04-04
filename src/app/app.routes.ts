import {  Routes } from '@angular/router';
import { ListaComponent } from './empresa/lista/lista.component';

import { EditarComponent } from './empresa/editar/editar.component';
import { CadastrarComponent } from './empresa/cadastrar/cadastrar.component';

export const routes: Routes = [

    { path: '', redirectTo: 'empresas', pathMatch: 'full' },
    { path: 'empresas', component: ListaComponent },
    { path: 'empresas/editar/:id', component: EditarComponent } ,
    { path: 'empresas/cadastrar', component: CadastrarComponent }
];
// @NgModule({
//     imports: [RouterModule.forRoot(routes)],
//     exports: [RouterModule]
//   })

