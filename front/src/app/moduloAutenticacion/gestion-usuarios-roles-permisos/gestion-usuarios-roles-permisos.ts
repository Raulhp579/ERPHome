import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-gestion-usuarios-roles-permisos',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './gestion-usuarios-roles-permisos.html',
  styleUrl: './gestion-usuarios-roles-permisos.css',
})
export class GestionUsuariosRolesPermisos implements OnInit {
  showModalCrear = false;
  showModalEditar = false;

  constructor(private router: Router) { }

  abrirModalCrear() {
    this.showModalCrear = true;
  }

  abrirModalEditar() {
    this.showModalEditar = true;
  }

  cerrarModales() {
    this.showModalCrear = false;
    this.showModalEditar = false;
  }
  ngOnInit(): void {
    this.cargarTabla()
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
    const tabla = $('#usuariosTable').DataTable({
      language: this.lang,
      lengthChange: false, 
      ajax: {
        url: '/api/user',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        type: 'GET',
      },
      columns: [
        {
          title: 'Nombre',
          data: 'name',
          name: 'name'
        },
        {
          title: 'Email',
          data: 'email',
          name: 'email'
        },
        {
          title: 'Rol',
          data: 'rol',
          name: 'rol'
        },
        {
          title: 'Fecha Registro',
          data: 'created_at',
          name: 'created_at'
        },
        {
          title: 'Acciones',
          data: 'actions',
          name: 'actions'
        },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
    const self = this;
    // Desvincular primero para evitar que el evento se duplique al redibujar
    $('td', row).off('click');
    $('td', row).on('click', () => {
      // 'data' contiene todo el objeto del usuario que viene de Laravel
      const usuarioId = (data as any).id; 
      
      // Navegamos a la ruta de edición o detalle
      self.router.navigate(['usuarios/asignar', usuarioId]);
    });
    return row;
  },
      drawCallback: function() {
        // Brute force: forzamos el color blanco en TODO el contenedor de la tabla
        // Usamos un pequeño delay para asegurar que DataTables haya terminado de inyectar su propio HTML
        setTimeout(() => {
          const tableContainer = '.dt-container, .dataTables_wrapper';
          
          // Forzar blanco en todos los textos y etiquetas
          $(tableContainer).find('label, span, div, a, .dt-info, .dataTables_info').css('color', '#ffffff');
          
          // Estilo agresivo para botones de paginación (v1 y v2)
          const buttons = '.dt-paging-button, .paginate_button';
          $(buttons).each((index: number, element: any) => {
            const $btn = $(element);
            if ($btn.hasClass('current')) {
              $btn.attr('style', 'background: #00f2ad !important; color: #0f172a !important; border: none !important; font-weight: bold !important;');
            } else if (!$btn.hasClass('disabled')) {
              $btn.attr('style', 'background: rgba(255, 255, 255, 0.1) !important; color: #ffffff !important; border: 1px solid rgba(255,255,255,0.2) !important;');
            } else {
              $btn.attr('style', 'color: rgba(255,255,255,0.3) !important; background: transparent !important;');
            }
          });

          // Asegurar botones de acción y vincular eventos para abrir modales
          $('.btn-icon.edit').attr('style', 'background-color: #00f2ad !important; color: #0f172a !important;');
          $('.btn-icon.edit').off('click').on('click', (e: any) => {
            e.stopPropagation(); // Evitar la navegación de la fila
            this.abrirModalEditar();
          });

          $('.btn-icon.delete').attr('style', 'background-color: #ef4444 !important; color: #ffffff !important;');
        }, 50);
      }
    });
  };


}
