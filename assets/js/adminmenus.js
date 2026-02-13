document.title="Dashboard | Menus";
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
let addRecord = 0;
let editRecord = 0;
let updateRecord = 0;
let removeRecord = 0;

$(document).ready(function() {  
    console.log(addRecord, editRecord, updateRecord, removeRecord);
    
    btnnew.hide();
    Onload(); 
    // Update/reset user image of account page
    let accountUserImage = document.getElementById('uploadedAvatar');
    const fileInput = document.querySelector('.account-file-input'),
      resetFileInput = document.querySelector('.account-image-reset');

    if (accountUserImage) {
      const resetImage = accountUserImage.src;
      fileInput.onchange = () => {
        if (fileInput.files[0]) {
          accountUserImage.src = window.URL.createObjectURL(fileInput.files[0]);
        }
      };
      resetFileInput.onclick = () => {
        fileInput.value = '';
        $('#icon_value').val('');
        accountUserImage.src = resetImage;
      };
    }

    // Add/reset user image of account page
    let accountUserImage_add = document.getElementById('uploadedAvatar_Add');
    const fileInput_add = document.querySelector('.account-file-input'),
      resetFileInput_add = document.querySelector('.account-image-reset');

    if (accountUserImage_add) {
      const resetImage_add = accountUserImage_add.src;
      fileInput_add.onchange = () => {
        if (fileInput_add.files[0]) {
          accountUserImage_add.src = window.URL.createObjectURL(fileInput_add.files[0]);
        }
      };
      resetFileInput_add.onclick = () => {
        fileInput_add.value = '';
        $('#icon_value').val('');
        accountUserImage_add.src = resetImage_add;
      };
    }


 }); 
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
    btnsav.prop('disabled',true);
    btnupd.prop('disabled',false);
    $('#ck_active').prop('checked');
    txtid.html('');   
    Onload();
    imgload.hide();
}

function Onload() {  
    $('#Table_View').DataTable().clear().destroy();
    $('#buttons').html('');
    $.ajax({
        url: ApiForm + '/get_menu',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                var action_button = ' ';
                
                //New
                if (Boolean(response.permissions['add'])) {
                    btnnew.show();
                    addRecord = 1;
                }
 
                //Edit 
                if (Boolean(response.permissions["edit"])) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-edit table_buttons' data-toggle='tooltip' title='Edit'><i class="ri-edit-box-line   text-warning"></i> ${getTranslation('edit')}</a> | `;
                    editRecord = 1;
                }

                // Update
                if (Boolean(response.permissions["update"])) {
                    updateRecord = 1;
                }
                
                //Delete
                if (Boolean(response.permissions["delete"])) {
                    action_button += `<a href='javascript:;' class='btn-delete table_buttons' data-toggle='tooltip' title='Delete'><i class="ri-delete-bin-7-line  text-danger  cursor-pointer"></i> ${getTranslation('delete')}</a> `;
                    removeRecord = 1;
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
                        { data: 'url' }, 
                        { data: 'status', 
                            render: function (data, type, row) {
                                if (data == true) {
                                    return  `<span class="badge rounded-pill  bg-label-success">${getTranslation('status_active')}</span>`
                                    } else { 
                                    return `<span class="badge rounded-pill  bg-label-danger">${getTranslation('status_inactive')}</span>` }
                                }
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
                        `<img class='dataTable-custom-empty-icon' src='/img/no-record-found.svg'><br>${tbNoFound}`,
                    },
                  });
            }
            else {
                imgload.hide();
                showToast(response.message,'Error','error');
            }

        },
        error: function (xhr, status, err) {
            imgload.hide();
            showToast(xhr.responseJSON.message,'Error','error');
        }
    })


    return true;

}

/// ADD NEW RECORD START
$(document).on("click", '#btn_new', function () {
    $('#add_Modal').modal('show');
    $("#popup_title_add").html(getTranslation("add_new"));
    discon(); 
    btnsav.prop('disabled',false);
    imgload.hide(); 
});
/// ADD NEW RECORD END

