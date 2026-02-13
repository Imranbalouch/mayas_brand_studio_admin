document.title = "Dashboard | Details Module";
let PageNo = 1;
let PageSize = 10;
let totalRecord = 0;
let PageLength = 0;
let Search = '';
let keyupTimer;
var btnupd = $('#btn_upd');
var btnsav = $('#btn_sav');
let defaultLanguage = '';
let moduleId = '';
let isInitialLoad = true; // global or scoped
$(document).ready(function () {
    if (page_params.has('themeId')) {
        themeId = page_params.get('themeId');
    }
    if (page_params.has('id')) {
        Id = page_params.get('id');
        moduleId = Id;
    }
    
    btnnew = $('#btn_new');
    Onload();
    activeGlobalLanguages();  
});
function Onload(selectedLang) {
    $('#Table_View').DataTable().clear().destroy();
    $('#buttons').html('');
    $.ajax({
        url: ApiCms + '/theme/module/details/view/' + Id + '?language=' + selectedLang,
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            xhr.setRequestHeader("theme_id", themeId);
            xhr.setRequestHeader("module-uuid", Id);
            imgload.show();
        },
        success: function (response) {

            if (response.status_code == 200) {
                imgload.hide();
                let action_button = '';
                //New
                response = response.data;
                
                if (response["new"] == 1) {
                    btnnew.show();
                }

                //Update 
                if (response["update"] == 1) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-edit' data-toggle='tooltip' title='Edit'>${getTranslation('edit')}</a>|`;

                }

                // //Delete
                if (Boolean(response["delete"])) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-delete' data-toggle='tooltip' title='Delete'>${getTranslation('delete')}</a>`;
                }
                var titles = [];
                if (response.modules != null) {
                    $("#model_view").val(response["module_html"]);
                    $("#module_name").html(getTranslation('modules') + " / " + response["module_name"]);

                    // Helper function to check if file is a video
                    function isVideoFile(filename) {
                        const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
                        return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
                    }

                    // Helper function to check if file is an image
                    function isImageFile(filename) {
                        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'];
                        console.log(imageExtensions.some(ext => filename.toLowerCase().endsWith(ext)));
                        
                        return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
                    }

                    // Ajax Data Settings
                    let data = response.modules;
                    // Extract column names including from the nested 'details'
                    if (data.length > 0) {
                        let columnNames = Object.keys(JSON.parse(data[0]['details']));

                        let tableData = (data || []).map(row => {
                            
                            let cleanRow = {
                                uuid: row.uuid,
                                moduleid: row.module_id
                            };

                            try {
                                let details = typeof row.details === "string" ? JSON.parse(row.details) : row.details;
                                for (let key in details) {                                    
                                    if (key.startsWith('input_')) {
                                        const filename = details[key] !== "" ? details[key] : "";
                                        cleanRow[key] = filename;                                        
                                        if (filename && isVideoFile(filename)) {
                                            cleanRow[key] = `<a href="${AssetsCMSPath}/${filename}" target="_blank">View</a>`;
                                        } else if (filename && isImageFile(filename)) {
                                            cleanRow[key] = `<a href="${AssetsCMSPath}/${filename}" target="_blank"><img src="${AssetsCMSPath}/${filename}" alt="${key}" width="100" height="100"/></a>`;
                                        }
                                    } else {
                                        cleanRow[key] = details[key] !== "" ? details[key] : "";
                                    }
                                }
                            } catch (e) {
                                console.warn("Invalid JSON in details field", row.details);
                            }
                            return cleanRow;
                        });

                        // Generate columns
                        let columns = columnNames.map(key => ({
                            data: key,
                            title: key.replace(/input_/g, '').replace(/_/g, " ").toUpperCase() // optional: prettify headers
                        }));
                        columns.push({
                            data: null,
                            title: 'Action',
                            render: function (data, type, row, meta) {
                                return action_button;
                            }
                        });

                        // Build the header
                        $("#table_header").html(`<th width="5%"></th>${columns.map(column => `<th>${column.title}</th>`).join('')}`);

                        // Serial number + data columns
                        const columnsConfig = [
                            {
                                data: null,
                                render: function (data, type, row, meta) {
                                    return meta.row + meta.settings._iDisplayStart + 1;
                                },
                                title: '#'
                            },
                            ...columns
                        ];

                        // Initialize DataTable
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
        error: function (xhr, status, err) {
            showToast(xhr.responseJSON.message, 'Error', 'error');
        }
    })
    return true;
}

$('table').on('click', '.btn-edit', async function (e) {
    e.preventDefault();
    $("#popup_title").html(getTranslation("modify_module"));

    let currentRow = $(this).closest("tr");
    let data = $('#Table_View').DataTable().row(currentRow).data();
    let uuid = data['uuid'];
    let moduleid = data['moduleid'];

    let attr = await showmodules(moduleid);
    let html = generateFormFields(attr.data.module_fields);

    $("#shortcodeAttr").modal('show');
    $(".shortcodeAttr-item").html(html);

    await activeLanguages();

    let language = $('select[name="language"] option:selected').val();
    isInitialLoad = true; // reset before first call
    populateDetail(uuid, moduleid, language,true);
    languageChange(moduleid);
    isInitialLoad = false; // turn off after initial call
});

async function populateDetail(uuid, moduleid,language,setLang = true){
    if (!language) {
        language = $('#global_language').val() || defaultLanguage;
    }
    let detail_values = await showmoduledetails(uuid, moduleid, language);
    let details = JSON.parse(detail_values.data.details || '{}');
    let lang = detail_values.data.lang;
    let view = detail_values.data.module_html;
    console.log("module_html",view);
    
    // Fill inputs
    $.each(details, function (key, valueObj) {
        $("#" + key).val(valueObj);
    });

    // Hidden inputs
    
    if ($("#txt_id").length) {
        $("#txt_id").remove();
    }
    if ($("#txt_view").length) {
        $("#txt_view").remove();
    }
    $(".shortcodeAttr-item").append(
        $('<input>', { type: 'hidden', id: 'txt_id', name: 'txt_id', value: uuid }),
        $('<input>', { type: 'hidden', id: 'txt_view', name: 'txt_view', value: view })
    );

    // Update button state
    $('button[type="submit"]')
        .html('Update')
        .attr({ id: 'btn_upd', type: 'button', onclick: 'update_record();' });

    // Set language
    if (setLang) {
        // $("#language").val(lang).trigger('change');
         let globalLang = $('#global_language').val() || defaultLanguage;
        $("#language").val(globalLang);
    }
    filemanagerImagepreview();
}

//UPDATE RECORD START
function update_record() {
    var ck = ckvalidationEdit();
    if (ck == false) { return; }
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
                url: ApiCms + '/theme/module/details/update',
                type: "Post",
                processData: false,
                contentType: false,
                data: cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("menu-uuid", menu_id);
                    xhr.setRequestHeader("uuid", uuid);
                    xhr.setRequestHeader("module-uuid", Id);
                    imgload.show();
                    btnupd.hide();
                },
                success: function (response) {
                    if (response.status_code == 200) {
                        imgload.hide();
                        discon();
                        btnupd.show();
                        $('#shortcodeAttr').modal('hide');
                        showToast(response.message, 'Success', 'success');
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

function showmodules(id) {
    return new Promise((resolve, reject) => {
        // id="slider";
        $.ajax({
            type: "GET",
            url: ApiCms + "/page/module-show/" + id,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                xhr.setRequestHeader("menu-uuid", menu_id);
                imgload.show();
            },
            success: function (data) {
                imgload.hide();
                return resolve(data);
            },
            error: function (error) {
                imgload.hide();
                reject(error);
            }
        });
    });
}


function showmoduledetails(id, moduleid,language = null) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: ApiCms + "/theme/module/details/edit/" + id + '?language=' + language,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                xhr.setRequestHeader("menu-uuid", menu_id);
                xhr.setRequestHeader("module-uuid", moduleid);
                imgload.show();
            },
            success: function (data) {
                imgload.hide();
                return resolve(data);
            },
            error: function (error) {
                imgload.hide();
                reject(error);
            }
        });
    });
}

