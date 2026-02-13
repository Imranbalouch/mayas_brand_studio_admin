document.title="Dashboard | Meun List Details";
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
if (page_params.has('Id')) {
    Id = page_params.get('Id');
}else{
    Id ='';
} 
 $(document).ready(function() {  
    Onload(Id);  
     $(document).on('change input', 'input[name="icon_font"]', function() {
        //  setTimeout(() => {
        //      updateLiDataValues();
        //    //  updateOutput($('#nestable').data('output', $('#json-output')));
        //      alert("Icon font changed!");
        // }, 2000)
        //  console.log("Icon font changed!");
        const iconId = $(this).attr('id'); // e.g., menu-node-icon-font-8504453
        const iconFont = $(this).val(); // Get the value of the input
        const number = iconId.match(/\d+$/)[0]; // Extract the last number
        // console.log("Icon font value:", iconFont, "Number:", number);

        // Get the current JSON data from the textarea
          let jsonString = $('#json-output').val();
    
        // Initialize with empty array if no valid JSON
        let jsonData = [];
        if (jsonString && jsonString.trim() !== '') {
            try {
                jsonData = JSON.parse(jsonString);
            } catch (e) {
                console.error("Error parsing JSON:", e);
                jsonData = [];
            }
        }
        
        // Find the item with matching ID and update its icon
        jsonData = jsonData.map(item => {
            if (item.id == number) { // Note: == instead of === since one might be string, other number
                return {
                    ...item,
                    icon: iconFont
                };
            }
            return item;
        });
        
        // Update the textarea with the modified JSON
        $('#json-output').val(JSON.stringify(jsonData, null, 2));
        
        });
    });    
 $("#txt_lang_id").on("change", function () {  
    Onload(Id);   
});
 

function discon(){
  //  document.getElementById('create_form').reset();
    btnsav.hide();
    btnupd.hide();  
    $('#ck_active').prop('checked');
    txtid.html('');   
    Onload(Id);
    imgload.hide();
}
function show_hide(element) { 
    event.preventDefault(); 
    const liElement = element.closest('li');
    if (!liElement) {
        console.error('No <li> element found');
        return;
    } 
    const details = liElement.querySelector('.item-details');
    if (!details) {
        console.error('No .item-details element found');
        return;
    } 
    const iconPath = element.querySelector('.icon-path');
    if (!iconPath) {
        console.error('No .icon-path element found');
        return;
    } 
    if (details.style.display === 'none' || details.style.display === '') {
        details.style.display = 'block';
        iconPath.setAttribute('d', 'M6 15l6-6l6 6'); // Up Arrow
    } else {
        details.style.display = 'none';
        iconPath.setAttribute('d', 'M6 9l6 6l6 -6'); // Down Arrow
    }
}

function hide_this(id) { 
    const detailsElement = document.getElementById(id);
    if (detailsElement) {
        detailsElement.style.display = 'none';
    } 
    const iconPath = detailsElement.previousElementSibling.querySelector('.icon-path');
    if (iconPath) {
        iconPath.setAttribute('d', 'M6 9l6 6l6 -6');  
    }
}
function remove_this(id) { 
    const detailsElement = document.getElementById(id); 
    if (detailsElement) { 
        const liElement = detailsElement.closest('li'); 
        if (liElement) { 
            liElement.remove(); 
            updateOutput($('#nestable').data('output', $('#json-output')));
            if($('#json-output').val()=="[]"){
              //  $("#btn_update").hide();
            }
        }
    }
    
} 



