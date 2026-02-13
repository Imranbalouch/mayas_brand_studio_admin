document.title="Dashboard | Themes";
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
        let page = 'themeadd';  
        window.location.assign('?P='+page+'&M='+menu_id);
    });
    
    Onload();
});
function Onload() {
    $('#Table_View').DataTable().clear().destroy();
    $('#buttons').html('');
    $.ajax({
        url: ApiCms + '/themes',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            xhr.setRequestHeader("widget-uuid", widgetPermission);
            xhr.setRequestHeader("module-uuid", modulesPermission);
            xhr.setRequestHeader("formbuilder-uuid", formbuilderPermission);
            imgload.show();
        },
        success: function (response) {

            if (response.status_code == 200) {
                let action_button = '';
                //New
                if (Boolean(response.permissions['add'])) {
                    btnnew.show();
                }

                //Update 
                if (Boolean(response.permissions["edit"])) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-edit' data-toggle='tooltip' title='Edit'>${getTranslation('edit')}</a>`;
                }
                if ((Boolean(response.permissions["edit"]) && Boolean(response.permissions["delete"])) || 
                    (Boolean(response.permissions["edit"]) && (Boolean(response.widgetpermission["view"]) || Boolean(response.widgetpermission["viewglobal"]))) ||
                    (Boolean(response.permissions["edit"]) && (Boolean(response.modulepermission["view"]) || Boolean(response.modulepermission["viewglobal"]))) ||
                    (Boolean(response.permissions["edit"]) && (Boolean(response.formbuilderpermission["view"]) || Boolean(response.formbuilderpermission["viewglobal"])))
                ) {
                    action_button += '|';
                }
                // //Delete
                if (Boolean(response.permissions["delete"])) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-delete' data-toggle='tooltip' title='Delete'>${getTranslation('delete')}</a>`;
                }

                if (Boolean(response.permissions["delete"]) || 
                    (Boolean(response.permissions["delete"]) && (Boolean(response.widgetpermission["view"]) || Boolean(response.widgetpermission["viewglobal"]))) ||
                    (Boolean(response.permissions["delete"]) && (Boolean(response.modulepermission["view"]) || Boolean(response.modulepermission["viewglobal"]))) ||
                    (Boolean(response.permissions["delete"]) && (Boolean(response.formbuilderpermission["view"]) || Boolean(response.formbuilderpermission["viewglobal"])))
                ){
                    action_button += '|';
                }

                //widgetpermission
                if ((Boolean(response.widgetpermission["view"]) || Boolean(response.widgetpermission["viewglobal"]))) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-widgets' data-toggle='tooltip' title='Widgets'>${getTranslation('Widgets')}</a>`;
                }

                if ((Boolean(response.widgetpermission["view"]) || Boolean(response.widgetpermission["viewglobal"])) || 
                ((Boolean(response.widgetpermission["view"]) || Boolean(response.widgetpermission["viewglobal"])) && Boolean(response.permissions["delete"])) ||
                ((Boolean(response.widgetpermission["view"]) || Boolean(response.widgetpermission["viewglobal"])) && Boolean(response.permissions["edit"])) ||
                ((Boolean(response.widgetpermission["view"]) || Boolean(response.widgetpermission["viewglobal"])) && (Boolean(response.modulepermission["view"]) || Boolean(response.modulepermission["viewglobal"]))) ||
                ((Boolean(response.widgetpermission["view"]) || Boolean(response.widgetpermission["viewglobal"])) && (Boolean(response.formbuilderpermission["view"]) || Boolean(response.formbuilderpermission["viewglobal"])))) {
                    action_button += '|'
                }

                if (Boolean(response.modulepermission["view"]) || Boolean(response.modulepermission["viewglobal"])) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-modules' data-toggle='tooltip' title='modules'>${getTranslation('modules')}</a>`;
                }

                if (
                    (Boolean(response.modulepermission["view"]) || Boolean(response.modulepermission["viewglobal"])) || 
                    ((Boolean(response.modulepermission["view"]) || Boolean(response.modulepermission["viewglobal"])) && Boolean(response.permissions["delete"])) ||
                    ((Boolean(response.modulepermission["view"]) || Boolean(response.modulepermission["viewglobal"])) && Boolean(response.permissions["edit"])) ||
                    ((Boolean(response.modulepermission["view"]) || Boolean(response.modulepermission["viewglobal"])) && (Boolean(response.widgetpermission["view"]) || Boolean(response.widgetpermission["viewglobal"]))) ||
                    ((Boolean(response.modulepermission["view"]) || Boolean(response.modulepermission["viewglobal"])) && (Boolean(response.formbuilderpermission["view"]) || Boolean(response.formbuilderpermission["viewglobal"])))
                ) {
                    action_button += '|';
                }

                if (Boolean(response.formbuilderpermission["view"]) || Boolean(response.formbuilderpermission["viewglobal"])) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-formbuilder' data-toggle='tooltip' title='formbuilder'>${getTranslation('formbuilder')}</a>`;
                }

                if (Boolean(response.permissions["edit"]) || 
                    Boolean(response.permissions["delete"]) || 
                    (Boolean(response.modulepermission["view"]) || Boolean(response.modulepermission["viewglobal"])) || 
                    (Boolean(response.formbuilderpermission["view"]) || Boolean(response.formbuilderpermission["viewglobal"])) ||
                    (Boolean(response.widgetpermission["view"]) || Boolean(response.widgetpermission["viewglobal"]))
                    ) {
                    action_button += '|';
                }

                action_button += `<a href='javascript:;' class='modify_btn btn-view' data-toggle='tooltip' title='view'>${getTranslation('View')}</a>`;
                
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
                                    return `<span class="name-only">${data}</span>
                                            <div class="modify_row">${action_button}</div>`;
                                } else {
                                    return data;
                                }
                            } 
                        }, 
                        { 
                            data: 'status', 
                            render: function (data, type, row) {
                                // Check for update permission
                                const hasUpdatePermission = Boolean(response.permissions["update"]);
                                
                                if (data == true) {
                                    return `<label class="switch">
                                        <input type="checkbox" 
                                            checked 
                                            class="switch-input" 
                                            ${!hasUpdatePermission ? 'disabled' : ''} 
                                            onchange="changestatus(this)" 
                                            value="${row.uuid}" 
                                            role="switch" 
                                            id="switch1">
                                        <span class="switch-toggle-slider">
                                            <span class="switch-on"></span>
                                            <span class="switch-off"></span>
                                        </span> 
                                    </label>`
                                } else { 
                                    return `<label class="switch">
                                        <input type="checkbox" 
                                            class="switch-input" 
                                            ${!hasUpdatePermission ? 'disabled' : ''} 
                                            onchange="changestatus(this)" 
                                            value="${row.uuid}" 
                                            role="switch" 
                                            id="switch1">
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
                        showButtons: false, 
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
                showToast(response.message, 'warning', 'warning');
            }

        },
        error: function(xhr, status, err) {
            imgload.hide();
            let errorMessage = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'An unknown error occurred';
            showToast(errorMessage, 'Error', 'error');
        } 
    })
    return true;
}

// view
$(document).on('click', '.btn-view', function (e) {
    e.preventDefault();
    let currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    let data = $('#Table_View').DataTable().row(currentRow).data();
    let theme_path = data['theme_path']; 
    if (data['theme_type'] == 1) {
        if (data['pages'].length > 0) {
            window.open(`${ApiCms}/page/show/${data['pages'][0]['slug']}`);
            return true;
        }else{
            showToast('Please select a page to set as default.', 'Error', 'error');
            return false;
        }
    }else{
        if (data['pages'].length > 0) {
            window.open(ThemeView);
        }else{
            showToast("Please select a page to set as default.", 'Error', 'error');
            return false;
        }
    }
    
});

//edit theme
$(document).on('click', '.btn-edit', function (e) {
    e.preventDefault();
    $("#popup_title").html(getTranslation("modify_menu"));
    let currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    let data = $('#Table_View').DataTable().row(currentRow).data();
    let uuid = data['uuid'];
    let page = 'themeedit';  
    window.location.assign('?P='+page+'&M='+menu_id+'&id='+uuid);
});

//delete
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
        confirmButtonText: getTranslation('delete'),
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
                url: ApiCms + "/theme/delete/"+uuid,
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
                        showToast(data.message, 'Success', 'success', 'self');
                    }
                },
                error: function (xhr, status, err) {
                    imgload.hide();
                    showToast(xhr.responseJSON.message, 'Error', 'error');
                }
            })
        }
    });
});

function changestatus(el){
    if(el.checked){
        var status = 1;
    }
    else{
        var status = 0;
    }
    $.ajax({
        url: ApiCms + "/theme/status/"+$(el).val(),
        type: "POST",
        data: {status:status},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (data) {
            imgload.hide();
            localStorage.setItem('theme_id', data.theme_id);
            showToast(data.message, 'success', 'success');
            Onload();
        },
        error: function(xhr, status, err) {
            imgload.hide();
            let errorMessage = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'An unknown error occurred';
            showToast(errorMessage, 'Error', 'error');
        }   
    })
}


//Widgets
$(document).on('click', '.btn-widgets', function (e) {
    e.preventDefault();
    $("#popup_title").html(getTranslation("modify_menu"));
    let currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    let data = $('#Table_View').DataTable().row(currentRow).data();
    let uuid = data['uuid'];
    let page = 'widgets';  
    window.location.assign('?P='+page+'&M='+menu_id+'&themeId='+uuid);
});

//Modules
$(document).on('click', '.btn-modules', function (e) {
    e.preventDefault();
    $("#popup_title").html(getTranslation("modify_modules"));
    let currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    let data = $('#Table_View').DataTable().row(currentRow).data();
    let uuid = data['uuid'];
    let page = 'modules';  
    window.location.assign('?P='+page+'&M='+menu_id+'&themeId='+uuid);
});
$(document).on('click', '.btn-formbuilder', function (e) {
    e.preventDefault();
    $("#popup_title").html(getTranslation("modify_modules"));
    let currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    let data = $('#Table_View').DataTable().row(currentRow).data();
    let uuid = data['uuid'];
    let page = 'formbuilder';  
    window.location.assign('?P='+page+'&M='+menu_id+'&themeId='+uuid);
});