$("#btn_new").click(async function () {
    let module_id = Id;
    try {
        $(".shortcodeAttr-item").html('');
        // let attr = await showmodules(module_id);
        $.ajax({
            type: "GET",
            url: ApiCms + "/page/module-show/" + module_id,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                xhr.setRequestHeader("menu-uuid", menu_id);
                imgload.show();
            },
            success: function (data) {
                imgload.hide();
                let html = generateFormFields(data.data.module_fields);
                activeLanguages();
                $("#shortcodeAttr").modal('show');
                $('.shortcodeAttr-item').append(html);
            },
            error: function (error) {
                imgload.hide();
            }
        });

    } catch (error) {
        showToast(error, 'Error fetching widget:', 'error');
    }

    discon();
    var view = $("#model_view").val();
    var module_view = $('<input>', {
        type: 'hidden',
        id: 'txt_view',
        name: 'txt_view',
        value: `${view}`
    });
    $('.shortcodeAttr-item').append(module_view);
    $('button[type="submit"]').html('Add New').attr('type', 'button').attr('onclick', 'save_record();');
});

/// SAVE NEW RECORD START 
function save_record(e) {
    e.preventDefault();
    var ck = ckvalidation();
    if (ck == false) { return; }
    var cre = ck.creteriaAdd;
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
                url: ApiCms + '/theme/module/details/add',
                type: "Post",
                processData: false,
                contentType: false,
                data: cre,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("menu-uuid", menu_id);
                    xhr.setRequestHeader("module-uuid", Id);
                    imgload.show();
                    btnsav.hide();
                },
                success: function (response) {
                    if (response.status_code == 200) {
                        imgload.hide();
                        discon();
                        btnsav.show();
                        $('#shortcodeAttr').modal('hide');
                        showToast(response.message, 'Success', 'success');
                    }
                },
                error: function (xhr, status, err) {
                    imgload.hide();
                    btnsav.show();
                    const data = xhr.responseJSON.errors;
                    var errorResponse = xhr.responseJSON || {};
                    var errorMessages = '';
                    for (var key in errorResponse) {
                        if (errorResponse.hasOwnProperty(key)) {
                            var messages = errorResponse[key];
                            if (Array.isArray(messages)) {
                                messages.forEach(function (message) {
                                    errorMessages += message + '<br>';
                                });
                            } else if (typeof messages === 'string') {
                                errorMessages += messages + '<br>';
                            } else {
                                errorMessages += 'An unexpected error occurred.<br>';
                            }
                        }
                    }
                    showToast(errorMessages, 'Warning', 'warning');
                }
            })

        }
    })
}
/// SAVE NEW RECORD END

