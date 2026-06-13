import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MovimientoService } from '../servicios/movimiento-service';
import { firstValueFrom } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { Movimiento as MovimientoModel } from '../modelos/movimiento';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
declare const $: any;
(window as any).$ = $;
(window as any).jQuery = $;

@Component({
  selector: 'app-movimiento',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CurrencyPipe,
    FormsModule,
  ],
  templateUrl: './movimiento.html',
  styleUrl: './movimiento.css',
})  
export class Movimiento implements OnInit, AfterViewInit {
  constructor(private movimientoService: MovimientoService) {}

  ////////////ESTADISTICAS////////////////
  totalIngresos: number = 0;
  totalGastos: number = 0;
  totalBalance: number = 0;

  numeroDeIngresos: number = 0;
  numeroDeGastos: number = 0;
  esPositivo: boolean = false;

  totalMovimientos: number = 0;

  ////////////MOVIMIENTOS////////////////
  movimientos: MovimientoModel[] = [];
  currentPage = 1;
  lastPage = 1;
  total = 0;
  perPage = 10;
  loading = false;
  hayMas = false;


  ////////////MODALES////////////////
  showCrearEditarMovimiento = false;

///////////////////////////FORMULARIO///////////////////////////
movimientoForm = new FormGroup({
  cantidad: new FormControl(0, [Validators.required, Validators.min(0)]),
  categoria: new FormControl('', [Validators.required]),
  fecha: new FormControl(new Date(), [Validators.required]),
  otros: new FormControl('', [Validators.maxLength(255)]), //opcional
})

categoria: string = '';


  //inicializacion
  async ngOnInit(): Promise<void> {
    this.totalIngresos = this.toNumber(await firstValueFrom(this.movimientoService.getTotalIngresos()));
    console.log(this.totalIngresos);
    this.totalGastos = this.toNumber(await firstValueFrom(this.movimientoService.getTotalGastos()));
    this.totalBalance = this.toNumber(await firstValueFrom(this.movimientoService.getTotalBalance()));

    const resIngresos = await firstValueFrom(this.movimientoService.getAll({ tipo: 'INGRESO', page: 1 }));
    const resGastos = await firstValueFrom(this.movimientoService.getAll({ tipo: 'GASTO', page: 1 }));
    this.numeroDeIngresos = resIngresos.total;
    this.numeroDeGastos = resGastos.total;
    this.esPositivo = this.totalIngresos > this.totalGastos;

    await this.cargarMovimientos({ page: 1 });
  }


  ngAfterViewInit(): void {
    this.initSelects2();
  }

  
  //funciones 
  async cargarMovimientos(params: Record<string, unknown> = {}): Promise<void> {
    if (this.loading) return;

    const page = Number(params['page'] ?? 1);
    if (page > 1 && page > this.lastPage) return;

    this.loading = true;
    try {
      const response = await firstValueFrom(this.movimientoService.getAll(params));
      const append = response.current_page > 1;

      this.movimientos = append
        ? [...this.movimientos, ...response.data]
        : response.data;

      this.currentPage = response.current_page;
      this.lastPage = response.last_page;
      this.total = response.total;
      this.perPage = response.per_page;
      this.hayMas = this.currentPage < this.lastPage;
      this.totalMovimientos = this.total;
    } finally {
      this.loading = false;
    }
  }

  async cargarMas(): Promise<void> {
    if (!this.hayMas || this.loading) return;
    await this.cargarMovimientos({ page: this.currentPage + 1 });
  }

  private toNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private initSelects2(): void {
    $('#usuarios').select2({
      placeholder: 'Todos los usuarios',
      ajax: {
        url: '/api/user',
        dataType: 'json',
        delay: 250,
        data: function (params: any) {
          return {
            search: {
              value: params.term || '',
            },
          };
        },
        processResults: function (response: any) {
          return {
            results: (response.data || []).map((user: any) => ({
              id: user.id,
              text: user.name,
            })),
          };
        },
        cache: true,
      },
    });
  }
}
