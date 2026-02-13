document.title="Dashboard | Staffs";
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
var btnnew=$('#btn_new');
let translations=[]; 
var roleId='';
var roleName='';
let iti
 $(document).ready(function() { 
    Onload();

    let accountUserImage = document.getElementById('uploadedAvatar_Add');
    const fileInput = document.querySelector('.account-file-input');

    if (accountUserImage) {
        const resetImage = accountUserImage.src;
        fileInput.onchange = () => {
            if (fileInput.files[0]) {
                // Show preview container
                $(fileInput).parent().parent().parent().find('#uploadedAvatar_Add').removeClass('d-none');
                
                // Create FileReader for preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    accountUserImage.src = e.target.result;
                };
                reader.readAsDataURL(fileInput.files[0]);
            }
        };
    }


    var input = document.querySelector("#txt_phone");
    if (input) {
      iti = window.intlTelInput(input, {
        initialCountry: "ae",
        preferredCountries: ['ae'],
        autoPlaceholder: "polite",
        showSelectedDialCode: true,
        utilsScript: "./assets/plugins/intel-input/utils.js",
        hiddenInput: () => ({ phone: "txt_phone" })
      });
      function validateInput() {
        if (input.value.trim()) {
            if (iti.isValidNumber()) {
              input.parentElement.parentElement.classList.remove("error");
              input.parentElement.parentElement.querySelector(".error-txt").innerHTML = "";
              $("#create_form").find("#btn_upd").prop("disabled", false);
              $("#create_form").find("#btn_sav").prop("disabled", false);
              $("input[name='txt_phone']").val(iti.getNumber());
              input.setAttribute("data-full-phone", iti.getNumber());
            } else {
              input.parentElement.parentElement.classList.add("error");
              input.parentElement.parentElement.querySelector(".error-txt").innerHTML = "Invalid Number";
              $("#create_form").find("#btn_upd").prop("disabled", true);
              $("#create_form").find("#btn_sav").prop("disabled", true);
              $("input[name='txt_phone']").val('');
              input.removeAttribute("data-full-phone");
            }
          } else {
            input.parentElement.parentElement.classList.remove("error");
            input.parentElement.parentElement.querySelector(".error-txt").innerHTML = "";
            $("#create_form").find("#btn_upd").prop("disabled", false);
            $("#create_form").find("#btn_sav").prop("disabled", false);
            $("input[name='txt_phone']").val(iti.getNumber());
            input.removeAttribute("data-full-phone");
        }
      }

      input.addEventListener("blur", validateInput);
      input.addEventListener("keyup", validateInput);
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
          detailsTableBody.column(3).search("^" + Search + "$", true, false).draw();
        }, 1000);
    }else{
        Onload(); 
    }
    imgload.hide(); 
});  
function discon(){
    document.getElementById('create_form').reset();
    roleId='';
    roleName='';
    $(".file-preview-imgs").html('');
    btnsav.hide();
    btnupd.hide();  
    $('#ck_active').prop('checked');
    txtid.html('');   
   // Onload();
    imgload.hide();
    updatePasswordStrength();
    $("#txt_id").val("");
}
function Onload() { 
    $('#Table_View').DataTable().clear().destroy();
    $('#buttons').html('');
    $.ajax({
        url: ApiForm + '/get_users',
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
                var action_button = ' ';
                //New
                if (Boolean(response.permissions["add"])) {
                    btnnew.show();
                }
 
                //Update 
                if (Boolean(response.permissions["edit"])) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-edit table_buttons' data-toggle='tooltip' title='Edit'><i class="ri-edit-box-line   text-warning"></i> ${getTranslation('edit')}</a>`;
                }
                if ((Boolean(response.permissions["changepassword"]) && Boolean(response.permissions["edit"])) || (Boolean(response.permissions["delete"]) && Boolean(response.permissions["edit"]))) {
                    action_button += ' | ';
                }
                //Change Password 
                if (Boolean(response.permissions["changepassword"])) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-password table_buttons' data-toggle='tooltip' title='${getTranslation('password')}'><i class="ri-key-fill  text-success  cursor-pointer"></i> ${getTranslation('password')}</a>`;                  
                }
                
                if (Boolean(response.permissions["changepassword"]) && Boolean(response.permissions["delete"])) {
                    action_button += '|';
                }

                // //Delete
                if (Boolean(response.permissions["delete"])) {
                    action_button += `<a href='javascript:;' class='btn-delete table_buttons' data-toggle='tooltip' title='Delete'><i class="ri-delete-bin-7-line  text-danger  cursor-pointer"></i> ${getTranslation('delete')}</a>`;
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
                        { data: 'name',
                            render: function (data, type, row) {
                                if (action_button !== 'undefined' && action_button !== '') {
                                    return data +  "<div class='modify_row'>" + action_button + "</div>"
                                } else { return '-' }
                            } 
                        },
                        { data: 'email' }, 
                        { data:'role_name'},
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
                  //  totalRecord = response["data"]["totalCount"];
                      

                    // $('#searchFieldForDatatable').on('keyup', function () {
                    //     detailsTableBody.search(this.value).draw();
                    // });
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
                showToast(response.message, 'Warning', 'warning');
            }

        },
        error: function (xhr, status, err) {
            imgload.hide();
            showToast(xhr.responseJSON.message, 'Error', 'error');
        }
    })

    ComponentsDropdowns.init();
    return true;

}