function changestatus(el) {
    if (el.checked) {
        var status = 1;
    }
    else {
        var status = 0;
    }
    $.ajax({
        url: ApiCms + "/theme/module/status/" + $(el).val(),
        type: "POST",
        data: { status: status },
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
            showToast(xhr.responseJSON.message, 'Error', 'error');
        }
    })
}

$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    let currentRow = $(this).closest("tr");
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
            let selectedLang = $('#global_language').val() || defaultLanguage;
            $.ajax({
                url: ApiCms + "/theme/module/details/delete/" + uuid + '?language=' + selectedLang,
                type: "delete",
                data: {},
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("menu-uuid", menu_id);
                    xhr.setRequestHeader("module-uuid", Id);
                    imgload.show();
                },
                success: function (data) {
                    imgload.hide();
                    if (data.status_code == 200) {
                        let selectedLang = $('#global_language').val() || defaultLanguage;
                        showToast(data.message, 'Success', 'success');
                        Onload(selectedLang);
                    }
                },
                error: function (xhr, status, err) {
                    imgload.hide();
                    showToast(xhr.responseJSON.message, 'Error', 'error');
                }
            });
        }
    });
});

function ckvalidation() {
    var txtview = $('#model_view').val();
    const form = document.getElementById('shortcodeForm');
    form.reportValidity();
    if (!form.checkValidity()) {
        return false;
    }
    if (!validateHiddenRequiredFields("#shortcodeForm")) {
        return false; // Stop if validation fails
    }
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
        if (key != 'image') {
            formObject[key] = value;
        }
    });
    const json_details = formObject;
    const details = JSON.stringify(formObject);
    let html_with_values = setData_html(txtview, json_details);
    const formData2 = new FormData()
    formData2.append("details", details)
    formData2.append("view", html_with_values)
    formData2.append("status", '1')
    return { creteriaAdd: formData2 };
}

