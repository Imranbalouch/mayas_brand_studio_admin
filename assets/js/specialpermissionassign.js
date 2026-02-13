document.title="Dashboard | Special Permission";
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
    btnupd.hide();
    ComponentsDropdowns.init();
 }); 
  
$("#cmb_user_id").on("change", function () { 
    user_id = this.value; 
    if (user_id != '') { 
          Onload(user_id);  
    }
}); 
 
var ComponentsDropdowns = function () {
    var handleSelect2 = function () { 
        FillUsers(); 
    }
    return { 
        init: function () {
            setTimeout(function() { 
                $('.selectpicker').selectpicker();
                handleSelect2();
            }, 1000);
           
        }
    };
}();
function FillUsers() {   
    $.ajax({
        url: ApiForm + '/get_active_users',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend : function (request) {
            request.setRequestHeader("Authorization", 'Bearer ' + strkey); 
        },
        success: function(data) { 
            var blnk= `<option value="">${getTranslation('none')}</option>`;
            var options = data.data.map(function(item) {
                return `<option value="${item.id}">${item.name}</option>`;
            }).join(''); 
            // Update selectpicker
             $('#cmb_user_id').html(options);
             
            // Refresh selectpicker to apply new options
            $('#cmb_user_id').selectpicker('refresh'); 
        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', status, error);
        }
     
     
});
}
function discon(){   
    btnsav.hide();
    btnupd.hide();   
    txtid.html('');    
    imgload.hide();  
    $('.selectpicker').selectpicker();
}

function check_value(user_id,mmenu_id,pm_id,permissionAssign){ 
    if(user_id=="" || mmenu_id== "" || pm_id== ""||permissionAssign==null){
        return false;
    }else{ 
        return permissionAssign.some(item => 
            item.user_id == user_id && 
            item.menu_id == mmenu_id && 
            item.permission_id == pm_id
          );
    }
}
function checkall(p_id){ 
    var p_value=$("#ck_head_"+p_id).is(':checked');
    $('.checkmark_'+p_id).prop('checked', p_value); 
}
   function Onload(user_id) {  
    $('#buttons').html('');
  //console.log(role_id);
    $.ajax({
        url: ApiForm + '/get_special_permission_assign',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        headers: {"Authorization": "Bearer "+strkey,'menu-uuid':menu_id},
        //menu_id:_menuid,
        
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey); 
            xhr.setRequestHeader("user-id",user_id); 
            imgload.show();
        },
        success: function (response) {

            if (response.status_code == 200) {
                var action_button = ' ';
                //New
                if (response["new"] == 1) {
                   // btnnew.show();
                } 
                //Update 
                if (response["update"]== 1) {
                  //  action_button += `<a href='javascript:;' class='modify_btn btn-edit' data-toggle='tooltip' title='>${getTranslation('edit')}'>${getTranslation('edit')}</a>`;
                  
                } 
                // //Delete
                if (Boolean(response["delete"])) {
                    // action_button += ` | <a href='javascript:;' class='modify_btn btn-delete' data-toggle='tooltip' title='Delete'>${getTranslation('delete')}</a>`;
                }
                $("#tbl_header").html('');
                if (response["permissions"] != null) { 
                    permissions=response["permissions"];
                    //var role_id=$("#cmb_role_id").val(); 
                    var th_row='<th style="font-weight:bold;"><br>'+getTranslation("menu")+'</th>'; 
                    for (var p_sno = 0; p_sno < permissions.length; p_sno++) {
                        p_id=permissions[p_sno]['permission_id'];
                        th_row +=  
                    '<th style="width:10%;text-align:center;font-weight:bold;"><input type="checkbox" class="form-check-input checkmark" id="ck_head_' + p_id + '" name="ck_head"  onclick="checkall(' + p_id + ')"><label class="d-block" for="ck_head_' + p_id + '" onclick="checkall(' + p_id + ')">' + (permissions[p_sno]['permission_name']) + '</label></th>'; 
                    }
                    $("#tbl_header").append(th_row);  
                    if(response["menus"] != null){ 
                        permission_menus=response["menus"]; 
                        var permissionAssign=response["data"];
                        var li_row='';
                        var check =""; 
                        for (var pd_sno = 0; pd_sno < permission_menus.length; pd_sno++) {
                            mmenu_id=permission_menus[pd_sno]['menu_id'];
                            menu_name=permission_menus[pd_sno]['menu_name'];
                            //th_head_count;
                            li_row +=  '<tr>'+
                                '<td style="font-weight:bold;">'+menu_name+'</td>';
                                for (var ck_sno = 0; ck_sno < permissions.length; ck_sno++) {
                                    pm_id=permissions[ck_sno]['permission_id'];
                                    if (permissionAssign.some(item => item.menu_id == mmenu_id && item.permission_id == pm_id && item.status == 1)) {
                                        check = 'checked="checked"';
                                    } else {
                                        check = '';
                                    }                                       
                                    li_row += '<td style="height:30px;text-align:center;font-weight:bold;"><input type="checkbox" class="form-check-input input_checkbox checkmark_' + pm_id + '"  '+check+'  id="ck_check_'+mmenu_id+'_' + pm_id + '" name="ck_check"  data-user-id="'+user_id +'" data-menu-id="'+ mmenu_id +'" data-permission-id="'+ pm_id +'"></td>';
                                }
                              li_row += '</tr>';
                        }
                    }
                    $("#tbl_body").html('');
                    $("#tbl_body").append(li_row);
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
        error: function(xhr, status, err) {
            imgload.hide();
            let errorMessage = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'An unknown error occurred';
            showToast(errorMessage, 'Error', 'error');
        } 
    })  
    btnupd.show();
    return true;

}

 

 
 


//UPDATE RECORD START
function update_record() {
    var ck = ckvalidation(); 
    if (ck == 1) { return; }
    var user_id = ck.user_id; 
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
                url: ApiForm + '/update_special_permission_assign',
                type: "Post",
                processData: false,
                contentType: false,
                data: cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("menu-uuid", menu_id); 
                    xhr.setRequestHeader("user-id", user_id); 
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
                        showToast(getTranslation('Special Permission updated successfully'), 'Success', 'success');
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
 
 
 
function ckvalidation() {  
    var user_id = $('#cmb_user_id').val();   
        const checkboxes = document.querySelectorAll('.input_checkbox'); 
        const results = []; 
        checkboxes.forEach(checkbox => {
          results.push({
           // id: checkbox.id,
           // status: checkbox.checked,
            status: checkbox.checked,
           // user_id: checkbox.getAttribute('data-user-id'),
            menu_id: checkbox.getAttribute('data-menu-id'),
            permission_id: checkbox.getAttribute('data-permission-id')
          });
        }); 
        const checkedResults = results.filter(result => result.status);
                checkedResults.forEach(result => {
                    result.status = "1";
                    //result.role_id = role_id;
                });
        //console.log(checkedResults);
       // console.log(results);
     
      var final_data= JSON.stringify(checkedResults);
    //  / console.log(final_data);
    const formData = new FormData();
    formData.append("permission_assign",final_data)
    return { user_id: user_id, creteria: formData };
}
 
