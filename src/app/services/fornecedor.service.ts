import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  private apiUrl = 'http://localhost:8080/fornecedor';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  criar(fornecedor: any): Observable<any> {
    return this.http.post(this.apiUrl, fornecedor);
  }

  atualizar(id:number,fornecedor: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, fornecedor);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}