function save_record() {
    var ck = ckvalidationAdd();
    if (ck == 1) { return; } 
    var cre = ck.add_creteria;  
    Swal.fire({
        title:getTranslation('add_new'),
        text: getTranslation('addConfirmMsg'),
        //icon: 'question',
        showCancelButton: true,
        cancelButtonText: getTranslation('cancel'),
        confirmButtonColor: '#15508A',
        cancelButtonColor: '#15508A',
        confirmButtonText:  getTranslation('add_new'),
        reverseButtons: true, 
        // showClass: {
        //     //popup: 'animate__animated animate__bounceIn'
        //     popup: 'animate__animated animate__flipInX'
        //   },
        // hideClass: {
        //     popup: 'animated fadeOutUp faster'
        // }, 
        customClass: {
            confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
            cancelButton: 'btn btn-outline-secondary waves-effect'
          },
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ApiForm + '/add_menu',
                type: "Post",
                processData: false,
                contentType: false,
                data: cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey); 
                    xhr.setRequestHeader("menu-uuid", menu_id); 
                    imgload.show();
                    btnsav.prop('disabled',true); 
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
                    btnsav.prop('disabled',false);
                    if (xhr.status === 422) {
                        // Validation error
                        let errors = xhr.responseJSON.errors;
                        errors = JSON.parse(errors);
                        let errorMessages = "";
                        // Iterate over all errors and concatenate them
                        $.each(errors, function (field, messages) {
                            messages.forEach(function(message) {
                                errorMessages += `<li>${message}</li>`; // Append each error message
                            });
                        });
                        let htmlError = `<ul>${errorMessages}</ul>`;
                        showToast(htmlError, 'Error', 'error');
                    }else{
                        // Handle other errors
                        showToast(xhr.responseJSON.message, 'Error', 'error');
                    }
                }
            })

        }
    })
}
/// SAVE NEW RECORD END