function ckvalidationEdit() {
    var txtid = $('#txt_id').val();
    var txtview = $('#txt_view').val();

    const form = document.getElementById('shortcodeForm');
    form.reportValidity();
    if (!form.checkValidity()) {
        return false;
    }
    if (!validateHiddenRequiredFields("#shortcodeForm")) {
        return false; // Stop if validation fails
    }

    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
        if (key != 'image') {
            formObject[key] = value;
        }
    });
    const json_details = formObject;
    const details = JSON.stringify(formObject);
    let html_with_values = setData_html(txtview, json_details);
    const formData2 = new FormData()
    formData2.append("details", details)
    formData2.append("view", html_with_values)
    formData2.append("status", '1')
    return { uuid: txtid, creteria: formData2 };
}
function discon() {
    document.getElementById('shortcodeForm').reset();
    btnsav.hide();
    btnupd.hide();
    let selectedLang = $('#global_language').val() || defaultLanguage;
    Onload(selectedLang);
    imgload.hide();
    $("#txt_id").val("");
    $("#txt_view").val("");
}
function setData_html(template, data) {
    return template.replace(/\{\{\$(\w+)\}\}/g, (_, key) => {
        if (key.startsWith('input_')) {
            return data[key] !== undefined ? AssetsPath + '/' + data[key] : '';
        } else {
            return data[key] !== undefined ? data[key] : '';
        }
    });
}

function generateFormFields(fields) {
    let html = '';
    html += `<form action="" method="post" onsubmit="save_record(event);" id="shortcodeForm">
            <div id="language_selecter" class="col-lg-6 col-md-12 col-sm-12 d-none">
                <div class="mb-6 fv-row col-md-12">     
                    <label class="form-label" for="language">Language</label>
                    <select name="language" required class="form-select select2" id="language">
                        <option value="" selected disabled>Please select language</option>
                    </select>
                </div>
            </div>`;
    $.each(fields, function (key, value) {
        if (value.field_type == 'image' && value.field_options !== null && value.field_options !== "") {
            let image = JSON.parse(value.field_options);
            height = image.height === null ? 0 : image.height;
            width = image.width === null ? 0 : image.width;
            label = `<label for="${value.field_id}" class="form-label">${value.field_name} ${(height > 0 && width > 0) ? '(' + height + 'x' + (width) + ')' : ''} ${value.is_required === 1 ? '*' : ''}</label>`;
        } else {
            label = `<label for="${value.field_id}" class="form-label">${value.field_name} ${value.is_required === 1 ? '*' : ''}</label>`;
        }
       
        html += '<div class="col-12 mb-3">';
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
                html += `<div class="input-group custome-filemanager" onclick="customFilemanager(this)" data-type="image" data-width="${width}" data-height="${height}">`;
                html += `<div class="input-group-prepend">`;
                html += `<div class="input-group-text bg-soft-secondary font-weight-medium"> Browse </div>`;
                html += `</div>`;
                html += `<div class="form-control file-amount">Choose File</div>`;
                html += `<input type="hidden" name="${value.field_id}" id="${value.field_id}" class="selected-files ${value.is_required === 1 ? 'validate-hidden-required' : ''}">`;
                html += `</div>`;
                html += `<div class="row mx-1  filemanager-image-preview"></div>`;
                html += `</div>`;
                html += `</div>`;
                break;
            case 'video':
                html += `<div class="mb-6 fv-row col-12">`;
                html += `<div class="form-group">`;
                html += `<div class="input-group custome-filemanager" onclick="customFilemanager(this)" data-type="video">`;
                html += `<div class="input-group-prepend">`;
                html += `<div class="input-group-text bg-soft-secondary font-weight-medium"> Browse </div>`;
                html += `</div>`;
                html += `<div class="form-control file-amount">Choose File</div>`;
                html += `<input type="hidden" name="${value.field_id}" id="${value.field_id}" class="selected-files ${value.is_required === 1 ? 'validate-hidden-required' : ''}">`;
                html += `</div>`;
                html += `<div class="row mx-1  filemanager-image-preview"></div>`;
                html += `</div>`;
                html += `</div>`;
                break;
            case 'textarea':
                html += `<textarea ${value.is_required === 1 ? 'required' : ''} name="${value.field_id}" class="form-control" id="${value.field_id}"></textarea>`;
                break;
            default:
                console.error('Unknown field type:', value.field_type);
                break;
        }
        html += `</div>`;
    });

    // Adding a submit button at the end
    html += `<div class="col-12">`;
    html += `<button type="submit" class="mt-2 btn btn-primary">Submit</button>`;
    html += `</div></form>`;

    return html;
}