/// ADD NEW RECORD START
$(document).on("click", '#btn_new', function () {
    validationHelper();
    $('#modify_Modal').modal('show');
    $("#popup_title").html(getTranslation("add_new"));
    discon();
    btnsav.show();
    imgload.hide(); 
    $("#staff_password").show();
    $("#message").html('');
    $("#uploadedAvatar_Add").addClass('d-none');
    $("#uploadedAvatar_Add").attr('src','');
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
                url: ApiForm + '/register',
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
                        $('#modify_Modal').modal('hide');
                        Onload();
                        showToast(response.message, 'Success', 'success');
                        location.reload(); 
                    } 
                },
                error: function(xhr, status, err) {
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
    //ComponentsDropdowns.init();
    $("#staff_password").hide();
    $("#popup_title").html(getTranslation("modify_staff"));
    var currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var id = data['uuid'];
    var page = 'staffedit';  
    $.ajax({
        url: ApiForm + '/edit_user/'+id,
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
                var icon='';
                 if(response["data"]['image']!==null && response["data"]['image'].trim() !== ''){ 
                    icon=AssetsPath+response["data"]['image']; 
                    $('#uploadedAvatar_Add').removeClass('d-none');
                    $('#uploadedAvatar_Add').addClass('d-block');
                    $('#uploadedAvatar_Add').attr('src', icon);
                } 
                $('#modify_Modal').modal('show'); 
                $('#txt_id').val(response["data"]["uuid"]);
                $('#txt_first_name').val(response["data"]["first_name"]); 
                $('#txt_last_name').val(response["data"]["last_name"]);
                $('#txt_email').val(response["data"]["email"]);
                
                if (response["data"]["phone"] !== null && response["data"]["phone"] !== '') {
                    $('#txt_phone').val(response["data"]["phone"]);
                    iti.setNumber(response["data"]["phone"]);
                    $('input[name="txt_phone"]').val(response["data"]["phone"]);
                }
                 roleId = response["data"]["role_id"]; 
                  $('#txt_role_id').selectpicker('destroy');
                  $('#txt_role_id').val(roleId);
                  $("#txt_role_id").selectpicker('render');  
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
                showToast(title, 'Warning', 'warning');
            }

        },
        error: function(xhr, status, err) {
            imgload.hide();
                
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
                url: ApiForm + '/update_user',
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
                        $('#modify_Modal').modal('hide');
                        Onload();
                        showToast(getTranslation('Staff updated successfully'), 'Success', 'success');
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
                        showToast(xhr.responseJSON.message, 'Error', 'error');
                    }
                }
            })

        }
    })

}
//UPDATE RECORD END