/// EDIT RECORD START
$(document).on('click', '.btn-edit', function (e) {
    e.preventDefault();
    $("#popup_title").html(getTranslation("modify_menu"));
    var currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var id = data['uuid'];
    var page = 'adminmenuedit';  
    $.ajax({
        url: ApiForm + '/edit_menu/'+id,
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
                let formId = btnupd.parents('form').attr('id');
                translations=response["data"]['translations']; 
                let tabs='';
                let tab_content=''; 
                if(translations.length>0){
                    $('#myTab').html('');
                    $('#tab_content').html('');
                } 
                for ( var i = 0, l = translations.length; i < l; i++) { 
                    let tab_active='';
                    var icon='';
                    var translations_icon=AssetsPath+'no-image.jpg';
                    if(translations[i]['flag']!==null){ 
                        translations_icon=AssetsPath+translations[i]['flag'];
                    }
                  
                    if(i==0){tab_active='active show';} 
                    tabs += 
                    `<li class="nav-item d-none" role="presentation">
                        <button  class="nav-link waves-effect ${tab_active}" id="${translations[i]['language_name']}" 
                        data-bs-toggle="tab" 
                        data-bs-target="#${translations[i]['language_code']}Master" 
                        type="button" 
                        role="tab" 
                        aria-selected="true"
                        aria-controls="${translations[i]['language_name']}">
                        <img  class="lang_image" src="${translations_icon}" width="20" alt=""> 
                        <span class="ri-user-line ri-20px d-sm-none"></span>
                        <span class="d-none d-sm-block"> ${translations[i]['language_name']}</span>
                        </button>
                    </li>`; 
                    tab_content +=`<div role="tabpanel" class="tab-pane fade ${tab_active} p-0" id="${translations[i]['language_code']}Master"> 
                                    <div class="col-md-12">        
                                        <div class="form-group">
                                            <div class="fv-row col-md-12">
                                                <label class="required form-label">${getTranslation('name')}</label> 
                                                <input type="text" class="form-control" name="txt_name_${translations[i]['language_code']}" id="txt_name_${translations[i]['language_code']}" placeholder="${getTranslation('name')}" value="${translations[i]['name']}" maxlength="50" required="">
                                            </div> 
                                        </div>
                                    </div>  
                                </div>`;
                }
                $('#myTab').append(tabs);
                
                $('#tab_content').append(tab_content);
               
                 if(response["data"]['icon']!==null && response["data"]['icon'].trim() !== ''){ 
                    icon=AssetsPath+response["data"]['icon']; 
                }
                 
                if(icon !== null && icon !== undefined && icon.trim() !== ''){ 
                var filenameWithExtension = icon.split('/').pop();
                var [filename, extension] = filenameWithExtension.split('.'); 
                var fileNameCrop = filename; 
                var fileExt=extension; 
                $('#icon_value').val(icon);
                $('#uploadedAvatar').attr('src',icon);
                } 
                $('#edit_Modal').modal('show'); 
                $('#txt_id').val(response["data"]["uuid"]);
                $('#txt_parent_id').val(response["data"]["parent_id"]); 
                $('#txt_sort_id').val(response["data"]["sort_id"]);
                $('#txt_url').val(response["data"]["url"]);    
                if (response["data"]["status"] != "1") { 
                    $('#ck_active').prop('checked',false);
                }
                else if (response["data"]["status"] == "1") { 
                    $('#ck_active').prop('checked',true);
                } 
                imgload.hide(); 
                btnupd.show(); 
                setTimeout(function() { 
                    window.Helpers.navTabsAnimation();
                }, 1000);
                validationHelper();       
            }
            else {
                imgload.hide();
                var title = response.status_code == 405 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + response.message + "' target='_blank'>" + " " + response.message + "</a>" : response.message;
                showToast('Something went wrong!', 'Error', 'error');
            }

        },
        error: function (xhr, status, err) { 
            imgload.hide(); 
            showToast(xhr.responseJSON.message, 'Error', 'error');
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
            title:getTranslation('btn_upd'),
            text: getTranslation('editConfirmMsg'),
            //icon: 'question',
            showCancelButton: true,
            cancelButtonText: getTranslation('cancel'),
            confirmButtonColor: '#15508A',
            cancelButtonColor: '#15508A',
            confirmButtonText:  getTranslation('btn_upd'),
            reverseButtons: true, 

            // showClass: {
            //     //popup: 'animate__animated animate__bounceIn'
            //     popup: 'animate__animated animate__flipInX'
            //   },
            // hideClass: {
            //     popup: 'animated fadeOutUp faster'
            // }, 
            customClass: {
                confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
                cancelButton: 'btn btn-outline-secondary waves-effect'
              },
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ApiForm + '/update_menu/'+uuid,
                type: "Post",
                processData: false,
                contentType: false,
                data: cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("menu-uuid", menu_id); 
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
                    if (xhr.status === 422) {
                        // Validation error
                        let errors = xhr.responseJSON.errors;
                        errors = JSON.parse(errors);
                        let errorMessages = "";
                        // Iterate over all errors and concatenate them
                        $.each(errors, function (field, messages) {
                            messages.forEach(function(message) {
                                errorMessages += `<li>${message}</li>`; // Append each error message
                            });
                        });
                        let htmlError = `<ul>${errorMessages}</ul>`;
                        showToast(htmlError, 'Error', 'error');
                    }else{
                        // Handle other errors
                        showToast(xhr.responseJSON.message, 'Error', 'error');
                    }
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
        title:getTranslation('delete'),
        text: getTranslation('deleteConfirmMsg'),
       // icon: 'question',
        showCancelButton: true,
        cancelButtonText: getTranslation('cancel'),
        confirmButtonColor: '#15508A',
        cancelButtonColor: '#15508A',
        confirmButtonText:  getTranslation('delete'),
        reverseButtons: true, 
        // showClass: {
        //     //popup: 'animate__animated animate__bounceIn'
        //     popup: 'animate__animated animate__flipInX'
        //   },
        // hideClass: {
        //     popup: 'animated fadeOutUp faster'
        // },
        
        customClass: {
            confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
            cancelButton: 'btn btn-outline-secondary waves-effect'
          },
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ApiForm + '/delete_menu/'+id,
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
                        showToast(getTranslation('Menu deleted successfully'), 'Success', 'success');
                    } 
                },
                error: function (xhr, status, err) {  
                    imgload.hide();
                    btnupd.show();
                    showToast(xhr.responseJSON.message, 'Error', 'error');
                }
            })
        }
    })
});
/// DELETE RECORD END

