import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { UsuarioService } from '../servicios/usuario-service';
import { FormsModule } from "@angular/forms";
import { firstValueFrom } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-gestion-usuarios-roles-permisos',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './gestion-usuarios-roles-permisos.html',
  styleUrl: './gestion-usuarios-roles-permisos.css',
})
export class GestionUsuariosRolesPermisos implements OnInit {
  showModalCrear = false;
  showModalEditar = false;
  usuario: any = {};
  usuarioCrear:any={};

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private usuarioService: UsuarioService,
  ) {}

  swalEliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro de eliminar este usuario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-text',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteUsuario(id).subscribe((response) => {
          Swal.fire({
            title: 'Eliminado',
            text: 'El usuario ha sido eliminado',
            icon: 'success',
            customClass: {
              title: 'custom-swal-title',
              htmlContainer: 'custom-swal-text',
            },
          });

          this.cargarTabla()
        });
      }
    });
  }

  abrirModalCrear() {
    this.showModalCrear = true;
  }


  async getUsuario(id:number) {
    const usuario = await firstValueFrom(this.usuarioService.getUsuario(id));
    return usuario.data;
  }

  async abrirModalEditar(id:number) {
    this.usuario = await this.getUsuario(id);
    this.showModalEditar = true;
    this.cdr.detectChanges();
  }

  cerrarModales() {
    this.showModalCrear = false;
    this.showModalEditar = false;
    this.usuario = {};
  }

  guardarCambios() {
    if (!this.usuario.id) return;
    

    this.usuarioService.updateUsuario(this.usuario.id, this.usuario).subscribe({
      next: () => {
        Swal.fire({
          title: 'Guardado',
          text: 'Los cambios se han guardado correctamente',
          icon: 'success',
          customClass: {
            title: 'custom-swal-title',
            htmlContainer: 'custom-swal-text',
          },
        });
        this.cerrarModales();
        this.cargarTabla();
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo guardar los cambios',
          icon: 'error',
          customClass: {
            title: 'custom-swal-title',
            htmlContainer: 'custom-swal-text',
          },
        });
      }
    });
  }
  ngOnInit(): void {
    this.cargarTabla();
  }
  //variable de la configuracion de la tabla
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
    if ($.fn.DataTable.isDataTable('#usuariosTable')) {
      $('#usuariosTable').DataTable().ajax.reload(null, false);
      return;
    }
    const tabla = $('#usuariosTable').DataTable({
      language: this.lang,
      lengthChange: false,
      processing: true,
      serverSide: true,
      ajax: {
        url: '/api/user',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        type: 'GET',
      },
      columns: [
        {
          title: 'Nombre',
          data: 'name',
          name: 'name',
        },
        {
          title: 'Email',
          data: 'email',
          name: 'email',
        },
        {
          title: 'Rol',
          data: 'rol',
          name: 'rol',
        },
        {
          title: 'Fecha Registro',
          data: 'created_at',
          name: 'created_at',
        },
        {
          title: 'Acciones',
          data: 'actions',
          name: 'actions',
        },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          const usuarioId = (data as any).id;
          self.router.navigate(['usuarios/asignar', usuarioId]);
        });
        return row;
      },
      drawCallback: () => {
        setTimeout(() => {
          const tableContainer = '.dt-container, .dataTables_wrapper';

          $(tableContainer)
            .find('label, span, div, a, .dt-info, .dataTables_info')
            .css('color', '#ffffff');

          const buttons = '.dt-paging-button, .paginate_button';
          $(buttons).each((index: number, element: any) => {
            const $btn = $(element);
            if ($btn.hasClass('current')) {
              $btn.attr(
                'style',
                'background: #00f2ad !important; color: #0f172a !important; border: none !important; font-weight: bold !important;',
              );
            } else if (!$btn.hasClass('disabled')) {
              $btn.attr(
                'style',
                'background: rgba(255, 255, 255, 0.1) !important; color: #ffffff !important; border: 1px solid rgba(255,255,255,0.2) !important;',
              );
            } else {
              $btn.attr(
                'style',
                'color: rgba(255,255,255,0.3) !important; background: transparent !important;',
              );
            }
          });

          $('.btn-icon.edit').attr(
            'style',
            'background-color: #00f2ad !important; color: #0f172a !important;',
          );
          $('.btn-icon.edit')
            .off('click')
            .on('click', (e: any) => {
              e.stopPropagation();
              const id = $(e.currentTarget).data('id');
              this.abrirModalEditar(id);
            });

          $('.btn-icon.delete').attr(
            'style',
            'background-color: #ef4444 !important; color: #ffffff !important;',
          );
          $('.btn-icon.delete')
            .off('click')
            .on('click', (e: any) => {
              e.stopPropagation();
              const id = $(e.currentTarget).data('id');
              this.swalEliminar(id);
            });
        }, 50);
      },
    });
  };

  guardarUsuario(){

    if(this.usuarioCrear.password !== this.usuarioCrear.password_confirmation){
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        icon: 'error',
        customClass: {
          title: 'custom-swal-title',
          htmlContainer: 'custom-swal-text',
        },
      });
      return;
    }

    this.usuarioService.createUsuario(this.usuarioCrear).subscribe({
      next: () => {
        Swal.fire({
          title: 'Guardado',
          text: 'Los cambios se han guardado correctamente',
          icon: 'success',
          customClass: {
            title: 'custom-swal-title',
            htmlContainer: 'custom-swal-text',
          },
        });
        this.cerrarModales();
        this.cargarTabla();
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo guardar los cambios',
          icon: 'error',
          customClass: {
            title: 'custom-swal-title',
            htmlContainer: 'custom-swal-text',
          },
        });
      }
    });
  }
}
