import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall, Pais } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html'
})
export class SelectorComponent implements OnInit {


  miFormulario : FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  })

  //Llenar Selectores
  regiones: string[] = [];
  paises: PaisSmall[]= [];
  fronteras: PaisSmall[]=[];
  
  //UI
  cargando : boolean = false;

  constructor( private fb: FormBuilder,
              private paisesService: PaisesService ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones

    //Cuando cambie la región
    // this.miFormulario.get('region')?.valueChanges.
    //   subscribe( region =>{
    //     console.log(region);
    //     this.paisesService.getPaisesPorRegion( region)
    //     .subscribe ( paises =>{
    //       this.paises = paises;
    //       this.miFormulario.get('pais')?.reset();
    //       console.log(this.paises)

    //     })
        
    //   })

    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( ( _ ) =>{
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap( region => this.paisesService.getPaisesPorRegion( region ) )
      )
      .subscribe( paises =>{
        this.cargando = false;
        this.paises = paises
      })
    
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap( ( _ ) =>{
        this.fronteras = [];
        this.miFormulario.get('frontera')?.reset('');
        this.cargando = true;
      }),
      switchMap( codigoPais => this.paisesService.getPaisPorCodigo( codigoPais )),
      switchMap( Pais => this.paisesService.getPaisesPorCodigo( Pais?.borders! )) 
    )
    .subscribe( paises =>{
      this.fronteras = paises;
      this.cargando = false;
        
      })
  }



  guardar(){
      console.log(this.miFormulario.value);
  }

}
