document.title="Dashboard | Activity Logs Report";
let PageNo = 1;
let PageSize = 10;
let totalRecord = 0;
let PageLength = 0;
let Search = '';
let keyupTimer;
$(document).ready(function () {
    Onload();
});
function Onload() {
    $('#Table_View').DataTable().clear().destroy();
    $('#buttons').html('');
    
    var table = $('#Table_View').DataTable({
        processing: false,
        serverSide: true,
        ajax: {
            url: ApiForm + '/activity_report',
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                xhr.setRequestHeader("menu-uuid", menu_id);
                imgload.show();
            },
            dataSrc: function(response) {
                imgload.hide();            
                if (response.status_code === 200) {
                    // Show/hide new and update buttons based on permissions
                    if (response["new"] == 1) btnnew.show();
                    let action_button = '';

                    // Action buttons for Edit and Delete
                    if (response["update"] == 1) {
                        action_button += `<a href='javascript:;' class='modify_btn btn-edit' data-toggle='tooltip' title='Edit'>${getTranslation('edit')}</a>|`;
                    }
                    if (Boolean(response["delete"])) {
                        action_button += `<a href='javascript:;' class='modify_btn btn-delete' data-toggle='tooltip' title='Delete'>${getTranslation('delete')}</a>`;
                    }

                    return response.data.data; // Extract data for DataTables
                } else {
                    Swal.fire({
                        title: response.message,
                        icon: 'warning',
                        showConfirmButton: true,
                        showClass: { popup: 'animated fadeInDown faster' },
                        hideClass: { popup: 'animated fadeOutUp faster' }
                    });
                    return [];
                }
            },
            error: function(xhr, status, err) {
                imgload.hide();
                let errorMessage = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'An unknown error occurred';
                showToast(errorMessage, 'Error', 'error');
            }            
        },
        columns: [
            {
                data: null,
                render: function(data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                },
                title: '#'
            },
            {
                data: 'log_name',
                render: function(data) {
                    return data ? data.charAt(0).toUpperCase() + data.slice(1) : '';
                }
            },
            { data: 'event' },
            { data: 'causer_name' },
            {
                data: 'created_at',
                render: function(data) {
                    return new Date(data).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });
                }
            },
        ],
        lengthMenu: [10, 25, 50, 100],
        pageLength: 12, // Default page length
        order: [[4, 'desc']], // Default sort by created_at
        dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>" +
                "<'row'<'col-sm-12'B>>",   
         buttons: [
        {
          extend: 'collection',
          className: 'btn btn-primary dropdown-toggle float-end  mb-0 waves-effect waves-light',
          text: '<i class="ri-upload-2-line me-2"></i>Export',
          buttons: [
            {
              extend: 'print',
              text: '<i class="ri-printer-line me-1" ></i>Print',
              className: 'dropdown-item',
              exportOptions: { columns: [1, 2, 3, 4] }
            },
            {
              extend: 'csv',
              text: '<i class="ri-file-text-line me-1" ></i>Csv',
              className: 'dropdown-item',
              exportOptions: { columns: [1, 2, 3, 4] }
            },
            {
              extend: 'excel',
              text: '<i class="ri-file-excel-line me-1"></i>Excel',
              className: 'dropdown-item',
              exportOptions: { columns: [1, 2, 3, 4] }
            },
            {
              extend: 'pdf',
              text: '<i class="ri-file-pdf-line me-1"></i>Pdf',
              className: 'dropdown-item',
              exportOptions: { columns: [1, 2, 3, 4] }
            },
            {
              extend: 'copy',
              text: '<i class="ri-file-copy-line me-1" ></i>Copy',
              className: 'dropdown-item',
              exportOptions: { columns: [1, 2, 3, 4] }
            }
          ]
        }
      ],
      // For responsive popup
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'Details of ' + data['log_name'];
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                ? '<tr data-dt-row="' +
                    col.rowIndex +
                    '" data-dt-column="' +
                    col.columnIndex +
                    '">' +
                    '<td>' +
                    col.title +
                    ':' +
                    '</td> ' +
                    '<td>' +
                    col.data +
                    '</td>' +
                    '</tr>'
                : '';
            }).join('');

            return data ? $('<table class="table"/><tbody />').append(data) : false;
          }
        }
      }
    });
      table.buttons().container().appendTo('#export_buttons');    
}