/// CHANGE PASSWORD START
$(document).on("click", '.btn-password', function (e) {
    e.preventDefault(); 
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var id = data['uuid'];
    var first_name = data['first_name']; 
    var last_name = data['last_name']; 
    var email = data['email']; 
    var phone = data['phone']; 
    var role_id_password = data['role_id']; 
    $("#txt_id_password").val(id);
    $("#txt_password_change").val('');
    $("#txt_first_name_password").val(first_name);
    $("#txt_last_name_password").val(last_name);
    $("#txt_email_password").val(email);
    $("#txt_phone_password").val(phone);
    $('#txt_role_id_password').selectpicker('destroy');
    $("#txt_role_id_password").val(role_id_password);
    $("#txt_role_id_password").selectpicker('render');

    $('#password_Modal').modal('show');
    $("#popup_title_password").html(getTranslation("change_password"));
    $("#progressContainer_change").hide();
    $("#message_change").html('');
    btnupd.show();
    btn_upd_password.prop('disabled',false);
    imgload.hide();  
});

var timeoutId = null;
$('#txt_password_change').on('keyup',  function (e) {
    e.preventDefault();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
        changePasswordStrength();
    }, 500);
});
/// CHANGE PASSWORD END

//UPDATE PASSWORD START
function update_password() {
    var ck = ckvalidation_password();
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
                url: ApiForm + '/change_password',
                type: "Post",
                processData: false,
                contentType: false,
                data: cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("menu-uuid", menu_id); 
                  //  xhr.setRequestHeader("uuid", uuid); 
                    imgload.show(); 
                    btn_upd_password.prop('disabled',true);
                },
                success: function (response) { 
                    if (response.status_code == 200) { 
                        imgload.hide();
                        discon();
                        Onload(); 
                        btnupd.show();
                        $('#password_Modal').modal('hide');
                        showToast(response.message, 'Success', 'success');
                    }  
                },
                error: function (xhr, status, err) {  
                    imgload.hide();
                    btn_upd_password.prop('disabled',false);
                    const data = xhr.responseJSON.errors;
                    showToast(xhr.responseJSON.message, 'Error', 'error');
                }
            })

        }
    })

}
//UPDATE PASSWORD END

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
                url: ApiForm + '/delete_user/'+id,
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
                        Onload();
                        showToast(response.message, 'Success', 'success');
                    } 
                },
                error: function (xhr, status, err) {  
                    imgload.hide();
                    btnupd.show();
                    const data = xhr.responseJSON.errors;
                    showToast(xhr.responseJSON.message, 'Warning', 'warning');
                }
            })
        }
    })
});
/// DELETE RECORD END

var ComponentsDropdowns = function () {
    var handleSelect2 = function () { 
        FillRoles(); 
    }
    return {
        //main function to initiate the module
        init: function () {
            setTimeout(function() {
                // if ($().select2) {
                //     $('.select2').select2({
                //         placeholder: $(this).data("placeholder"),
                //         allowClear: true
                //     });
                // }
                $('.selectpicker').selectpicker('render');
                handleSelect2();
            }, 1000);
           
        }
    };
}();
 
function FillRoles() {  
    //$('.selectpicker').selectpicker();
    $.ajax({
        url: ApiForm + '/get_active_roles',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend : function (request) {
            request.setRequestHeader("Authorization", 'Bearer ' + strkey); 
        },
        success: function(data) {
            // Assume `data` is an array of objects with `id` and `text` properties
            var options = data.data.map(function(item) {
                return `<option value="${item.id}">${item.role}</option>`;
            }).join('');
            //$("#txt_role_id").html(options).selectpicker('refresh');
            // Update selectpicker
             $('#txt_role_id').html(options);
             $('#txt_role_id_password').html(options);
            // Refresh selectpicker to apply new options
            $('#txt_role_id').selectpicker('refresh');
            $('#txt_role_id_password').selectpicker('refresh');
        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', status, error);
        }
     
     
});
} 

function validateFileUpload(fileInput) {
    const file = fileInput.files[0];
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'];
    const maxSize = 5 * 1024 * 1024; 
    
    if (!file) {
        return true;
    }
    
    if (!allowedTypes.includes(file.type)) {
        showToast('Please upload only image files (PNG, JPG, JPEG, SVG)', 'Error', 'error');
        fileInput.value = '';
        // Reset preview to default state
        document.getElementById('uploadedAvatar_Add').classList.add('d-none');
        document.getElementById('uploadedAvatar_Add').src = '';
        return false;
    }
    
    if (file.size > maxSize) {
        showToast('File size should be less than 5MB', 'Error', 'error');
        fileInput.value = '';
        // Reset preview to default state
        document.getElementById('uploadedAvatar_Add').classList.add('d-none');
        document.getElementById('uploadedAvatar_Add').src = '';
        return false;
    }
    
    return true;
}


