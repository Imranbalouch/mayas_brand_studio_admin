document.title="Dashboard | Pages";
let PageNo = 1;
let PageSize = 10;
let totalRecord = 0;
let PageLength = 0;
let Search = '';
let keyupTimer;
$(document).ready(function () {
    btnnew = $('#btn_new');
    btnnew.hide();
    btnnew.click(function (e) {
        e.preventDefault();
        let page = 'pageadd';
        window.location.assign('?P='+page+'&M='+menu_id+'&themeId='+theme_id);
    });
    Onload();
});

function Onload() {
    $('#Table_View').DataTable().clear().destroy();
    $('#buttons').html('');
    $.ajax({
        url: ApiCms + '/pages',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            xhr.setRequestHeader("theme-id", theme_id);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                let action_button = '';
                //New
                if (Boolean(response.permissions["add"])) {
                    btnnew.show();
                }
                //Update 
                if (Boolean(response.permissions["edit"])) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-edit table_buttons' data-toggle='tooltip' title='Edit'><i class="ri-edit-box-line text-warning"></i>${getTranslation('edit')}</a>`;
                }
                if (Boolean(response.permissions["edit"]) && Boolean(response.permissions["delete"])) {
                    action_button += '|';
                }
                if (Boolean(response.permissions["delete"])) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-delete table_buttons' data-toggle='tooltip' title='Delete'><i class="ri-delete-bin-7-line  text-danger  cursor-pointer"></i>${getTranslation('delete')}</a>`;
                }
                
                if (response["data"] != null) {
                    
                     // Ajax Data Settings
                     const columnsConfig = [ 
                        {
                            data: null, // No data source
                            render: function(data, type, row, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1; // Serial number
                            },
                            title: '#', // AUTO Serial number Column
                        // orderable: false // Disable sorting on this column
                        },
                        { 
                            data: 'title',
                            render: function (data, type, row) {
                                if (type === 'display') {
                                    return `<span class="name-only">${data}</span>
                                            <div class="modify_row">${action_button}</div>`;
                                } else {
                                    return data;
                                }
                            } 
                        },
                        { data: 'slug' }, 
                        { data: 'status', 
                            render: function (data, type, row) {
                                if (data == true) {
                                    return `
                                    <label class="switch">
                                        <input type="checkbox" checked class="switch-input" ${Boolean(response.permissions["update"]) ? '' : 'disabled'} onchange="changestatus(this)" value="${row.uuid}" role="switch" id="switch1">
                                        <span class="switch-toggle-slider">
                                        <span class="switch-on"></span>
                                        <span class="switch-off"></span>
                                        </span> 
                                    </label>`
                                } else {
                                    return `<label class="switch">
                                        <input type="checkbox" class="switch-input" ${Boolean(response.permissions["update"]) ? '' : 'disabled'} onchange="changestatus(this)" value="${row.uuid}" role="switch" id="switch1">
                                        <span class="switch-toggle-slider">
                                        <span class="switch-on"></span>
                                        <span class="switch-off"></span>
                                        </span> 
                                    </label>`;
                                }
                        }, 
                        orderable: false
                    },

                    { data: 'default_page', 
                        render: function (data, type, row) {
                            if (data == true) {
                                return `
                                <label class="switch">
                                    <input type="checkbox" checked class="switch-input" ${Boolean(response.permissions["update"]) ? '' : 'disabled'} onchange="changedefault(this)" value="${row.uuid}" role="switch" id="switch2">
                                    <span class="switch-toggle-slider">
                                    <span class="switch-on"></span>
                                    <span class="switch-off"></span>
                                    </span> 
                                </label>`
                            } else {
                                return `<label class="switch">
                                    <input type="checkbox" class="switch-input" ${Boolean(response.permissions["update"]) ? '' : 'disabled'} onchange="changedefault(this)" value="${row.uuid}" role="switch" id="switch2">
                                    <span class="switch-toggle-slider">
                                    <span class="switch-on"></span>
                                    <span class="switch-off"></span>
                                    </span> 
                                </label>`;
                            }
                    },
                    orderable: false    
                    
                }
                    ];
                    tableData= response["data"];
                     $('#Table_View').DataTable({
                            data: tableData,
                            columns: columnsConfig,
                            responsive: {
                                details: {
                                    display: $.fn.dataTable.Responsive.display.modal({
                                        header: function (row) {
                                            var data = row.data();
                                            // Construct full name from customer object
                                            var title = data.title  ? data.title  : 'Unknown title';
                                            return 'Details of ' + title;
                                        }
                                    }),
                                    type: 'column',
                                    renderer: function (api, rowIdx, columns) {
                                        var data = $.map(columns, function (col, i) {
                                            return col.title !== '' 
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
                            },
                            destroy: true
                        });
                    imgload.hide();

                }
            } else if (response.statusCode == 404) {
                imgload.hide();
                $("#Table_View").DataTable({
                    destroy: true,
                    retrieve: true,
                    ordering: false,
                    dom: "lrt",
                    bLengthChange: false,
                    oLanguage: {
                        sEmptyTable:
                            `<img class='dataTable-custom-empty-icon' src='/images/no-record-found.svg'><br>${tbNoFound}`,
                    },
                });
            }
            else {
                imgload.hide();
                showToast(response.message, 'Warning', 'warning');
            }

        },
        error: function (xhr, status, err) {
            imgload.hide();
            showToast(xhr.responseJSON.message, 'Error', 'error');
        }
    })
    return true;
}

