import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = 'http://localhost:8080/empresa';
  private fornecedorUrl = 'http://localhost:8080/fornecedor';
  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEmpresas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getEmpresaPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
 

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  criarEmpresa(empresa: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, empresa);
  }

  atualizarEmpresa(empresa: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${empresa.id}`, empresa);
  }

  excluirEmpresa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFornecedores(): Observable<any[]> {
    return this.http.get<any[]>(this.fornecedorUrl);
  }

}