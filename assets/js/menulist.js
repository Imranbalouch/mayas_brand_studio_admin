document.title="Dashboard | Menu List";
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
 $(document).ready(function() {  
    Onload(); 
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
    btnsav.hide();
    btnupd.hide();  
    $('#ck_active').prop('checked');
    txtid.html('');   
    Onload();
    imgload.hide();
}
   function Onload() { 
    $('#Table_View').DataTable().clear().destroy();
    $('#buttons').html('');
  //PageSize=10;
    $.ajax({
        url: ApiForm + '/get_othermenu',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (response) {

            if (response.status_code == 200) {
                imgload.hide();
                var action_button = ' ';
                //New
                if (Boolean(response.permissions["add"])) {
                    btnnew.show();
                }
 
                //Update 
                if (Boolean(response.permissions["edit"])) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-edit table_buttons' data-toggle='tooltip' title='Edit'><i class="ri-edit-box-line text-warning"></i>${getTranslation('edit')}</a>`;
                  
                }
                // //Details
                if (Boolean(response.permissions["edit"])) {
                    action_button += ` | <a href='javascript:;' class='modify_btn btn-details table_buttons' data-toggle='tooltip' title='Details'><i class="ri-edit-box-line text-warning"></i>${getTranslation('details')}</a>`;
               }
                // //Delete
                if (Boolean(response.permissions["delete"])) {
                     action_button += ` | <a href='javascript:;' class='modify_btn btn-delete table_buttons' data-toggle='tooltip' title='Delete'><i class="ri-delete-bin-7-line  text-danger  cursor-pointer"></i>${getTranslation('delete')}</a>`;
                }
               
                if (response["data"] != null) {
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
                            { data: 'name',
                                render: function (data, type, row) {
                                    if (action_button !== 'undefined' && action_button !== '') {
                                        return data +  "<div class='modify_row'>" + action_button + "</div>"
                                    } else { return '-' }
                                } 
                            }, 
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
                }
                imgload.hide(); 
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
        error: function(xhr, status, err) {
            imgload.hide();
            let errorMessage = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'An unknown error occurred';
            showToast(errorMessage, 'Error', 'error');
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


//Details
$(document).on('click', '.btn-details', function (e) {
    e.preventDefault();
    $("#popup_title").html(getTranslation("modify_details"));
    let currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    let data = $('#Table_View').DataTable().row(currentRow).data();
    let uuid = data['uuid'];
    let page = 'menulistdetails';  
    window.location.assign('?P='+page+'&M='+menu_id+'&Id='+uuid);
});
//Details




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
                url: ApiForm + '/add_othermenu',
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
                        showToast(getTranslation('Menu list added successfully'), 'Success', 'success');
                    }  
                },
                error: function (xhr, status, err) {  
                    imgload.hide();
                    btnsav.show();
                    if (xhr.status === 422) {
                        let errors = xhr.responseJSON.errors;
                        errors = JSON.parse(errors);
                        let errorMessages = "";
                        
                        $.each(errors, function (field, messages) {
                            messages.forEach(function(message) {
                                errorMessages += `<li>${message}</li>`;
                            });
                        });
                        let htmlError = `<ul>${errorMessages}</ul>`;
                        showToast(htmlError, 'Error', 'error');
                    }else{
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
    $.ajax({
        url: ApiForm + '/edit_othermenu/'+id,
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
                $('#txt_parent_li_dropdown_class').val(response.data.dropdown_menu);
                
                 if(response["data"]['child_array']!==null && response["data"]['child_array'].trim() !== ''){ 
                    child_array=response["data"]['child_array']; 
                    child_array=JSON.parse(child_array);
                    for (var key in child_array) {
                        if (child_array.hasOwnProperty(key)) {
                            //console.log(key + ": " + child_array[key]);
                            $('#txt_'+key).val(child_array[key]);
                            // You can access both the key and the value here
                        }
                    } 
                 }
                 if(response["data"]['parent_array']!==null && response["data"]['parent_array'].trim() !== ''){ 
                    parent_array=response["data"]['parent_array']; 
                    parent_array=JSON.parse(parent_array);
                    for (var key in parent_array) {
                        if (parent_array.hasOwnProperty(key)) {
                            // console.log(key + ": " + parent_array[key]);
                            $('#txt_'+key).val(parent_array[key]);
                            // You can access both the key and the value here
                        }
                    } 
                 } 
                $('#edit_Modal').modal('show'); 
                $('#txt_id').val(response["data"]["uuid"]);   
                if (response["data"]["status"] != "1") { 
                    $('#ck_active').prop('checked',false);
                }
                else if (response["data"]["status"] == "1") { 
                    $('#ck_active').prop('checked',true);
                } 
                imgload.hide(); 
                btnupd.show(); 
                validationHelper();
            }
            else {
                imgload.hide();
                var title = response.status_code == 405 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + response.message + "' target='_blank'>" + " " + response.message + "</a>" : response.message;
                showToast(title, 'Warning', 'warning');
            }

        },
        error: function (xhr, status, err) { 
            imgload.hide(); 
            showToast(getTranslation('internal_server_error'), 'Error', 'error');
        }

    }); 

});
//// EDIT RECORD END



//UPDATE RECORD START
function update_record() {
    var ck = ckvalidation();
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
                url: ApiForm + '/update_othermenu',
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
                    imgload.hide();
                    btnsav.show(); // Re-enable save button
                    btnupd.show(); // Re-enable update button
                    
                    if (response.status_code == 200) { 
                        discon(); 
                        $('#edit_Modal').modal('hide');
                        showToast(getTranslation('Menu list updated successfully'), 'Success', 'success');
                    } else {
                        // Handle non-200 status codes
                        showToast(response.message || getTranslation('Update failed'), 'warning', 'warning');
                    }
                },
                error: function (xhr, status, err) {  
                    imgload.hide();
                    btnupd.show();
                    if (xhr.status === 422) {
                        // Validation error
                        let errors = xhr.responseJSON.errors;
                        let errorMessages = "";
                        
                        // Check if errors is already an object, if not try to parse it
                        if (typeof errors === 'string') {
                            try {
                                errors = JSON.parse(errors);
                            } catch (e) {
                                errors = { "error": [errors] };
                            }
                        }
                        
                        // Iterate over all errors and concatenate them
                        Object.keys(errors).forEach(function(field) {
                            let messages = errors[field];
                            if (Array.isArray(messages)) {
                                messages.forEach(function(message) {
                                    errorMessages += `<li>${message}</li>`;
                                });
                            } else if (typeof messages === 'string') {
                                errorMessages += `<li>${messages}</li>`;
                            }
                        });
                        
                        let htmlError = `<ul class="list-unstyled">${errorMessages}</ul>`;
                        showToast(htmlError, 'Error', 'error');
                    } else {
                        // Handle other errors
                        showToast(xhr.responseJSON?.message || 'An error occurred', 'Error', 'error');
                    }
                }
            });
        }
    });
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
                url: ApiForm + '/delete_othermenu/'+id,
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
                    showToast(title, 'warning', 'warning');
                }
            })
        }
    })
});
/// DELETE RECORD END