function add_this(){
var List = $(".dd-list");
if(List.length==0){
  //  console.log(List.length);
 //$("#nestable").append('<ol class="dd-list"></ol>');
}
var nestableList = $("#nestable>.dd-list"); 
var Error = '';
var html='';
var txt_id=Math.floor(Math.random()*9999999);
var txt_title=$("#txt_title").val();
var txt_url=$("#txt_url").val();
var txt_icon=$("#txt_icon_font").val();
var txt_class=$("#txt_css_class").val();
var txt_target=$("#cmb_target").val(); 
        var selected_self='';
        var selected_blank='';
        var selected=txt_target; 
        if(selected=='_blank'){
            selected_blank='selected="selected"';
        }else{
            selected_self='selected="selected"';
            
        }
if (txt_title.trim()=="") {  
    $(txt_title).parents('.form-group').addClass('error');
    $("#txt_title").focus(); 
    Error =  getTranslation('please_enter_title');
    showToast(Error, 'Error', 'error');
    return;
}
html+=`<li class="dd-item dd3-item" data-id="`+txt_id +`" data-name="`+ txt_title +`"  data-target="`+ txt_target +`" data-icon="`+ txt_icon +`" data-url="`+ txt_url +`" data-class="`+ txt_class +`">
<div class="dd-handle dd3-handle"></div>
<div class="dd3-content d-flex justify-content-between">
    <div data-title="title" class="fw-medium" id="menu-node-html-title-`+txt_id+`">`+txt_title+`</div>
    <div class="text-end me-5"></div>
    <a class="show-item-details" onclick="show_hide(this); return false;" href="#"> 
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path class="icon-path" d="M6 9l6 6l6 -6"></path>
</svg>        </a>
</div>
<div class="item-details" style="display: none;" id="item_details_`+txt_id+`"> 
    <div class="mb-3">
       <label for="menu-node-title-`+txt_id+`" class="form-label" data-update="title">Title</label> 
            <input class="form-control" data-old="Blogs" id="menu-node-title-`+txt_id+`" name="title" type="text" value="`+ txt_title +`">
</div> 
    <div class="mb-3">
      <label for="menu-node-url-`+txt_id+`" class="form-label" data-update="custom-url">URL</label> 
            <input class="form-control" data-old="/" id="menu-node-url-`+txt_id+`" name="url" type="text" value="`+ txt_url +`">
    </div> 
   
    <div class="mb-3">
        <div class="mb-6 fv-row col-md-3">
            <div class="form-group">
                <label class="form-label" for="menu-node-icon-font-`+txt_id+`" data-update="icon_font">Icon <span></span></label>
                <div class="input-group custome-filemanager" onclick="customFilemanager(this)" data-type="image" >
                    <div class="input-group-prepend">
                        <div
                            class="input-group-text bg-soft-secondary font-weight-medium">
                            Browse
                        </div>
                    </div>
                    <div class="form-control file-amount">Choose File</div>
                    <input type="hidden" id="menu-node-icon-font-`+txt_id+`" name="icon_font" value="`+ txt_icon +`" class="selected-files">
                </div>
                <div class="row mx-1  filemanager-image-preview">
                </div>
            </div>
        </div>
    </div>
    <div class="mb-3">
       <label for="menu-node-css-class-`+txt_id+`" class="form-label" data-update="css_class">CSS class</label>
      <input class="form-control" data-old="" id="menu-node-css-class-`+txt_id+`" name="css_class" type="text" value="`+ txt_class +`">
</div> 
    <div class="mb-3">
      <label  class="form-label" data-update="target">Target</label>
          <select class="form-control" name="target" id="menu-node-target-`+txt_id+`">
          <option value="_self" `+selected_self+`>Open link directly</option>
          <option value="_blank" `+selected_blank+`>Open link in new tab</option>
          </select>
</div> 
    <div class="text-end mt-2">
        <a class="btn btn-danger  btn-remove btn-sm" href="#" onclick="remove_this('item_details_`+txt_id+`');">Remove</a>
        <a class="btn btn-primary btn-cancel btn-sm" href="#" onclick="hide_this('item_details_`+txt_id+`');">Cancel</a>
    </div>
</div></li>
<div class="clearfix"></div>`;
  //console.log(html);
nestableList.append(html);
updateOutput($('#nestable').data('output', $('#json-output')));

$("#txt_title").val('');
$("#txt_url").val('');
$("#txt_icon_font").val('');
$("#txt_css_class").val('');
$("#cmb_target").val('_self'); 
$("#btn_update").show();
}




function updateLiDataValues() {
    // Find all <li> elements with class 'dd-item'
    const listItems = document.querySelectorAll('.dd-item');
    
    listItems.forEach(item => {
        // Find the corresponding detail div
        const detailDiv = item.querySelector('.item-details'); 
        
        if (!detailDiv) return;

        // Find all input fields within this detail div
        const titleInput = detailDiv.querySelector('input[name="title"]');
        const urlInput = detailDiv.querySelector('input[name="url"]');
        const iconInput = detailDiv.querySelector('input[name="icon_font"]');
        const cssClassInput = detailDiv.querySelector('input[name="css_class"]');
        const targetSelect = detailDiv.querySelector('select[name="target"]');
        // Update data attributes based on the input field values
        if (titleInput) item.setAttribute('data-name', titleInput.value);
        if (urlInput) item.setAttribute('data-url', urlInput.value);
        if (iconInput) item.setAttribute('data-icon', iconInput.value);
        if (cssClassInput) item.setAttribute('data-class', cssClassInput.value);
        if (targetSelect) item.setAttribute('data-target', targetSelect.value);
        //  if (titleInput) $("#").html(titleInput.value);
    });
    // alert('Updated');
}


var editMenu = function (id) { 
    var targetId = id;
    var title = $("#menu-node-title-"+id).val();
    var url =$("#menu-node-url-"+id).val(); 
    var icon_font =$("#menu-node-icon-font-"+id).val(); 
    var css_class =$("#menu-node-css-class-"+id).val(); 
    var target2 =$("#menu-node-target-"+id).val();  
    var target = $('[data-id="' + targetId + '"]'); 
    target.data("name", title);
    target.data("url", url);
    target.data("icon", icon_font);
    target.data("class", css_class);
    target.data("target", target2); 
    $("#menu-node-html-title-"+id).html(title); 
    menuEditor.fadeOut(); 
    // update JSON
    updateOutput($('#nestable').data('output', $('#json-output')));
    
  };
