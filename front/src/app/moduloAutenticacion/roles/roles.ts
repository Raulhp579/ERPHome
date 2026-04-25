import { Component, OnInit, signal, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { RolService } from '../servicios/rol-service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-roles',
  imports: [
    MatIconModule, 
    FormsModule, 
    MatCardModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule, 
    CommonModule
  ],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles implements OnInit {

  private rolService = inject(RolService);

  constructor(private router: Router){}

  showModalCrear = signal(false);
  showModalEditar = signal(false);

  nombreRolCrear = '';

  ngOnInit(): void {
    this.cargarTabla();
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if ($.fn.DataTable.isDataTable('#rolesTable')) {
      $('#rolesTable').DataTable().search(value).draw();
    }
  }

  private lang = {
    sProcessing: 'Procesando...',
    sLengthMenu: 'Mostrar _MENU_ registros',
    sZeroRecords: 'No se encontraron resultados',
    sEmptyTable: 'Ningún dato disponible en esta tabla',
    sInfo: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
    sInfoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
    sInfoFiltered: '(filtrado de un total de _MAX_ registros)',
    sInfoPostFix: '',
    sSearch: 'Buscar:',
    sUrl: '',
    sInfoThousands: ',',
    sLoadingRecords: 'Cargando...',
    oPaginate: {
      sFirst: 'Primero',
      sLast: 'Último',
      sNext: 'Siguiente',
      sPrevious: 'Anterior',
    },
    oAria: {
      sSortAscending: ': Activar para ordenar la columna de manera ascendente',
      sSortDescending: ': Activar para ordenar la columna de manera descendente',
    },
    buttons: {
      copy: 'Copiar',
      colvis: 'Visibilidad',
    },
  };

  cargarTabla = () => {
    if ($.fn.DataTable.isDataTable('#rolesTable')) {
      $('#rolesTable').DataTable().destroy();
    }

    $('#rolesTable').DataTable({
      language: this.lang,
      lengthChange: false,
      processing: true,
      serverSide: true,
      ajax: {
        url: 'api/rol',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        type: 'GET',
      },
      responsive: false,
      autoWidth: false,

      columns: [
        {
          title: 'ID',
          data: 'id',
          name: 'id',
          width: '50px',
          className: 'dt-left'
        },
        {
          title: 'Nombre',
          data: 'name',
          name: 'name'
        },
        {
          title: 'Acciones',
          data: null,
          orderable: false,
          width: '120px',
          render: (data: any) => {
            return `
              <div class="d-flex gap-2">
                <button class="btn-icon edit" data-id="${data.id}" title="Editar">
                  <i class="material-icons">edit</i>
                </button>
                <button class="btn-icon delete" data-id="${data.id}" title="Eliminar">
                  <i class="material-icons">delete</i>
                </button>
              </div>
            `;
          },
        },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('td', row).off('click');
        $('td', row).on('click', () => {
          this.router.navigate(["/roles/asignar", (data as any).id])
        });
        return row;
      },
      drawCallback: () => {
        setTimeout(() => {
          const tableContainer = '.dt-container, .dataTables_wrapper';
          $(tableContainer).find('label, span, div, a, .dt-info, .dataTables_info').css('color', '#ffffff');

          $('.btn-icon.edit').off('click').on('click', (e: any) => {
            const id = $(e.currentTarget).data('id');
            this.idEditarRol = id
            this.abrirModalEditar(id);
          });

          $('.btn-icon.delete').off('click').on('click', (e: any) => {
            const id = $(e.currentTarget).data('id');
            this.borrarRol(id)
          });

          // Removing hardcoded inline styles from JS so CSS takes effect
        }, 50);
      }
    });
  }



  async abrirModalEditar(id: number) {
    try {
      const resp = await firstValueFrom(this.rolService.getRoles());
      const rol = resp.data.find((r: any) => r.id === id);
      this.nombreEditarRol = rol.name;
      this.showModalEditar.set(true);
    } catch (error) {
      console.error('Error al obtener el rol:', error);
    }
  }

  swalEliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro de eliminar este rol?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-text',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Eliminando rol:', id);
      }
    });
  }

  abrirModalCrear() {
    this.showModalCrear.set(true);
  }

  cerrarModales() {
    this.showModalCrear.set(false);
    this.showModalEditar.set(false);
  }

  crearRol() {
    this.rolService.createRol({ name: this.nombreRolCrear }).subscribe({
      next: () => {
        this.cerrarModales();
        this.cargarTabla();
        Swal.fire({
          title: 'Rol creado exitosamente',
          icon: 'success',
          confirmButtonColor: '#00f2ad',
          confirmButtonText: 'Aceptar',
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error al crear el rol',
          text: error.error.message,
          icon: 'error',
          confirmButtonColor: '#ef4444',
          confirmButtonText: 'Aceptar',
        });
      }
    });
  }

  async borrarRol(id: number) {
    try {
      Swal.fire({
        title: '¿Estás seguro de eliminar este rol?',
        text: 'No podrás revertir esto',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
          title: 'custom-swal-title',
          htmlContainer: 'custom-swal-text',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.rolService.deleteRol(id).subscribe({
            next: () => {
              this.cargarTabla();
              Swal.fire({
                title: 'Rol eliminado exitosamente',
                icon: 'success',
                confirmButtonColor: '#00f2ad',
                confirmButtonText: 'Aceptar',
              });
            },
            error: (error) => {
              Swal.fire({
                title: 'Error al eliminar el rol',
                text: error.error.message,
                icon: 'error',
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'Aceptar',
              });
            }
          });
        }
      });
    } catch (error) {
      Swal.fire({
        title: 'Error al eliminar el rol',
        text: 'El rol no se ha podido eliminar',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Aceptar',
      });
    }
  }

  nombreEditarRol:string = '';
  idEditarRol:number = 0;

  editarRol(){
    this.rolService.updateRol(this.idEditarRol, { name: this.nombreEditarRol }).subscribe({
      next: () => {
        this.cerrarModales();
        this.cargarTabla();
        Swal.fire({
          title: 'Rol editado exitosamente',
          icon: 'success',
          confirmButtonColor: '#00f2ad',
          confirmButtonText: 'Aceptar',
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error al editar el rol',
          text: error.error.message,
          icon: 'error',
          confirmButtonColor: '#ef4444',
          confirmButtonText: 'Aceptar',
        });
      }
    });
  }
}
