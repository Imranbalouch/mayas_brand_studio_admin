document.title = "Dashboard | Edit Module";
var urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get('id');
var themeId = urlParams.get('themeId');
let page = 'modules';
let defaultLanguage = '';
$(document).ready(async function () {
    await activeLanguages();
    if (id) {
        editmodule(id);
    }
});

function editmodule(id, lang = '') {
    if (!id) return;

    lang = lang || $('#language').find('option:selected').val();
    
    $.ajax({
        url: `${ApiCms}/theme/module/edit/${id}?language=${lang}`,
        type: "GET",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", modulesPermission);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();

            if (response.status_code !== 200) return;

            let data = response.data;
            console.log("data", data);

            // Fill basic fields
            $("input[name=name]").val(data.name);
            if ($("input[name=moduleclass]").val() === '') {
                makeSlug($("input[name=name]"), 'moduleclass');
            } else {
                $("input[name=moduleclass]").val(data.moduleclass);
            }
            $("textarea[name=html_code]").val(data.html_code);

            // Handle module type
            $('select[name="moduletype"]').val(data.moduletype ?? 'general').trigger('change');
            if (data.moduletype === 'api') {
                $('input[name="api_link"]').val(data.api_url.replace(BaseApi, ''));
                $('input[name="api_url"]').val(data.api_url);
                $(".cus-btn").click();
                return;
            }

            // Handle fields
            let modulesFields = data.module_fields || [];
            if (modulesFields.length === 0) return;

            let moduleFieldTemplate = $(".addfield_target").html();
            $(".addfield_target").empty(); // Clear before rendering

            modulesFields.forEach((field, index) => {
                $(".addfield_target").append(moduleFieldTemplate);

                let $lastRow = $(".addfield_target .row:last");

                // Set field values
                $lastRow.find('input[name="field_name[]"]').val(field.field_name || '');
                $lastRow.find('input[name="fieldnamelbl[]"]').val(field.field_id || '');
                $lastRow.find('.variable').val(field.field_id ? '{{$' + field.field_id+'}}' : '');

                // Required toggle
                if (field.is_required == 1) {
                    $lastRow.find('input:hidden[name="is_required[]"]').remove();
                    $lastRow.find('input[name="is_required[]"]').prop('checked', true);
                }

                // Field type
                let $select = $lastRow.find('select[name="field_type[]"]');
                $select.val(field.field_type);

                // Handle image fields
                if (field.field_type === 'image' && field.field_options) {
                    let opts = JSON.parse(field.field_options);
                    $lastRow.append(`
                        <div class="col-4">
                            <div class="mb-6 fv-row col-md-12">     
                                <label class="form-label required" for="field_width[]"><g-t>Width</g-t></label>
                                <input type="number" name="field_width[${index}]" class="form-control mb-2 required" placeholder="100" required value="${opts.width || ''}">
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="mb-6 fv-row col-md-12">
                                <label class="form-label required" for="field_height[]"><g-t>Height</g-t></label>
                                <input type="number" name="field_height[${index}]" class="form-control mb-2 required" placeholder="100" required value="${opts.height || ''}">
                            </div>
                        </div>
                    `);
                }
            });
        },
        error: function (error) {
            imgload.hide();
            error = error.responseJSON;
            if (error.status_code === 404) {
                showToast(error.message, 'Error', 'error', '?P=themes');
            } else {
                showToast(error.message, 'Error', 'error');
            }
        }
    });
}
function editmoduleLang(id, lang = '') {
    if (!id) return;

    lang = lang || $('#language').find('option:selected').val();
    
    $.ajax({
        url: `${ApiCms}/theme/module/edit/${id}?language=${lang}`,
        type: "GET",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", modulesPermission);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();

            if (response.status_code !== 200) return;

            let data = response.data;
            console.log("data", data);

            // Fill basic fields
            $("input[name=name]").val(data.name);
            if ($("input[name=moduleclass]").val() === '') {
                makeSlug($("input[name=name]"), 'moduleclass');
            } else {
                $("input[name=moduleclass]").val(data.moduleclass);
            }
            $("textarea[name=html_code]").val(data.html_code);

            // Handle module type
            $('select[name="moduletype"]').val(data.moduletype ?? 'general').trigger('change');
            if (data.moduletype === 'api') {
                $('input[name="api_link"]').val(data.api_url.replace(BaseApi, ''));
                $('input[name="api_url"]').val(data.api_url);
                $(".cus-btn").click();
                return;
            }            
        },
        error: function (error) {
            imgload.hide();
            error = error.responseJSON;
            if (error.status_code === 404) {
                showToast(error.message, 'Error', 'error', '?P=themes');
            } else {
                showToast(error.message, 'Error', 'error');
            }
        }
    });
}


function activeLanguages() {
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
            let languageSelect = $('select[name="language"]');
            languageSelect.find('option:not(:first)').remove();
            const defaultLang = response.data.find(lang => lang.is_default == 1);
            response.data.forEach(lang => {
                const selected = defaultLang && lang.app_language_code === defaultLang.app_language_code ? 'selected' : '';
                languageSelect.append(`<option value="${lang.app_language_code}" ${selected}>${lang.name}</option>`);
            });
        } else {
            showToast('Failed to load languages', 'Error', 'error');
        }
         if (response.data.length > 1) {
            $("#language_selecter").removeClass("d-none");
        }
    }).fail(function () {
        imgload.hide();
        showToast('Error fetching languages', 'Error', 'error');
    });
}


$("#editModuleForm").on("submit", function (e) {
    e.preventDefault();
    let fieldNames = $(".addfield_target").find('input[name="field_name[]"]');
    let isDuplicate = false;
    let fieldNameValues = [];
    let duplicateFieldName = '';
    let currentElement = '';
    fieldNames.each(function () {
        let value = $(this).val();
        if (fieldNameValues.includes(value)) {
            currentElement = $(this);
            isDuplicate = true;
            duplicateFieldName = value;
            return false; // Exit the loop early if duplicate is found
        }
        fieldNameValues.push(value);
    });
    if (isDuplicate) {
        currentElement.addClass('is-invalid');
        currentElement.focus();
        showToast('Duplicate field name found: ' + duplicateFieldName, 'Error', 'error');
        return;
    }
    let formData = new FormData(this);
    $.ajax({
        url: ApiCms + "/theme/module/update/" + id,
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", modulesPermission);
            xhr.setRequestHeader("theme-id", themeId);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                showToast(response.message, 'Success', 'success', 'self');
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
                showToast(xhr.responseJSON.message, 'Error', 'error');
            }
        }
    });
});

function toggleIsRequired(checkbox) {
    const isChecked = $(checkbox).is(':checked');
    const hiddenField = $(checkbox).closest('div').find('input:hidden[name="is_required[]"]');
    if (isChecked) {
        hiddenField.remove();
    } else {
        $(checkbox).closest('div').append('<input type="hidden" name="is_required[]" value="0" />');
    }
}


$("#language").change(function(){
    let selectedLanguage = $(this).find('option:selected').val();
    editmoduleLang(id, selectedLanguage);
});
