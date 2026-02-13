document.title="Dashboard | Languages";
var PageNo = 1;
var PageSize = 10;
var totalRecord = 0;
var PageLength = 0;
var Search = '';
let keyupTimer;
var btnupd = $('#btn_upd');
var btnsav = $('#btn_sav');
var txtid = $('#txt_id');
var btnnew=$('#btn_new');
let translations=[]; 
var icon ="";
 $(document).ready(function() {  
    Onload();
    $('#FileUploadSingle').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgSrc = e.target.result;
                const fileName = file.name;
                const fileExt = fileName.split('.').pop();
                const fileNameCrop = fileName.split('.')[0].length >= 7 
                    ? fileName.split('.')[0].slice(0, 7) + '...' 
                    : fileName.split('.')[0];

                // Clear existing preview
                $('#FileUploadSingle').parents(".form-group").find(".file-preview-imgs").html(`
                    <div class="preview-card">
                        <div class="img">
                            <img src="${imgSrc}" alt="">
                            <span class="remove"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg></span>
                        </div>
                        <div class="card-info">
                            <div class="card-name">${fileNameCrop}.${fileExt}</div>
                        </div>
                    </div>
                `);

                // Add remove functionality for the new preview
                $('#FileUploadSingle').parents(".form-group").find(".file-preview-imgs .preview-card .remove").on("click", function(e) {
                    e.preventDefault();
                    $(this).parent().parent().remove();
                    $('#FileUploadSingle').val("");
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // Event listener for FileUploadSingle_add in add modal
    $('#FileUploadSingle_add').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgSrc = e.target.result;
                const fileName = file.name;
                const fileExt = fileName.split('.').pop();
                const fileNameCrop = fileName.split('.')[0].length >= 7 
                    ? fileName.split('.')[0].slice(0, 7) + '...' 
                    : fileName.split('.')[0];

                // Clear existing preview
                $('#FileUploadSingle_add').parents(".form-group").find(".file-preview-imgs").html(`
                    <div class="preview-card">
                        <div class="img">
                            <img src="${imgSrc}" alt="">
                            <span class="remove"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg></span>
                        </div>
                        <div class="card-info">
                            <div class="card-name">${fileNameCrop}.${fileExt}</div>
                        </div>
                    </div>
                `);

                // Add remove functionality for the new preview
                $('#FileUploadSingle_add').parents(".form-group").find(".file-preview-imgs .preview-card .remove").on("click", function(e) {
                    e.preventDefault();
                    $(this).parent().parent().remove();
                    $('#FileUploadSingle_add').val("");
                });
            };
            reader.readAsDataURL(file);
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
        url: ApiForm + "/status_language/"+$(el).val(),
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
            showToast(data.message, 'Success', 'success', 'self');
        },
        error: function (xhr, status, err) {
            imgload.hide();
            showToast("Error", '', 'error' );
        }
    })
}

 $("#searchFieldForDatatable").on("keyup", function () {
    clearTimeout(keyupTimer);
    PageNo = 1
    Search = this.value;
    if (Search.length >= 3 || Search.length == 0) {
        keyupTimer = setTimeout(() => { 
          detailsTableBody.search(this.value).draw();
        }, 1000);
    }
});
$("#cmb_limit").on("change", function () {
    clearTimeout(keyupTimer); 
    PageSize = this.value;
    $('#Table_View').DataTable().clear().destroy(); 
    if (PageSize.length != 0) {
        keyupTimer = setTimeout(() => {
          Onload(); 
        }, 1000);
    }
});
$("#cmb_status").on("change", function () {
    imgload.show(); 
    clearTimeout(keyupTimer); 
    Search = this.value; 
    if (Search.length != 0) {
        keyupTimer = setTimeout(() => { 
          detailsTableBody.column(2).search("^" + Search + "$", true, false).draw();
        }, 1000);
    }else{
        Onload(); 
    }
    imgload.hide(); 
});  
function discon(){
    document.getElementById('create_form').reset();
    btnsav.hide();
    btnupd.hide();  
    $('#ck_active').prop('checked');
    txtid.html('');   

    $('#FileUploadSingle_add').val('');
    $('#FileUploadSingle_add').parents(".form-group").find(".file-preview-imgs").html('');

    $('#FileUploadSingle').val('');
    $('#FileUploadSingle').parents(".form-group").find(".file-preview-imgs").html('');

    Onload();
    imgload.hide();
}
   function Onload() { 
    $('#Table_View').DataTable().clear().destroy();
    $('#buttons').html('');
  //PageSize=10;
    $.ajax({
        url: ApiForm + '/get_language',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        headers: {"Authorization": "Bearer "+strkey,'menu-uuid':menu_id},
        //menu_id:_menuid,
        
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey); 
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (response) {
            console.log(response);
            if (response.status_code == 200) {
                let action_button = '';
                let switch_button = '';
                //New
                if (Boolean(response.permissions['add'])) {
                    btnnew.show();
                }

                //Update 
                if (Boolean(response.permissions["edit"])) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-edit' data-toggle='tooltip' title='Edit'>${getTranslation('edit')}</a> | `;

                }

                // //Delete
                if (Boolean(response.permissions["delete"])) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-delete' data-toggle='tooltip' title='Delete'>${getTranslation('delete')}</a> `;
                }

                if (Boolean(response.permissions["update"])) {
                    switch_button = '';
                }else{
                    switch_button = 'disabled';
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
                                    return `<span class="name-only">${data}</span>
                                            <div class="modify_row">${action_button}</div>`;
                                } else {
                                    return data;
                                }
                            } 
                        },
                        { data: 'code',
                            render: function (data, type, row) {
                                 return data;
                            } 
                        }, 
                        { data: 'status', 
                            render: function (data, type, row) {
                                if (data == true) {
                                    return `<label class="switch">
                                        <input type="checkbox" ${switch_button} checked class="switch-input" onchange="changestatus(this)" value="${row.uuid}" role="switch" id="switch1">
                                        <span class="switch-toggle-slider">
                                        <span class="switch-on"></span>
                                        <span class="switch-off"></span>
                                        </span> 
                                    </label>`
                                    } else { 
                                    return `<label class="switch">
                                    <input type="checkbox" ${switch_button} class="switch-input" onchange="changestatus(this)" value="${row.uuid}" role="switch" id="switch1">
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
            }else if (response.statusCode == 404) {
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
        error: function (xhr, status, err) {
            imgload.hide();
            if (xhr.status == 401) {
                showToast(err, 'error', 'error');
            }else{
                showToast('Error', 'error', 'error');
            }
        }
    })
    return true;
}
 
/// ADD NEW RECORD START
$(document).on("click", '#btn_new', function () {
    $('#add_Modal').modal('show');
    $("#popup_title_add").html(getTranslation("add_new"));
    discon(); 
    btnsav.show();
    imgload.hide(); 
});
/// ADD NEW RECORD END


/// SAVE NEW RECORD START

function save_record() {
    var ck = ckvalidationAdd();
    if (ck == 1) { return; } 
    var cre = ck.add_creteria; 
    Swal.fire({
        title: getTranslation('addConfirmMsg'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: getTranslation('cancel'),
        confirmButtonColor: '#15508A',
        cancelButtonColor: '#15508A',
        confirmButtonText: getTranslation('Add'),
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ApiForm + '/add_language',
                type: "Post",
                processData: false,
                contentType: false,
                data: cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey); 
                    xhr.setRequestHeader("menu-uuid", menu_id); 
                    imgload.show();
                    btnsav.hide(); 
                },
                success: function (response) { 
                    if (response.status_code == 201) { 
                        imgload.hide();
                        discon(); 
                        btnsav.show();
                        $('#add_Modal').modal('hide');
                        showToast(response.message, 'Success', 'success');
                    }  
                },
                error: function (xhr, status, err) {  
                    imgload.hide();
                    btnupd.show();
                    const data = xhr.responseJSON.errors;
                    //console.log(xhr.responseJSON.message);
                    var title = xhr.responseJSON.status_code == 404 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + xhr.responseJSON.message + "' target='_blank'>" + " " + xhr.responseJSON.message + "</a>" : xhr.responseJSON.message;
                    showToast(title, 'Error', 'error');
                }
            })

        }
    })
}
/// SAVE NEW RECORD END

/// EDIT RECORD START
$(document).on('click', '.btn-edit', function (e) {
    e.preventDefault();
    $("#popup_title").html(getTranslation("modify_language"));
    var currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var id = data['uuid'];
    var page = 'languageedit';  
    $.ajax({
        url: ApiForm + '/edit_language/'+id,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            xhr.setRequestHeader("Id", id);
            btnupd.hide(); 
            imgload.show();  
        }, 
        success: function (response) {
            if (response.status_code == 200) { 
                 
                 if(response["data"]['flag']!==null && response["data"]['flag'].trim() !== ''){ 
                    icon=AssetsPath+response["data"]['flag']; 
                } 
                if(icon !== null && icon !== undefined && icon.trim() !== ''){ 
                var filenameWithExtension = icon.split('/').pop();
                var [filename, extension] = filenameWithExtension.split('.'); 
                var fileNameCrop = filename; 
                var fileExt=extension; 
                 $('#FileUploadSingle').parents(".form-group").find(".file-preview-imgs").html(`
                    <div class="preview-card">
                      <div class="img">
                        <img src="${icon}" alt="">
                        <span class="remove"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg></span>
                      </div>
                      <div class="card-info">
                        <div class="card-name">${fileNameCrop.length >= 7 ? fileNameCrop.slice(0, 7).replace(/\.[^/.]+$/, "")+"... " : fileNameCrop.replace(/\.[^/.]+$/, "")}.${fileExt}</div>
                        
                      </div>
                    </div>
                  `);
                  $('#FileUploadSingle').parents(".form-group").find(".file-preview-imgs .preview-card .remove").on("click", function(e1){
                    e1.preventDefault();
                    $(this).parent().parent().remove();
                    $('#FileUploadSingle').val("");
                  });
                } 
                $('#edit_Modal').modal('show'); 
                $('#txt_id').val(response["data"]["uuid"]);
                $('#txt_name').val(response["data"]["name"]); 
                $('#txt_code').val(response["data"]["code"]); 
                $('#txt_app_language_code').val(response["data"]["app_language_code"]); 
                if (response["data"]["is_admin_default"] != "1") { 
                    $('#ck_is_admin_default').prop('checked',false);
                }else if (response["data"]["is_admin_default"] == "1") { 
                    $('#ck_is_admin_default').prop('checked',true);
                }
                if (response["data"]["is_default"] != "1") { 
                    $('#ck_is_default').prop('checked',false);
                }else if (response["data"]["is_default"] == "1") { 
                    $('#ck_is_default').prop('checked',true);
                }
                if (response["data"]["rtl"] != "1") { 
                    $('#ck_rtl').prop('checked',false);
                }else if (response["data"]["rtl"] == "1") { 
                    $('#ck_rtl').prop('checked',true);
                }
                if (response["data"]["status"] != "1") { 
                    $('#ck_active').prop('checked',false);
                }else if (response["data"]["status"] == "1") { 
                    $('#ck_active').prop('checked',true);
                }
                imgload.hide(); 
                btnupd.show(); 
                validationHelper();
            }
            else {
                imgload.hide();
                var title = response.status_code == 405 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + response.message + "' target='_blank'>" + " " + response.message + "</a>" : response.message;
                showToast(title, 'Error', 'error');
            }

        },
        error: function (xhr, status, err) { 
            imgload.hide(); 
            showToast('Error', 'error', 'error');
        }

    }); 

});
//// EDIT RECORD END



//UPDATE RECORD START
function update_record() {
    var ck = ckvalidation();
   // return;
    //console.log(ck);
    if (ck == 1) { return; }
    var uuid = ck.uuid; 
    var cre = ck.creteria; 
    Swal.fire({
        title: getTranslation('editConfirmMsg'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: getTranslation('cancel'),
        confirmButtonColor: '#15508A',
        cancelButtonColor: '#15508A',
        confirmButtonText: getTranslation('update'),
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ApiForm + '/update_language',
                type: "Post",
                processData: false,
                contentType: false,
                data: cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("menu-uuid", menu_id); 
                    xhr.setRequestHeader("uuid", uuid); 
                    imgload.show();
                    btnsav.hide();
                    btnupd.hide();
                },
                success: function (response) { 
                    if (response.status_code == 200) { 
                        imgload.hide();
                        discon(); 
                        btnupd.show();
                        $('#edit_Modal').modal('hide');
                        showToast(response.message, 'Success', 'success');
                    }  
                },
                error: function (xhr, status, err) {  
                    imgload.hide();
                    btnupd.show();
                    const data = xhr.responseJSON.errors;
                    //console.log(xhr.responseJSON.message);
                    var title = xhr.responseJSON.status_code == 404 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + xhr.responseJSON.message + "' target='_blank'>" + " " + xhr.responseJSON.message + "</a>" : xhr.responseJSON.message;
                    showToast(title, 'Error', 'error');
                }
            })

        }
    })

}
//UPDATE RECORD END

 // DELETE RECORD START
$(document).on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var id = data['uuid'];
    var name = data['name']; 
    Swal.fire({
        title: getTranslation('deleteConfirmMsg'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: getTranslation('cancel'),
        confirmButtonColor: '#15508A',
        cancelButtonColor: '#15508A',
        confirmButtonText:  getTranslation('delete'),
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ApiForm + '/delete_language/'+id,
                type: "Delete",
                contentType: "application/json",
                dataType: "json", 
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("menu-uuid", menu_id);
                    //xhr.setRequestHeader("Id", id);
                    imgload.show();
                },
                success: function (response) { 
                    if (response.status_code == 200) {
                        imgload.hide();
                        discon();
                        showToast(response.message, 'Success', 'success');
                    } 
                },
                error: function (xhr, status, err) {  
                    imgload.hide();
                    btnupd.show();
                    const data = xhr.responseJSON.errors;
                    //console.log(xhr.responseJSON.message);
                    var title = xhr.responseJSON.status_code == 404 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + xhr.responseJSON.message + "' target='_blank'>" + " " + xhr.responseJSON.message + "</a>" : xhr.responseJSON.message;
                    showToast(title, 'Error', 'error');
                }
            })
        }
    })
});
/// DELETE RECORD END

function ckvalidation() {
    var ck = 0, Error = ''; 
    var element='';
    var ck_rtl = $("#ck_rtl").is(":checked");
    var ck_is_default = $("#ck_is_default").is(":checked");
    var ck_is_admin_default = $("#ck_is_admin_default").is(":checked");
    var ckactive = $("#ck_active").is(":checked");
    var txtid = $('#txt_id').val(); 
    const formData = new FormData() 
        if ($('#txt_name').val() == '') {
            ck = 1;
            element=$('#txt_name'); 
            Error =  getTranslation('please_enter_name');
        }else if ($('#txt_code').val() == '') {
            ck = 1;
            element=$('#txt_code'); 
            Error =  getTranslation('please enter code');
        }else if ($('#txt_app_language_code').val() == '') {
            ck = 1;
            element=$('#txt_app_language_code'); 
            Error =  getTranslation('please enter app code');
        }
        

        if (Boolean(ck)) { 
            $(element).parents('.form-group').addClass('error');
            element.focus(); 
            Swal.fire({
                title: Error,
                icon: 'error'
            });
            return;
        }
        var icon=$('#FileUploadSingle').parents(".form-group").find('.file-preview-imgs .preview-card').length; 
        if ($('#FileUploadSingle').val() == '' && icon<=0) { 
            Error =  getTranslation('please_select_image');
            Swal.fire({
                title: Error,
                icon: 'error'
            });
            return;
        }else{
            
            if ($('#FileUploadSingle').val() !== ''){
                formData.append("flag", $('#FileUploadSingle')[0].files[0]) 
            }
            
        } 
    

  
    formData.append("name",$("#txt_name").val()) 
    formData.append("code", $('#txt_code').val())  
    formData.append("app_language_code", $('#txt_app_language_code').val())  
    formData.append("rtl", ck_rtl == true ? 1 : 0) 
    formData.append("is_default", ck_is_default == true ? 1 : 0) 
    formData.append("is_admin_default", ck_is_admin_default == true ? 1 : 0) 
    formData.append("status", ckactive == true ? 1 : 0)  
    return { uuid: txtid, creteria: formData };
}



/// Validation For Add new
function ckvalidationAdd() {
    var ck = 0, Error = ''; 
    var element='';
    var ck_rtl = $("#ck_rtl_add").is(":checked");
    var ck_is_default = $("#ck_is_default_add").is(":checked");
    var ck_is_admin_default = $("#ck_is_admin_default_add").is(":checked");
    var ckactive = $("#ck_active_add").is(":checked");
    const formData = new FormData() 

        if ($('#txt_name_add').val() == '') {
            ck = 1;
            element=$('#txt_name_add'); 
            Error =  getTranslation('please_enter_name');
        }else if ($('#txt_code_add').val() == '') {
            ck = 1;
            element=$('#txt_code_add'); 
            Error =  getTranslation('please enter code');
        }else if ($('#app_language_code_add').val() == '') {
            ck = 1;
            element=$('#app_language_code_add'); 
            Error =  getTranslation('please enter app code');
        }
        

        if (Boolean(ck)) { 
            $(element).parents('.form-group').addClass('error');
            element.focus(); 
            Swal.fire({
                title: Error,
                icon: 'error'
            });
            return;
        }
        var icon=$('#FileUploadSingle_add').parents(".form-group").find('.file-preview-imgs .preview-card').length; 
        if ($('#FileUploadSingle_add').val() == '' && icon<=0) { 
            Error =  getTranslation('please_select_image');
            Swal.fire({
                title: Error,
                icon: 'error'
            });
            return;
        }else{
            
            if ($('#FileUploadSingle_add').val() !== ''){
                formData.append("flag", $('#FileUploadSingle_add')[0].files[0]) 
            }
            
        } 
     
        
        formData.append("name",$("#txt_name_add").val()) 
        formData.append("code", $('#txt_code_add').val())  
        formData.append("app_language_code", $('#app_language_code_add').val())  
        formData.append("rtl", ck_rtl == true ? 1 : 0) 
        formData.append("is_default", ck_is_default == true ? 1 : 0) 
        formData.append("is_admin_default", ck_is_admin_default == true ? 1 : 0) 
        formData.append("status", ckactive == true ? 1 : 0)  
   
    return {add_creteria: formData };
}