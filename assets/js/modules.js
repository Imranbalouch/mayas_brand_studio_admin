document.title="Dashboard | Modules";
let PageNo = 1;
let PageSize = 10;
let totalRecord = 0;
let PageLength = 0;
let Search = '';
let keyupTimer;
let themeId = '';
let btnnew = $('#btn_new');
$(document).ready(function () {
    if (page_params.has('themeId')) {
        themeId = page_params.get('themeId');
    }
    btnnew.click(function (e) {
        e.preventDefault();
        let page = 'moduleadd';
        window.location.assign('?P='+page+'&M='+menu_id+'&themeId='+themeId);
    });
    Onload();
});
function Onload() {
    $('#Table_View').DataTable().clear().destroy();
    $('#buttons').html('');
    $.ajax({
        url: ApiCms + '/theme/modules',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", modulesPermission);
            xhr.setRequestHeader("theme-id", themeId);
            imgload.show();
        },
        success: function (response) {
            if (response.status_code == 200) {
                imgload.hide();
                let action_button = '';
                //New
                if (Boolean(response.permissions["add"])) {
                    btnnew.show();
                }

                //Update 
                if (Boolean(response.permissions["edit"])) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-edit' data-toggle='tooltip' title='Edit'>${getTranslation('edit')}</a>`;
                }

                if (Boolean(response.permissions["edit"])) {
                    action_button += '|';
                }

                //Update 
                // if (Boolean(response.permissions["edit"])) {
                //     action_button += `<a href='javascript:;' class='modify_btn btn-details' data-toggle='tooltip' title='details'>${getTranslation('details')}</a>`;
                // }

                // if (Boolean(response.permissions["edit"]) && Boolean(response.permissions["delete"])) {
                //     action_button += '|';
                // }
                // //Delete
                if (Boolean(response.permissions["delete"])) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-delete' data-toggle='tooltip' title='Delete'>${getTranslation('delete')}</a>`;
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
                            data: 'name',
                            render: function (data, type, row) {
                                if (type === 'display') {
                                    newBtnHF = '';
                                    if (row.moduletype != "api") {
                                        newBtnHF = `| <a href='javascript:;' class='modify_btn btn-details' data-toggle='tooltip' title='details'>${getTranslation('details')}</a>`;
                                    }
                                    return `<span class="name-only">${data}</span>
                                            <div class="modify_row">${action_button + newBtnHF}</div>`;
                                } else {
                                    return data;
                                }
                            } 
                        },
                        { data: 'shortkey' }, 
                        { data: 'status', 
                            render: function (data, type, row) {
                                if (data == true) {
                                    return `
                                    <label class="switch">
                                        <input type="checkbox" ${Boolean(response.permissions["update"]) ? '' : 'disabled'} checked class="switch-input" onchange="changestatus(this)" value="${row.uuid}" role="switch" id="switch1">
                                        <span class="switch-toggle-slider">
                                        <span class="switch-on"></span>
                                        <span class="switch-off"></span>
                                        </span> 
                                    </label>`
                                } else {
                                    return `<label class="switch">
                                        <input type="checkbox" ${Boolean(response.permissions["update"]) ? '' : 'disabled'} class="switch-input" onchange="changestatus(this)" value="${row.uuid}" role="switch" id="switch1">
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
                    makeDataTable('#Table_View', tableData, columnsConfig, { 
                        showButtons: true, 
                        pdf: true, 
                        excel: true, 
                        csv: false, 
                        print: true, 
                        copy: false 
                    });

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
            showToast(xhr.responseJSON.message, 'Error', 'error');
        }
    })
    return true;
}

$(document).on('click', '.btn-edit', function (e) {
    e.preventDefault();
    $("#popup_title").html(getTranslation("modify_module"));
    let currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    let data = $('#Table_View').DataTable().row(currentRow).data();
    let uuid = data['uuid'];
    let page = 'moduleedit';  
    window.location.assign('?P='+page+'&M='+menu_id+'&themeId='+themeId+'&id='+uuid);
});

$(document).on('click', '.btn-details', function (e) {
    e.preventDefault();
    $("#popup_title").html(getTranslation("modify_module"));
    let currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    let data = $('#Table_View').DataTable().row(currentRow).data();
    let uuid = data['uuid'];
    let page = 'moduledetails';  
    window.location.assign('?P='+page+'&M='+menu_id+'&themeId='+themeId+'&id='+uuid);
});



function changestatus(el){
    if(el.checked){
        var status = 1;
    }
    else{
        var status = 0;
    }
    $.ajax({
        url: ApiCms + "/theme/module/status/"+$(el).val(),
        type: "POST",
        data: {status:status},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (data) {
            imgload.hide();
            showToast(data.message, 'Success', 'success','self');
        },
        error: function (xhr, status, err) {
            imgload.hide();
            showToast(xhr.responseJSON.message, 'Error', 'error');
        }
    })
}

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
                url: ApiCms + "/theme/module/delete/"+uuid,
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
                        showToast(data.message, 'Success', 'success');
                        Onload();
                    }
                },
                error: function (xhr, status, err) {
                    imgload.hide();
                    showToast(xhr.responseJSON.message, 'Error', 'error');
                }
            });
        }
    });
});