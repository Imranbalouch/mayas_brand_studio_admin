document.title="Dashboard | Widgets";
let PageNo = 1;
let PageSize = 10;
let totalRecord = 0;
let PageLength = 0;
let Search = '';
let keyupTimer;
let newBtnHF = '';
var btn_new=$('#btn_new');
$(document).ready(function () {
    if (page_params.has('themeId')) {
        themeId = page_params.get('themeId');
    }
    btn_new.click(function (e) {
        e.preventDefault();
        let page = 'widgetadd';
        window.location.assign('?P='+page+'&M='+menu_id+'&themeId='+themeId);
    });
    Onload();
});
function Onload() {
    $('#Table_View').DataTable().clear().destroy();
    $('#buttons').html('');
    $.ajax({
        url: ApiCms + '/theme/widgets',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            xhr.setRequestHeader("widget-uuid", widgetPermission);
            xhr.setRequestHeader("theme-id", themeId);
            imgload.show();
        },
        success: function (response) {
            if (response.status_code == 200) {
                imgload.hide();                
                let action_button = '';
                //New
                if (Boolean(response.permissions['add'])) {
                    btn_new.show();
                }
                //Update 
                if (Boolean(response.permissions["edit"])) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-edit table_buttons' data-toggle='tooltip' title='Edit'><i class="ri-edit-box-line   text-warning"></i> ${getTranslation('edit')}</a>`;
                }
                if (Boolean(response.permissions["edit"]) && Boolean(response.permissions["delete"])) {
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
                        { 
                            data: 'name',
                            render: function (data, type, row) {
                                if (type === 'display') {
                                    newBtnHF = '';
                                    if (row.widget_type == "header") {
                                        newBtnHF = `| <a href='javascript:;' class='modify_btn btn-header' data-toggle='tooltip' title='Header'>${getTranslation('Header')}</a>`;
                                    }
                                    if (row.widget_type == "footer") {
                                        newBtnHF = `| <a href='javascript:;' class='modify_btn btn-footer' data-toggle='tooltip' title='Footer'>${getTranslation('Footer')}</a>`;
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
                        },
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
        error: function(xhr, status, err) {
            imgload.hide();
            let errorMessage = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'An unknown error occurred';
            showToast(errorMessage, 'Error', 'error');
        } 
    })
    return true;
}

$(document).on('click', '.btn-edit', function (e) {
    e.preventDefault();
    $("#popup_title").html(getTranslation("modify_menu"));
    let currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    let data = $('#Table_View').DataTable().row(currentRow).data();
    let uuid = data['uuid'];
    let page = 'widgetedit';  
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
        url: ApiCms + "/theme/widget/status/"+$(el).val(),
        type: "POST",
        data: {status:status},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (data) {
            imgload.hide();
            showToast(data.message, 'Success', 'success');
        },
        error: function (xhr, status, err) {
            imgload.hide();
            showToast("", 'Error', 'error');
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
                url: ApiCms + "/theme/widget/delete/"+uuid,
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
                        showToast(data.message, 'Success', 'success','self');
                    }
                },
                error: function (xhr, status, err) {
                    imgload.hide();
                    showToast('', 'Error', 'error');
                }
            });
        }
    });
});


// btn-header click
let shortkey = '';
$(document).on('click', '.btn-header', async function(e){
    e.preventDefault();
    let currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    let data = $('#Table_View').DataTable().row(currentRow).data();
    shortkey = data.shortkey;
    await activeLanguages();
    let langvalue = $('#widget_language').val();
    header(shortkey,langvalue);
});

$('#widget_language').on('change',  function(e) {
    e.preventDefault();
    var selectedValue = $(this).val();
    console.log(selectedValue);
    header(shortkey,selectedValue);
});