function ckvalidation() {
    var ck = 0, Error = '';
    var tab_lang_active = '';
    var tab_lang_code_active = '';
    var element = '';
    var ckactive = $("#ck_active").is(":checked");
    var txtid = $('#txt_id').val();
    const formData = new FormData();

    // Ensure translations is initialized properly
    if (typeof translations === 'undefined' || !Array.isArray(translations)) {
        console.error("Translations array is not defined or invalid.");
        showToast(getTranslation('translations_missing_error'), 'error', 'error');
        return;
    }

    // Validate translation inputs
    for (var i = 0, l = translations.length; i < l; i++) {
        if ($('#txt_name_' + translations[i]['language_code']).val() == '') {
            ck = 1;
            element = $('#txt_name_' + translations[i]['language_code']);
            tab_lang_code_active = translations[i]['language_code'];
            tab_lang_active = translations[i]['language_name'];
            Error = getTranslation('please_enter_name');
            break;
        }
        formData.append("name_" + translations[i]['language_code'], 
            $('#txt_name_' + translations[i]['language_code']).val());
    }

    // Handle validation error for translations
    if (Boolean(ck)) {
        $('.nav-link').removeClass('active');
        $('.tab-pane').removeClass('active');
        $('#' + tab_lang_active).addClass('active');
        $('#' + tab_lang_code_active + 'Master').addClass('active');
        $(element).parents('.form-group').addClass('error');
        element.focus();
        showToast(Error, 'Error', 'error');
        return;
    }

    // Validate txt_parent_ul
    if ($('#txt_parent_ul').val() == '') {
        Error = getTranslation('please_enter_parent_ul');
        $('#txt_parent_ul').focus();
        showToast(Error, 'Error', 'error');
        return;
    }

    // Process parent and child arrays if necessary
    if ($('#txt_parent_ul').val() !== '') {
        var parent_array = {
            parent_ul: $('#txt_parent_ul').val(),
            parent_li: $('#txt_parent_li').val(),
            parent_ul_class: $('#txt_parent_ul_class').val(),
            parent_ul_id: $('#txt_parent_ul_id').val(),
            parent_icon: $('#txt_parent_icon').val(),
            parent_li_class: $('#txt_parent_li_class').val(),
            parent_li_dropdown_class: $('#txt_parent_li_dropdown_class').val()
        };

        var child_array = {
            child_ul: $('#txt_child_ul').val(),
            child_li: $('#txt_child_li').val(),
            child_ul_class: $('#txt_child_ul_class').val()
        };

        formData.append("parent_array", JSON.stringify(parent_array));
        formData.append("child_array", JSON.stringify(child_array));
    }

    formData.append("dropdown_menu", $('#dropdown_menu').val());

    // Add status to formData
    formData.append("status", ckactive ? 1 : 0);

    // Return the form data
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
        }
        
        if (Boolean(ck)) { 
            $(element).parents('.form-group').addClass('error');
            element.focus(); 
            showToast(Error, 'Error', 'error');
            return;
        }
        
       // console.log(icon);
       const formData = new FormData()  
       formData.append("name", $('#txt_name_add').val()) 

       var dropMenuClass = $('#txt_parent_li_dropdown_class_add').val();
        formData.append("parent_li_dropdown_class", dropMenuClass);

    
       if ($('#txt_parent_ul_add').val() == '') { 
        Error =  getTranslation('please_enter_parent_ul');
        $('#txt_parent_ul_add').focus();
        showToast(Error, 'Error', 'error');
      return;
  }
