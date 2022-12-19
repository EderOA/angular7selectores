import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaisSmall, Pais } from '../interfaces/paises.interface';
import { of, Observable, combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  baseUrl: string = 'https://restcountries.com/v2';
  private _regiones : string[] = ['Africa','Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[]{
    return [ ...this._regiones];
  }
  constructor( private http: HttpClient) { }

  getPaisesPorRegion ( region: string):Observable<PaisSmall[]> {
    const url: string = `${ this.baseUrl}/region/${ region }?fields=alpha3Code,name`
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisPorCodigo( codigo : string ): Observable<Pais | null>{

    if ( !codigo ){
      return of(null);
    }

    const url: string = `${ this.baseUrl}/alpha/${ codigo }`
    return this.http.get<Pais>(url);

  }

  getPaisSmallPorCodigo( codigo : string ): Observable<PaisSmall>{


    const url: string = `${ this.baseUrl}/alpha/${ codigo }?fields=name,alpha3Code`
    return this.http.get<PaisSmall>(url);

  }

  getPaisesPorCodigo( border : string[] ): Observable<PaisSmall[]>{

    if ( !border ){
      return of([]);
    }

    const peticiones : Observable<PaisSmall>[] = [];

    border.forEach( codigo =>{
      const peticion = this.getPaisSmallPorCodigo(codigo);
      peticiones.push( peticion );
    })

    return combineLatest( peticiones );
    
  }
}