async function header(shortkey,langvalue){
    $('#shortcodeModal').modal('hide');
    const response = await $.ajax({
        url: ApiCms + "/page/widget-show/"+shortkey+"?lang="+langvalue,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            xhr.setRequestHeader("theme-id", themeId);
            imgload.show();
        },
    });
    if (response.status_code === 200) {
        imgload.hide();
        let attributes = '';
        if (response.data && response.data.default_data) {
            attributes = getAttributes(response.data.default_data);
        }
        $(".modal-title").text("Header");
        let moduelData = await generateFormFields(response.data.widget_type, response.data.widget_fields);

        $('.shortcode-item').html(moduelData.html);

        // Populate the menu list if there's a menu input field
        
        if (moduelData.menuInput) {
            let menus = moduelData.menuInput;
            menus.forEach(async function(menu){
                await menuList(menu);
                $('.shortcode-item').find('select').each(function () {
                    let name = $(this).attr('name');
                    if (attributes[name]) {
                        $(this).val(attributes[name]).trigger('change');
                    }
                });
            });
        }

        // Set input/textarea values based on attributes
        $('.shortcode-item').find('input,textarea').each(function () {
            let name = $(this).attr('name');
            if (attributes[name]) {
                $(this).val(attributes[name]);
            }
        });
        
        $('#widgetForm').find('input[name=shortkey]').val(response.data.shortkey);
        $('#shortcodeModal').modal('show');
        filemanagerImagepreview();
    }
}
// btn-footer click
$(document).on('click', '.btn-footer', async function(e){
    e.preventDefault();
    let currentRow = $(this).closest("tr");
    if (currentRow.hasClass('child')) {
        currentRow = currentRow.prev('tr.dtrg-start');
    }
    let data = $('#Table_View').DataTable().row(currentRow).data();
    shortkey = data.shortkey; // Store shortkey globally for language change
    await activeLanguages(); // Populate language dropdown
    let langvalue = $('#widget_language').val() || ''; // Get selected language (default to empty if none)
    footer(shortkey, langvalue); // Call footer function
    
    async function footer(shortkey, langvalue) {
    $('#shortcodeModal').modal('hide');
    const response = await $.ajax({
        url: ApiCms + "/page/widget-show/" + shortkey + "?lang=" + langvalue,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            xhr.setRequestHeader("theme-id", themeId);
            imgload.show();
        },
    });
    if (response.status_code == 200) {
        imgload.hide();              
        $(".modal-title").text("Footer");
        let moduelData = await generateFormFields(response.data.widget_type, response.data.widget_fields);
        let attributes = '';
        if (response.data && response.data.default_data) {
            attributes = getAttributes(response.data.default_data);
        }
        $('.shortcode-item').html(moduelData.html);
        $('.shortcode-item').find('input,select,textarea').each(function(){
            let name = $(this).attr('name');
            if(attributes[name]){
                if($(this).is('select')){
                    $(this).val(attributes[name]).trigger('change');
                }else{
                    $(this).val(attributes[name]);
                }
            }
        });
        $('#widgetForm').find('input[name=shortkey]').val(response.data.shortkey);
        $('#shortcodeModal').modal('show');
        filemanagerImagepreview();
    }else{
        imgload.hide();
        showToast('Internal Server Error', 'Error', 'error');
    }
}
});

async function generateFormFields(widget_type,fields) {
    let html = '';
    let menuInputs = [];
    $.each(fields, function(key, value) {
        if (value.field_type == 'image' && value.field_options !== null && value.field_options !== "") {
            let image = JSON.parse(value.field_options);
            height = image.height === null ? 0 : image.height;
            width = image.width === null ? 0 : image.width;
            label = `<label for="${value.field_id}" class="form-label">${value.field_name} ${(height > 0 && width > 0) ? height +'x'+ width : ''} ${value.is_required === 1 ? '*' : ''}</label>`;
        }else{
            label = `<label for="${value.field_id}" class="form-label">${value.field_name} ${value.is_required === 1 ? '*' : ''}</label>`;
        }
        html += `<form action="" method="post" onsubmit="onSubmitWidgetForm(event)" id="widgetForm"><div class="col-12 mb-3">`;       
        html += `<input type="hidden" name="default_data">`;
        html += `<input type="hidden" name="shortkey">`;
        html += label;
        switch (value.field_type) {
            case 'text':
                html += `<input type="text" ${value.is_required === 1 ? 'required' : ''} name="${value.field_id}" class="form-control" id="${value.field_id}">`;
                break;
            case 'module':
                html += `<input type="text" ${value.is_required === 1 ? 'required' : ''} name="${value.field_id}" value="${value.field_id}" readonly class="form-control" id="${value.field_id}">`;
                break;
            case 'image':
                html += `<div class="mb-6 fv-row col-md-12">`;
                html += `<div class="form-group">`;
                html += `<div class="input-group custome-filemanager" onclick="customFilemanager(this)" data-type="image">`;
                html += `<div class="input-group-prepend">`;
                html += `<div class="input-group-text bg-soft-secondary font-weight-medium"> Browse </div>`;
                html += `</div>`;
                html += `<div class="form-control file-amount">Choose File</div>`;
                html += `<input type="hidden" name="${value.field_id}" id="${value.field_id}" class="selected-files ${value.is_required === 1 ? 'validate-hidden-required' : ''}">`;
                html += `</div>`;
                html += `<div class="row mx-1 filemanager-image-preview"></div>`;
                html += `</div>`;
                html += `</div>`;
                break;
            case 'video':
                html += `<div class="mb-6 fv-row col-md-4">`;
                html += `<div class="form-group">`;
                html += `<div class="input-group custome-filemanager" onclick="customFilemanager(this)" data-type="video">`;
                html += `<div class="input-group-prepend">`;
                html += `<div class="input-group-text bg-soft-secondary font-weight-medium"> Browse </div>`;
                html += `</div>`;
                html += `<div class="form-control file-amount">Choose File</div>`;
                html += `<input type="hidden"  name="${value.field_id}" id="${value.field_id}" class="selected-files ${value.is_required === 1 ? 'validate-hidden-required' : ''}">`;
                html += `</div>`;
                html += `<div class="row mx-1 filemanager-image-preview"></div>`;
                html += `</div>`;
                html += `</div>`;
                break;
            case 'textarea':
                html += `<textarea name="${value.field_id}" ${value.is_required === 1 ? 'required' : ''} class="form-control" id="${value.field_id}"></textarea>`;
                break;
            default:
                console.error('Unknown field type:', value.field_type);
                break;
        }
        if (value.field_type == 'modulemenu' && widget_type == "header") {
            menuInputs.push(value.field_id);
            html += `<div class="col-4">
            <div class="mb-6 fv-row col-md-12">     
                <label class="form-label" for="widget_type">Menu ${value.is_required === 1 ? '*' : ''}</label>
                <select name="${value.field_id}" ${value.is_required === 1 ? 'required' : ''} class="form-select select2" id="">
                    <option value="">Select Menu</option>
        
                </select>
                </div>
            </div>`;
        }
        html += `</div>`;
    });
    // Adding a submit button at the end
    html += `<div class="col-12">`;
    html += `<button type="submit" class="mt-2 btn btn-primary">Submit</button>`;
    html += `</div></form>`;
    
    return {"html": html, "menuInput": menuInputs};
}