// delete
$(document).on('click', '.btn-delete', function (e) {
    e.preventDefault();
    let currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    let data = $('#Table_View').DataTable().row(currentRow).data();
    let uuid = data['uuid'];
    Swal.fire({
        title: getTranslation('deleteConfirmMsg'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: getTranslation('cancel'),
        confirmButtonColor: '#15508A',
        cancelButtonColor: '#15508A',
        confirmButtonText:  getTranslation('delete'),
        reverseButtons: true, 
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ApiCms + "/page/delete/"+uuid,
                type: "delete",
                data: {},
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("menu-uuid", menu_id);
                    imgload.show();
                },
                success: function (data) {
                    imgload.hide();
                        if (data.status_code == 200) {
                        showToast(data.message, 'Success', 'success','self');
                    }
                },
                error: function (xhr, status, err) {
                    imgload.hide();
                    showToast('Error', 'Error', 'error');
                }
            });
        }
    });
});

//edit page
$(document).on('click', '.btn-edit', function (e) {
    e.preventDefault();
    $("#popup_title").html(getTranslation("modify_menu"));
    let currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    let data = $('#Table_View').DataTable().row(currentRow).data();
    let uuid = data['uuid'];
    let page = 'pageedit';  
    window.location.assign('?P='+page+'&M='+menu_id+'&id='+uuid);
});



function changestatus(el){
    if(el.checked){
        var status = 1;
    }
    else{
        var status = 0;
    }
    $.ajax({
        url: ApiCms + "/page/status/"+$(el).val(),
        type: "POST",
        data: {status:status},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (data) {
            imgload.hide();
            showToast(data.message, 'success', 'success');
            Onload();
        },
        error: function (xhr, status, err) {
            imgload.hide();
            showToast("Error", '', 'error','self');
        }
    })
}


function changedefault(el){
    if(el.checked){
        var status = 1;
    }
    else{
        var status = 0;
    }
    $.ajax({
        url: ApiCms + "/page/default/"+$(el).val(),
        type: "POST",
        data: {default:status},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (data) {
            imgload.hide();
            showToast(data.message, 'success', 'success');
            Onload();
        },
        error: function (xhr, status, err) {
            imgload.hide();
            if (xhr.status === 422) {
                // Validation error
                let errors = xhr.responseJSON.errors;
                errors = JSON.parse(errors);
                let errorMessages = "";

                // Iterate over all errors and concatenate them
                $.each(errors, function (field, messages) {
                    messages.forEach(function (message) {
                        errorMessages += `<li>${message}</li>`; // Append each error message
                    });
                });
                let htmlError = `<ul>${errorMessages}</ul>`;
                showToast(htmlError, 'Warning', 'warning');
            } else {
                // Handle other errors
                showToast(xhr.responseJSON.message, 'Error', 'error');
            }
        }
    })
}