// language
// function activeLanguages() {
//       $.ajax({
//         url: ApiForm + "/get_active_languages",
//         type: "GET",
//         dataType: "json",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             imgload.show();
//         },
//         success: function (response) {
//             imgload.hide();
//             if (response.status_code == 200 && response.data) {
//                 let languageSelect = $('select[name="language"]');
//                 languageSelect.find('option:not(:first)').remove(); // Keep placeholder
//                 response.data.forEach(function (lang) {
//                     defaultLanguage = lang.is_default == 1 ? lang.app_language_code : defaultLanguage;
//                     const selected = lang.is_default == 1 ? 'selected' : '';
//                     languageSelect.append(`<option value="${lang.app_language_code}" ${selected}>${lang.name}</option>`);
//                 });
//             } else {
//                 showToast('Failed to load languages', 'Error', 'error');
//             }
//         },
//         error: function (xhr) {
//             imgload.hide();
//             showToast('Error fetching languages', 'Error', 'error');
//         }
//     });
// }
function activeLanguages() {
    $.ajax({
        url: ApiForm + "/get_active_languages",
        type: "GET",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200 && response.data) {
                let languageSelect = $('select[name="language"]');
                languageSelect.find('option:not(:first)').remove();
                
                // Get current global language selection
                let globalLang = $('#global_language').val() || defaultLanguage;
                
                response.data.forEach(function (lang) {
                    defaultLanguage = lang.is_default == 1 ? lang.app_language_code : defaultLanguage;
                    const selected = lang.app_language_code === globalLang ? 'selected' : '';
                    languageSelect.append(`<option value="${lang.app_language_code}" ${selected}>${lang.name}</option>`);
                });
                if (response.data.length > 1) {
                    $("#language_selecter").removeClass("d-none");
                }
                // Make the dropdown readonly
                // languageSelect.prop('disabled', true);
                languageSelect.addClass('readonly');
                
            } else {
                showToast('Failed to load languages', 'Error', 'error');
            }
        },
        error: function (xhr) {
            imgload.hide();
            showToast('Error fetching languages', 'Error', 'error');
        }
    });
}

// function languageChange(moduleid = ''){
//     // Remove old handler before binding new one
//     $("#language").off('change').on('change', function () {
//         if (isInitialLoad) return; // skip first setup
//         let selectedLanguage = $(this).val();
//         let moduleDetailId = $('#txt_id').val();
//         populateDetail(moduleDetailId, moduleid, selectedLanguage,false);
//     });
// }

function activeGlobalLanguages() {
    $.ajax({
        url: ApiForm + "/get_active_languages",
        type: "GET",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200 && response.data) {
                let languageSelect = $('#global_language');
                languageSelect.find('option:not(:first)').remove();
                response.data.forEach(function (lang) {
                    defaultLanguage = lang.is_default == 1 ? lang.app_language_code : defaultLanguage;
                    const selected = lang.is_default == 1 ? 'selected' : '';
                    languageSelect.append(`<option value="${lang.app_language_code}" ${selected}>${lang.name}</option>`);
                });

                // Trigger Onload once after languages load
                let selectedLang = languageSelect.val() || defaultLanguage;
                Onload(selectedLang);
            }
        },
        error: function () {
            imgload.hide();
            showToast('Error fetching languages', 'Error', 'error');
        }
    });
}


$(document).on('change', '#global_language', function () {
    let selectedLang = $(this).val();
    Onload(selectedLang);

    
    if ($('#shortcodeAttr').hasClass('show')) {
        $('select[name="language"]').val(selectedLang).trigger('change');
    }
});