document.getElementById('FileUploadSingle').addEventListener('change', function(e) {
    if (validateFileUpload(this)) {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('uploadedAvatar_Add').src = e.target.result;
                document.getElementById('uploadedAvatar_Add').classList.remove('d-none');
            };
            reader.readAsDataURL(this.files[0]);
        }
    }
});

function ckvalidation() {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var ck = 0, Error = '';
    var element = '';
    var ckactive = $("#ck_active").is(":checked");
    var txtid = $('#txt_id').val();
    let formData = new FormData();

    const fileInput = document.getElementById('FileUploadSingle');
    if (!validateFileUpload(fileInput)) {
        return;
    }

    if ($('#txt_first_name').val() == '') {
        ck = 1;
        element = $('#txt_first_name');
        Error = getTranslation('please_enter_first_name');
    } else if (!$('#txt_email').val().match(mailformat)) {
        ck = 1;
        element = $('#txt_email');
        Error = getTranslation('please_enter_valid_email');
    } else if ($('#txt_phone').val() == '') {
        ck = 1;
        element = $('#txt_phone');
        Error = 'Please Enter Phone number';
    } else if ($('#txt_role_id').val() == '' || $('#txt_role_id').val() == null) {
        ck = 1;
        element = $('#txt_role_id');
        Error = getTranslation('please_select_role');
    } else if (txtid == "" && ($('#txt_password').val() == '' || updatePasswordStrength() == false)) {
        ck = 1;
        element = $('#txt_password');
        Error = getTranslation('please_enter_valid_password');
    }

    if (Boolean(ck)) {
        $(element).parents('.form-group').addClass('error');
        element.focus();
        showToast(Error, 'Error', 'error');
        return;
    }

    var icon = $('#uploadedAvatar_Add').attr('src');
    if ($('#FileUploadSingle').val() == '' && icon == '' && txtid == '') {
        Error = getTranslation('please_select_image');
        showToast(Error, 'Error', 'error');
        return;
    }

    if ($('#FileUploadSingle').val() !== undefined && $('#FileUploadSingle').val() !== '') {
        const file = $('#FileUploadSingle')[0].files[0];
        if (validateFileUpload($('#FileUploadSingle')[0])) {
            formData.append("image", file);
        }
    }
    if (txtid == "" && ($('#txt_password').val() != '' && updatePasswordStrength() == true)) {
        formData.append("password", $('#txt_password').val());
    }

    formData.append("first_name", $("#txt_first_name").val());
    formData.append("last_name", $('#txt_last_name').val());
    formData.append("email", $('#txt_email').val());
    formData.append("role_id", $('#txt_role_id').val());
    formData.append("phone", $('input[name="txt_phone"]').val());
    formData.append("status", ckactive == true ? 1 : 0);

    return {
        uuid: txtid,
        creteria: formData
    };
}


/// Validation For Password
function ckvalidation_password() { 
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var ck = 0, Error = ''; 
    var element='';
    var txtid = $('#txt_id_change').val();  
    const formData = new FormData(); 
         if (!$('#txt_email_password').val().match(mailformat)) {
            ck = 1;
            element=$('#txt_email_password'); 
            Error =  getTranslation('please_enter_valid_email');
        }else if (txtid=="" || ($('#txt_password_change').val() == '' || changePasswordStrength()==false)) {
            ck = 1;
            element=$('#txt_password_change'); 
            Error =  getTranslation('please_enter_valid_password');
        }
         
        if (Boolean(ck)) { 
            $(element).parents('.form-group').addClass('error');
            element.focus(); 
            showToast(Error, 'Error', 'error');
            return;
        }  
     
    formData.append("email", $('#txt_email_password').val())  
    formData.append("password",$('#txt_password_change').val())
    return { uuid: txtid, creteria: formData };
}

