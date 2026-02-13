document.title="Dashboard | Admin Plugins";
var PageNo = 1;
var PageSize = 10;
var totalRecord = 0;
var PageLength = 0;
var Search = '';
let keyupTimer;
var btnupd = $('#btn_upd');
var btnsav = $('#btn_sav');
var txtid = $('#txt_id');
var btnnew=$('#btnnew');
let translations=[]; 
 $(document).ready(function() {  
    Onload(); 
 }); 
  
function discon(){
    //document.getElementById('create_form').reset();
    $("#txt_purchase_id").val('');
    btnsav.hide();
    btnupd.hide();   
    txtid.html('');   
    Onload(); 
    imgload.hide();
   
}
   function Onload() { 
   // $('#Table_View').DataTable().clear().destroy();
    $('#buttons').html('');
  //PageSize=10;
    $.ajax({
        url: ApiForm + '/get_plugin',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        headers: {"Authorization": "Bearer "+strkey,'menu-uuid':menu_id},
        //menu_id:_menuid,
        
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            // xhr.setRequestHeader("MenuId", _menuid);
            // xhr.setRequestHeader("PageSize", PageSize);
            // xhr.setRequestHeader("PageNo", PageNo);
            // xhr.setRequestHeader("Language", selected_lang);
            // xhr.setRequestHeader("Search", Search);
            imgload.show();
        },
        success: function (response) {

            if (response.status_code == 200) {
                 
                if (response["data"] != null) {
                    pluginItems=response.data;
                    if(pluginItems.length>0){  
                        $("#plugin_item").html('');
                        var  mainimage= AssetsPath+'no-image.jpg';
                        for (let i = 0; i < pluginItems.length; i++) {
                            if(pluginItems[i].icon!=null){
                            mainimage= AssetsPath+pluginItems[i].icon;
                            } 
                        var button=`<button type="button" data-id="${pluginItems[i].uuid}" data-title="${pluginItems[i].name}" data-desc="${pluginItems[i].description}"  data-img="${mainimage}"  data-status="${pluginItems[i].is_plugin_active}"   class="btn btn-primary-small modify_btn">Activate</button>`;
                        if(pluginItems[i].is_plugin_active==1){
                            button=`<button type="button" data-id="${pluginItems[i].uuid}" data-title="${pluginItems[i].name}" data-desc="${pluginItems[i].description}"  data-img="${mainimage}"  data-status="${pluginItems[i].is_plugin_active}"  class="btn btn-primary-small-red modify_btn">Deactivate</button>`;
                        }
                    html=`<div class="col-lg-4">
                    <div class="widget-content1">
                        <div class="  h-100"> 
                            <div class="img-responsive plugin_item" style="background-image: url('${mainimage}');">  
                            </div> 
                            </div><div class="card-body">
                                <h4 class="card-title">${pluginItems[i].name}</h4>
                                <p class="text-secondary">${pluginItems[i].description}</p>
                            </div>
                                <div class="card-footer">
                                        <div class="d-flex">
                                                ${button}
                                        </div>
                                </div>
                        </div>
                </div></div>`; 
                $("#plugin_item").append(html);
            }
        }
                    imgload.hide();
                  
                }
            }else if (response.statusCode == 404) {
                imgload.hide();
                 
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
 //onclick="update_record('${pluginItems[i].uuid}'); 
 $('#content').on('click', '.modify_btn',function (e) {
    p_id=$(this).data('id');
    p_title=$(this).data('title');
    p_desc=$(this).data('desc');
    p_img=$(this).data('img');
    p_status=$(this).data('status');
    //console.log($(this).data('id'));
    if(p_status==0){
        $("#popup_title").html("Purchase Plugin");
        $("#btn_upd").html("Activate");
        $("#btn_upd").val("Activate");
        $("#btn_upd").addClass("btn-primary-small");
        $("#btn_upd").removeClass("btn-primary-small-red");
    }else{
        $("#popup_title").html("Deactivate Plugin");
        $("#btn_upd").html("Deactivate");
        $("#btn_upd").val("Deactivate");
        $("#btn_upd").addClass("btn-primary-small-red");
        $("#btn_upd").removeClass("btn-primary-small");
    }
    $("#txt_id").val(p_id);
    $("#txt_p_img").attr('src',p_img);
    $("#txt_p_title").html(p_title);
    $("#txt_p_desc").html(p_desc);
    $("#txt_status").val(p_status);
    $('#edit_Modal').modal('show'); 

});  
  


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
                url: ApiForm + '/plugin_status',
                type: "Post",
                processData: false,
                contentType: false,
                data: cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
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
                        
                        Swal.fire({
                            title: getTranslation('record_updated_sucessfully'), 
                            icon: 'success',
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
                    btnupd.show();
                    const data = xhr.responseJSON.errors;
                    //console.log(xhr.responseJSON.message);
                    var title = xhr.responseJSON.status_code == 404 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + xhr.responseJSON.message + "' target='_blank'>" + " " + xhr.responseJSON.message + "</a>" : xhr.responseJSON.message;
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
            })

        }
    })
   
}
//UPDATE RECORD END
 

function ckvalidation() {
    var ck = 0, Error = ''; 
    var element=''; 
    var txtid = $('#txt_id').val(); 
        if ($('#txt_purchase_id').val() == '') {
            ck = 1;
            element=$('#txt_purchase_id'); 
            Error =  getTranslation('please_enter_purchase_code');
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
    

    const formData = new FormData()  
    formData.append("uuid", txtid) 
    formData.append("purchase_id", $('#txt_purchase_id').val())  
    formData.append("is_plugin_active", ($('#txt_status').val()==1) ? 0 :1) 
    
//    var  _cre = JSON.stringify({
//             "id": txtid,
//             "Name_EN": txt_name_en,
//             "prefix_EN": txt_prefix_en,
//             "Status": ckactive == true ? "Active" : "Inactive",
//             "name_AR": txt_name_ar,
//             "prefix_AR": txt_prefix_ar,
//             "levelNo": txt_levelNo,
//         });
        //console.log(formData);
        //return formData;
    return { uuid: txtid, creteria: formData };
}

 