function onSubmitWidgetForm(event) {
    event.preventDefault();
    const formData = $("#widgetForm").serializeArray();
    let shortkey = $("#widgetForm").find('input[name="shortkey"]').val();
    let attributes = '';
    const filteredFormData = formData.filter(field => field.name !== 'shortkey' && field.name !== 'default_data');
    filteredFormData.forEach(field => {
        attributes += `${field.name}="${field.value}" `;
    });
    const shortcode = `<shortcode>[${shortkey} ${attributes.trim()}][/${shortkey}]</shortcode>`;
    $("#widgetForm").find('input[name="default_data"]').val(shortcode);
    if (!validateHiddenRequiredFields("#widgetForm")) {
        return; // Stop if validation fails
    }

    let langvalue = $('#widget_language').val();

    $.ajax({
        url: ApiCms + "/theme/widget/default-data/"+shortkey+"?lang="+langvalue,
        type: "POST",
        data: {shortcode: shortcode, shortkey: shortkey},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            xhr.setRequestHeader("theme-id", themeId);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                let title = response.message;
                showToast(title, 'Success', 'success','self');
            }
        },
        error: function (xhr, status, err) {
            imgload.hide();
            if (xhr.status === 422) {
                // Validation error
                let errors = xhr.responseJSON.errors;
                errors = JSON.parse(errors);
                let errorMessages = "";

                // Iterate over all errors and concatenate them
                $.each(errors, function (field, messages) {
                    messages.forEach(function (message) {
                        errorMessages += `<li>${message}</li>`; // Append each error message
                    });
                });
                let htmlError = `<ul>${errorMessages}</ul>`;
                showToast(htmlError, 'Error', 'error');
            } else {
                // Handle other errors
                showToast('Something went wrong!', 'Error', 'error');
            }
        }
    });
    $("#shortcodeAttr").modal('hide');
}


async function menuList(menuInput) {
    return $.ajax({
        url: ApiForm + '/get_othermenu',
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        headers: {"Authorization": "Bearer "+strkey,'menu-uuid':menu_id},
        //menu_id:_menuid,
        
        beforeSend: function (xhr) {
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                var options = '<option value="">Select Menu</option>';
                $.each(response.data, function (key, value) {
                    options += `<option value="${value.uuid}">${value.name}</option>`;
                });
                $('select[name="' + menuInput + '"]').html(options);
            }
        }
    });
}

async function activeLanguages() {
    return $.ajax({
        url: ApiForm + "/get_active_languages",
        type: "GET",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgload.show();
        }
    }).done(function (response) {
        imgload.hide();
        if (response.status_code == 200 && response.data) {
            let languageSelect = $('select[name="widget_language"]');
            languageSelect.find('option:not(:first)').remove();
            const defaultLang = response.data.find(lang => lang.is_default == 1);
            response.data.forEach(lang => {
                const selected = defaultLang && lang.app_language_code === defaultLang.app_language_code ? 'selected' : '';
                languageSelect.append(`<option value="${lang.app_language_code}" ${selected}>${lang.name}</option>`);
            });
        } else {
            showToast('Failed to load languages', 'Error', 'error');
        }
    }).fail(function () {
        imgload.hide();
        showToast('Error fetching languages', 'Error', 'error');
    });
}

// Function to extract attributes from the shortcode
function getAttributes(shortcode) {
    var attributes = {};
    
    // Regular expression to match attribute name and value
    var regex = /(\w+)=["']([^"']+)["']/g;
    var match;

    // Iterate over matches and add them to attributes object
    while ((match = regex.exec(shortcode)) !== null) {
      attributes[match[1]] = match[2];
    }

    return attributes;
}