function updatePasswordStrength(password_field) {
        
    const $passwordInput = $("#txt_password");
    const $message = $('#message');
    const $progressBar = $('#progressBar');
    const $showPassword = $('#showPassword'); 

    const password = $passwordInput.val();
        const minLength = /(?=.{8,})/;
        const uppercase = /(?=.*[A-Z])/;
        const lowercase = /(?=.*[a-z])/;
        const number = /(?=.*\d)/;
        const special = /(?=.*[@#$!%*?&])/;

        let strength = 0;

        if (minLength.test(password)) strength += 20;
        if (uppercase.test(password)) strength += 20;
        if (lowercase.test(password)) strength += 20;
        if (number.test(password)) strength += 20;
        if (special.test(password)) strength += 20;

        $progressBar.css('width', `${strength}%`);

        let validationMessage = '';

        if (!minLength.test(password)) {
            validationMessage += '<p class="invalid">Password must be at least 8 characters long.</p>';
        } else {
            validationMessage += '<p class="valid">Length requirement met.</p>';
        }

        if (!uppercase.test(password)) {
            validationMessage += '<p class="invalid">Password must contain at least one uppercase letter.</p>';
        } else {
            validationMessage += '<p class="valid">Uppercase letter requirement met.</p>';
        }

        if (!lowercase.test(password)) {
            validationMessage += '<p class="invalid">Password must contain at least one lowercase letter.</p>';
        } else {
            validationMessage += '<p class="valid">Lowercase letter requirement met.</p>';
        }

        if (!number.test(password)) {
            validationMessage += '<p class="invalid">Password must contain at least one number.</p>';
        } else {
            validationMessage += '<p class="valid">Number requirement met.</p>';
        }

        if (!special.test(password)) {
            validationMessage += '<p class="invalid">Password must contain at least one special character.</p>';
        } else {
            validationMessage += '<p class="valid">Special character requirement met.</p>';
        }

        $message.html(validationMessage);
        var timeoutId = null;
        $passwordInput.on('input', function (e) {
            e.preventDefault();
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
                updatePasswordStrength();
            }, 500);
        });

        $showPassword.on('change', function() {
            if ($showPassword.is(':checked')) {
                $passwordInput.attr('type', 'text');
            } else {
                $passwordInput.attr('type', 'password');
            }
        });
    if(strength==100){
        return true;
    }else{
        return false;
    }
}


function changePasswordStrength(password_field) {
    
    $("#progressContainer_change").show();  
    const $passwordInput = $("#txt_password_change");
    const $message = $('#message_change');
    const $progressBar = $('#progressBar_change');
    const $showPassword = $('#showPassword_change'); 

    const password = $passwordInput.val();
        const minLength = /(?=.{8,})/;
        const uppercase = /(?=.*[A-Z])/;
        const lowercase = /(?=.*[a-z])/;
        const number = /(?=.*\d)/;
        const special = /(?=.*[@#$!%*?&])/;

        let strength = 0;

        if (minLength.test(password)) strength += 20;
        if (uppercase.test(password)) strength += 20;
        if (lowercase.test(password)) strength += 20;
        if (number.test(password)) strength += 20;
        if (special.test(password)) strength += 20;

        $progressBar.css('width', `${strength}%`);

        let validationMessage = '';

        if (!minLength.test(password)) {
            validationMessage += '<p class="invalid">Password must be at least 8 characters long.</p>';
        } else {
            validationMessage += '<p class="valid">Length requirement met.</p>';
        }

        if (!uppercase.test(password)) {
            validationMessage += '<p class="invalid">Password must contain at least one uppercase letter.</p>';
        } else {
            validationMessage += '<p class="valid">Uppercase letter requirement met.</p>';
        }

        if (!lowercase.test(password)) {
            validationMessage += '<p class="invalid">Password must contain at least one lowercase letter.</p>';
        } else {
            validationMessage += '<p class="valid">Lowercase letter requirement met.</p>';
        }

        if (!number.test(password)) {
            validationMessage += '<p class="invalid">Password must contain at least one number.</p>';
        } else {
            validationMessage += '<p class="valid">Number requirement met.</p>';
        }

        if (!special.test(password)) {
            validationMessage += '<p class="invalid">Password must contain at least one special character.</p>';
        } else {
            validationMessage += '<p class="valid">Special character requirement met.</p>';
        }

        $message.html(validationMessage);
        $passwordInput.on('input', updatePasswordStrength); 
        $showPassword.on('change', function() {
            if ($showPassword.is(':checked')) {
                $passwordInput.attr('type', 'text');
            } else {
                $passwordInput.attr('type', 'password');
            }
        });
    if(strength==100){
        return true;
    }else{
        return false;
    }
}

        