function ckvalidation() {
    var ck = 0, Error = '';
    var tab_lang_active='';
    var tab_lang_code_active='';
    var element='';
    var ckactive = $("#ck_active").is(":checked");
    var txtid = $('#txt_id').val();
    const formData = new FormData() 
    for ( var i = 0, l = translations.length; i < l; i++) {
        if ($('#txt_name_'+translations[i]['language_code']).val() == '') {
            ck = 1;
            element=$('#txt_name_'+translations[i]['language_code']);
            tab_lang_code_active=translations[i]['language_code'];
            tab_lang_active=translations[i]['language_name'];
            Error =  getTranslation('please_enter_name');
        }
        formData.append("name_"+translations[i]['language_code'], $('#txt_name_'+translations[i]['language_code']).val())
    }

        if (Boolean(ck)) {
            $('.nav-link').removeClass('active');
            $('.tab-pane').removeClass('active');
            $('#'+tab_lang_active).addClass('active');
            $('#'+tab_lang_code_active+'Master').addClass('active');
            $(element).parents('.form-group').addClass('error');
            element.focus(); 
            showToast(Error, 'Error', 'error');
            return;
        }
        var icon=$('#icon_value').val();
       // console.log(icon);
        if ($('#FileUploadSingle').val() == '' && icon=="") { 
            Error =  getTranslation('please_select_image');
            showToast(Error, 'Error', 'error');
            return;
        }else{
            
            if ($('#FileUploadSingle').val() !== ''){
                formData.append("icon", $('#FileUploadSingle')[0].files[0])
               // formData.append("icon", $('#FileUploadSingle').val())
            }
            
        } 
    formData.append("sort_id", $('#txt_sort_id').val()) 
    formData.append("parent_id", $('#txt_parent_id').val()) 
    formData.append("url", $('#txt_url').val()) 
    formData.append("status", ckactive == true ? 1 : 0) 

    return { uuid: txtid, creteria: formData };
}



/// Validation For Add new
function ckvalidationAdd() {
    var ck = 0, Error = ''; 
    var element='';
    var ckactive = $("#ck_active_add").is(":checked");  
        if ($('#txt_name_add').val() == '') {
            ck = 1;
            element=$('#txt_name_add'); 
            Error =  getTranslation('please_enter_name');
        }else if ($('#txt_parent_id_add').val() == '') {
            ck = 1;
            element=$('#txt_parent_id_add'); 
            Error =  getTranslation('please_enter_parent_id');
        }else if ($('#txt_sort_id_add').val() == '') {
            ck = 1;
            element=$('#txt_sort_id_add'); 
            Error =  getTranslation('please_enter_sort_id');
        }else if ($('#txt_url_add').val() == '') {
            ck = 1;
            element=$('#txt_url_add'); 
            Error =  getTranslation('please_enter_url');
        }
        
        if (Boolean(ck)) { 
            $(element).parents('.form-group').addClass('error');
            element.focus(); 
            showToast(Error, 'Error', 'error');
            return;
        }
        var icon=$('#FileUploadSingle_add').parents(".form-group").find('.file-preview-imgs .preview-card').length;
       // console.log(icon);
       const formData = new FormData()  
       formData.append("name", $('#txt_name_add').val()) 
        if ($('#FileUploadSingle_add').val() == '') { 
            Error =  getTranslation('please_select_image');
            showToast(Error, 'Error', 'error');
            return;
        }else{
            
            if ($('#FileUploadSingle_add').val() !== ''){
                formData.append("icon", $('#FileUploadSingle_add')[0].files[0]) 
            }
            
        } 
     
    formData.append("sort_id", $('#txt_sort_id_add').val()) 
    formData.append("parent_id", $('#txt_parent_id_add').val()) 
    formData.append("url", $('#txt_url_add').val()) 
    formData.append("status", ckactive == true ? 1 : 0) 
   
    return {add_creteria: formData };
}