//   else if ($('#txt_parent_li_add').val() == '') { 
//         Error =  getTranslation('please_enter_parent_li');
//         $('#txt_parent_li_add').focus();
//         showToast(Error, 'error', 'error');
//       return;
//   }
//   else if ($('#txt_child_ul_add').val() == '') { 
//       Error =  getTranslation('please_enter_child_ul');
//       $('#txt_child_ul_add').focus();
//       showToast(Error, 'error', 'error');
//     return;
//   }else if ($('#txt_child_li_add').val() == '') { 
//       Error =  getTranslation('please_enter_child_li');
//       $('#txt_child_li_add').focus();
//       showToast(Error, 'error', 'error');
//   return;
//   }
  else{
      
    //   if ($('#txt_parent_ul_add').val() !== '' && $('#txt_parent_li_add').val() !== '' && $('#txt_child_ul_add').val() !== '' && $('#txt_child_li_add').val() !== ''){ 
      if ($('#txt_parent_ul_add').val() !== ''){ 
              var parent_array={}; 
              parent_array["parent_ul"] = $('#txt_parent_ul_add').val();
              parent_array["parent_li"] = $('#txt_parent_li_add').val();
              parent_array["parent_ul_class"] = $('#txt_parent_ul_class_add').val();
              parent_array["parent_ul_id"] = $('#txt_parent_ul_id_add').val(); 
              parent_array["parent_icon"] = $('#txt_parent_icon_add').val(); 
              parent_array["parent_li_class"] = $('#txt_parent_li_class_add').val(); 
              parent_array["parent_li_dropdown_class"] = $('#txt_parent_li_dropdown_class_add').val(); 
              //console.log(parent_array);
              var child_array={};  
              child_array["child_ul"] = $('#txt_child_ul_add').val();
              child_array["child_li"] = $('#txt_child_li_add').val();
              child_array["child_ul_class"] = $('#txt_child_ul_class_add').val(); 
              //console.log(child_array);
          formData.append("parent_array", JSON.stringify(parent_array))
          formData.append("child_array", JSON.stringify(child_array))
      }
      
  } 
    formData.append("status", ckactive == true ? 1 : 0) 
   
    return {add_creteria: formData };
}