// Attach event listeners to input fields and select elements
document.addEventListener('input', function(event) {
    if (event.target.matches('input[name="title"], input[name="url"], input[name="icon_font"], input[name="css_class"], select[name="target"]')) {
        console.log("event.target.matches('input[name=\"title\"]')",event.target);
        let timeout;
        updateLiDataValues(); 
        clearTimeout(timeout); 
        $("#btn_update").prop("disabled", true);
        timeout = setTimeout(function() {
            var target_id=event.target.parentElement.parentElement.parentElement.getAttribute("data-id");
            editMenu(target_id);
            $("#btn_update").prop("disabled", false);
        },2000)
    }
});

function buildNestableList(items) {
  //  var html = '<ol class="dd-list">';
  var html = '<ol class="dd-list">'; 
    items.forEach(function(item) {
        var selected_self='';
        var selected_blank='';
        var selected=item.target;
       // console.log(selected);
        if(selected=='_blank'){
            selected_blank='selected="selected"';
        }else{
            selected_self='selected="selected"';
            
        }
    html+=`<li class="dd-item dd3-item" data-id="`+item.id +`" data-name="`+ item.name +`"   data-target="`+ item.target +`" data-icon="`+ item.icon +`" data-url="`+ item.url +`" data-class="`+ item.class +`">
    <div class="dd-handle dd3-handle"></div>
    <div class="dd3-content d-flex justify-content-between">
        <div data-update="title" class="fw-medium" id="menu-node-html-title-`+item.id+`">`+item.name+`</div>
        <div class="text-end me-5"></div>
        <a class="show-item-details" onclick="show_hide(this); return false;" href="#"> 
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path class="icon-path" d="M6 9l6 6l6 -6"></path>
</svg>        </a>
    </div>
    <div class="item-details" style="display: none;" id="item_details_`+item.id+`"> 
        <div class="mb-20 fv-row">
            <label for="menu-node-title-`+item.id +`" class="form-label" data-update="title">Title</label> 
            <input class="form-control mb-2"   id="menu-node-title-`+item.id +`" name="title" type="text" value="`+ item.name +`">
        </div>
        <div class="mb-20 fv-row">
            <label for="menu-node-url-`+item.id +`" class="form-label" data-update="custom-url">URL</label> 
            <input class="form-control mb-2"  id="menu-node-url-`+item.id +`" name="url" type="text" value="`+ item.url +`">
        </div> 
        <div class="mb-20">
            <div class="form-group">
                <label class="form-label" for="menu-node-icon-font-`+item.id+`" data-update="icon_font">Icon <span></span></label>
                <div class="input-group custome-filemanager" onclick="customFilemanager(this)" data-type="image" >
                    <div class="input-group-prepend">
                        <div class="input-group-text bg-soft-secondary font-weight-medium">
                            Browse
                        </div>
                    </div>
                    <div class="form-control file-amount">Choose File</div>
                    <input type="hidden" id="menu-node-icon-font-`+item.id+`" name="icon_font" value="`+ item.icon +`" class="selected-files">
                </div>
                <div class="row mx-1 filemanager-image-preview" id="file_`+item.id+`">
                </div>
            </div>
        </div>
        <div class="mb-20 fv-row">
            <label for="menu-node-css-class-`+item.id +`" class="form-label" data-update="css_class">CSS class</label>
            <input class="form-control mb-2"   id="menu-node-css-class-`+item.id +`"" name="css_class" type="text" value="`+ item.class +`">
        </div> 
        <div class="mb-20 fv-row">
            <label  class="form-label" data-update="target">Target</label>
            <select class="form-control mb-2" name="target" id="menu-node-target-`+item.id +`">
                <option value="_self" `+selected_self+`>Open link directly</option>
                <option value="_blank" `+selected_blank+`>Open link in new tab</option>
            </select>
        </div>
        <div class="text-end mt-2">
            <a class="btn btn-danger  btn-remove" href="#" onclick="remove_this('item_details_`+item.id+`');">Remove</a>
            <a class="btn btn-primary btn-cancel btn-sm" href="#" onclick="hide_this('item_details_`+item.id+`');">Cancel</a>
        </div>
    </div>`;
    
     if (item.children && item.children.length > 0) {
        html += buildNestableList(item.children);
      } 
      html +=`</li>
    <div class="clearfix"></div>`;
});
    html += '</ol>'; 
    return html;
  }
 

