document.title="Dashboard | Permissions";
var PageNo = 1;
var PageSize = 10;
var totalRecord = 0;
var PageLength = 0;
var Search = '';
let keyupTimer;
var btnupd = $('#btn_upd');
var btn_upd_password=$('#btn_upd_password');
var btnsav = $('#btn_sav');
var txtid = $('#txt_id');
var btnnew=$('#btnnew');
let translations=[];  
 $(document).ready(function() { 
    Onload();   
    $('.selectpicker').selectpicker();
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
          detailsTableBody.column(1).search("^" + Search + "$", true, false).draw();
        }, 1000);
    }else{
        Onload(); 
    }
    imgload.hide(); 
});  
function discon(){ 
    document.getElementById('create_form').reset(); 
    $(".file-preview-imgs").html('');
    btnsav.hide();
    btnupd.hide();  
    $('#ck_active').prop('checked');
    txtid.html('');   
    Onload();
    imgload.hide(); 
    $("#txt_id").val("");
    $('.selectpicker').selectpicker();
}
   function Onload() { 
    $('#Table_View').DataTable().clear().destroy();
    $('#buttons').html('');
  //PageSize=10;
    $.ajax({
        url: ApiForm + '/get_permission',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        headers: {"Authorization": "Bearer "+strkey,'menu-uuid':menu_id},
        //menu_id:_menuid,
        
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey); 
            imgload.show();
        },
        success: function (response) {

            if (response.status_code == 200) {
                var action_button = ' ';
                //New
                if (response["new"] == 1) {
                    btnnew.show();
                }
 
                //Update 
                if (response["update"]== 1) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-edit table_buttons' data-toggle='tooltip' title='Edit'><i class="ri-edit-box-line   text-warning"></i> ${getTranslation('edit')}</a>`;
                  
                }
                
                // //Delete
                if (Boolean(response["delete"])) {
                     action_button += ` | <a href='javascript:;' class='btn-delete table_buttons' data-toggle='tooltip' title='Delete'><i class="ri-delete-bin-7-line  text-danger  cursor-pointer"></i> ${getTranslation('delete')}</a>`;
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
                        { data: 'permission',
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
                Swal.fire({
                    title: response.message,

                    icon: 'warning',
                    showConfirmButton: true,

                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }

                })
            }

        },
        error: function (xhr, status, err) {
            imgload.hide();
            Swal.fire({
                title: ErrorMsgAPI,

                icon: 'warning',
                showConfirmButton: true,

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }

            })
        }
    })

     
    return true;

}


/// ADD NEW RECORD START
$(document).on("click", '#btn_new', function () {
    validationHelper();
    $('#add_Modal').modal('show');
    $("#popup_title").html(getTranslation("add_new"));
    discon(); 
    
    imgload.hide(); 
    btnsav.show();
     
});
/// ADD NEW RECORD END


/// SAVE NEW RECORD START

function save_record() {
    var ck = ckvalidation();
    if (ck == 1) { return; } 
    var cre = ck.creteria; 
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
                url: ApiForm + '/add_permission',
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
                        showToast(getTranslation('record_added_sucessfully'), 'Success', 'success');
                    } 
                },
                error: function (xhr, status, err) {  
                    imgload.hide();
                    btnsav.show();
                    const data = xhr.responseJSON.errors;
                    //console.log(xhr.responseJSON.errors);
                    // Handle error
                        var errorResponse = xhr.responseJSON || {}; // Get the error response

                        // Create an error message string
                        var errorMessages = '';
                        for (var key in errorResponse) {
                            if (errorResponse.hasOwnProperty(key)) {
                               // console.log(errorResponse[key]);
                                var messages = errorResponse[key];
                                if (Array.isArray(messages)) {
                                    messages.forEach(function(message) {
                                        errorMessages += message + '<br>'; // Use <br> for line breaks
                                    });
                                } else if (typeof messages === 'string') {
                                    // If messages is a string, handle it as a single message
                                    errorMessages += messages + '<br>';
                                } else {
                                    // Handle unexpected types
                                    errorMessages += 'An unexpected error occurred.<br>';
                                }
                            }
                        }
                        showToast(errorMessages, 'Error', 'error');
                }
            })

        }
    })
}
/// SAVE NEW RECORD END

/// EDIT RECORD START
$(document).on('click', '.btn-edit', function (e) {
    e.preventDefault();  
    $("#edit_popup_title").html(getTranslation("modify_permission"));
    var currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var id = data['uuid'];
    var page = 'staffedit';  
    $.ajax({
        url: ApiForm + '/edit_permission/'+id,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            xhr.setRequestHeader("Id", id);
            btnupd.hide(); 
            btnsav.hide();
            imgload.show();   
        }, 
        success: function (response) {
            if (response.status_code == 200) { 
              //  discon(); 


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
                                              <input type="text" class="form-control" name="txt_name_${translations[i]['language_code']}" id="txt_name_${translations[i]['language_code']}" placeholder="${getTranslation('name')}" value="${translations[i]['name']}" required="">
                                          </div> 
                                      </div>
                                  </div>  
                              </div>`;
              }
              $('#myTab').append(tabs);
              $('#tab_content').append(tab_content);

              
                $('#edit_Modal').modal('show'); 
                $('#txt_id').val(response["data"]["uuid"]);
                //$('#txt_role_name').val(response["data"]["role"]);  
                if (response["data"]["status"] != "1") { 
                    $('#ck_active1').prop('checked',false);
                }else if (response["data"]["status"] == "1") { 
                    $('#ck_active1').prop('checked',true);
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
                Swal.fire({ 
                    title: title, 
                    icon: 'warning',
                    showConfirmButton: true, 
                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }

                })
            }

        },
        error: function (xhr, status, err) { 
            imgload.hide(); 
            Swal.fire({
                title: getTranslation('internal_server_error'), 
                icon: 'error',
                showConfirmButton: true, 
                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                } 
            });
        }

    });  
});
//// EDIT RECORD END



//UPDATE RECORD START
function update_record() {
    var ck = ckvalidationEdit();
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
                url: ApiForm + '/update_permission',
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
                        showToast(getTranslation('record_updated_sucessfully'), 'Success', 'success');
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
    var name = data['permission']; 
    Swal.fire({
        title: getTranslation('deleteConfirmMsg')+name,
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
                url: ApiForm + '/delete_permission/'+id,
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
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var ck = 0, Error = ''; 
    var element='';
    var ckactive = $("#ck_active").is(":checked");
    var txtid = $('#txt_id').val();  
    
       // console.log($('#txt_role_id').val());
        if ($('#txt_permission_name').val() == '') {
            ck = 1;
            element=$('#txt_role_name'); 
            Error =  getTranslation('please_enter_permission_name');
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
          
    const formData = new FormData();
    formData.append("permission",$("#txt_permission_name").val())  
    formData.append("status", ckactive == true ? 1 : 0)   
    return { uuid: txtid, creteria: formData };
}

 
function ckvalidationEdit() {
    var ck = 0, Error = '';
    var tab_lang_active='';
    var tab_lang_code_active='';
    var element='';
    var ckactive = $("#ck_active1").is(":checked");
    var txtid = $('#txt_id').val();
    const formData = new FormData() 
   // formData.append("id", txtid) 
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
//            element.parentElement.parentElement.classList.add('error');
            $(element).parents('.form-group').addClass('error');
            element.focus(); 
            Swal.fire({
                title: Error,
                icon: 'error'
            });
            return;
        }
          
    formData.append("status", ckactive == true ? 1 : 0) 
     
    return { uuid: txtid, creteria: formData };
}