/// EDIT RECORD START
function Onload(Id) { 
    var id = Id; 
    if(id==""){
        return false;
    }
    $("#txt_id").val(id); 
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
               var options='';
              
               var is_default_lang_code=''; 
               var menu_details=[];
               var translations=response["data"]['translations'];  
                if(translations.length>0){
                    $('#myTab').html(''); 
                } 
               var selected_lang= $("#txt_lang_id").val();
                for ( var i = 0, l = translations.length; i < l; i++) { 
                     //console.log(selected_lang);
                     var is_default=''; 
                    if(selected_lang==null || selected_lang==""){
                       // console.log(selected_lang);
                        if(translations[i]['is_default']==1){  
                            is_default='selected="selected"';
                            is_default_lang_code=translations[i]['language_code']; 
                            menu_details=translations[i]['menudetail']; 
                          //  console.log(is_default_lang_code);
                        }
                    }else{
                        if(selected_lang==translations[i]['language_code']){ 
                            //console.log(is_default_lang_code); 
                            is_default='selected="selected"';
                            is_default_lang_code=translations[i]['language_code']; 
                            menu_details=translations[i]['menudetail'];
                            //console.log(menu_details);
                            
                        }
                    }
                    options+=`<option ${is_default} value="${translations[i]['language_code']}">${translations[i]['language_name']}</option>`;
                }    
                //console.log(options);
                 $('#txt_lang_id').selectpicker('destroy'); 
                $("#txt_lang_id").empty(); 
                $("#txt_lang_id").append(options);
                $('#txt_lang_id').selectpicker('render');
               // $('#txt_lang_id').selectpicker('refresh'); 
                $("#detail_id").html(response["data"]['name']);
            
                //menu_details=translations['menudetail_'+is_default_lang_code];
                
                if(menu_details!= null && menu_details.length>0){
                   
                
                // var menu_details = [
                //         {"deleted":0,"new":0,"slug":"home-slug-1","name":"Home1","id":1,"url":"http:","icon":"icon","class":"class","target":"_self"},
                //         {"deleted":0,"new":0,"slug":"about-slug-2","name":"About Us1","id":2},
                //         {"deleted":0,"new":0,"slug":"services-slug-3","name":"Services1","id":3,"children":[
                //           {"deleted":0,"new":0,"slug":"uiux-slug-4","name":"UI/UX Design1","id":4}
                //         ]},
                //         {"deleted":0,"new":0,"slug":"webdesign-slug-5","name":"Web Design1","id":5},
                //         {"deleted":0,"new":0,"slug":"contact-slug-6","name":"Contact Us1","id":6}
                //       ];
                var nestableHtml = buildNestableList(JSON.parse(menu_details));
                $('#nestable').html(nestableHtml);
                $('#nestable').nestable({
                    maxDepth: 5
                  }).on('change', updateOutput); 
                  updateOutput($('#nestable').data('output', $('#json-output')));
                }else{
                    $('#nestable').append('<ol class="dd-list"></ol>');
                  //  $("#btn_update").hide();
                }
                imgload.hide();
                filemanagerImagepreview();
            }
            else {
                imgload.hide();
                var title = response.status_code == 405 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + response.message + "' target='_blank'>" + " " + response.message + "</a>" : response.message;
                showToast(title, 'warning', 'warning');
            }

        },
        error: function (xhr, status, err) { 
            imgload.hide(); 
            showToast(getTranslation('internal_server_error'), 'Error', 'error');
        }

    }); 

} 
//// EDIT RECORD END



//UPDATE RECORD START
function update_record() {
    //updateOutput($('#nestable').data('output', $('#json-output')));
    var ck = ckvalidation();

 //    console.log(ck.creteria);
   //  return;
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
                    xhr.setRequestHeader("theme-uuid", theme_id);
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
                        Onload(Id);
                       showToast(getTranslation('Menu details updated successfully'), 'Success', 'success');
                    }  
                },
                error: function (xhr, status, err) {  
                    imgload.hide();
                    btnupd.show();
                    const data = xhr.responseJSON.errors;
                    var title = xhr.responseJSON.status_code == 404 ? "Error # <a href='" + apiUrl_View + "/Configuration/Report/ErrorLog?I=" + xhr.responseJSON.message + "' target='_blank'>" + " " + xhr.responseJSON.message + "</a>" : xhr.responseJSON.message;
                    showToast(title, 'Error', 'error');
                }
            })

        }
    })

}
//UPDATE RECORD END
 

function ckvalidation() {  
    var txtid = $('#txt_id').val();
    var txt_lang_id = $('#txt_lang_id').val();
    var json_output = $('#json-output').val();
    const formData = new FormData();  
    formData.append("menudetail_"+txt_lang_id,json_output) 
    formData.append("status",1)
    //console.log(formData);
    return { uuid: txtid, creteria: formData };
}


 