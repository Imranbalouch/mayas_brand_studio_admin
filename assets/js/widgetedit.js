document.title = "Dashboard | Edit Widgets";
var urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get('id');
var themeId = urlParams.get('themeId');

$(document).ready(async function () {
    await activeLanguages();
    if (id) {
        editWidget(id);
    }
});

function editWidget(id, lang = '') {
    if (!id) return;
    lang = lang || $('#language').find('option:selected').val();
    $.ajax({
        url: `${ApiCms}/theme/widget/edit/${id}?language=${lang}`,
        type: "GET",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", widgetPermission);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                let data = response.data;
                $("input[name=name]").val(data.name);
                $("input[name=widget_image]").val(data.widget_image);
                filemanagerImagepreview();
                $("textarea[name=html_code]").val(data.html_code);
                if (data.widget_type != null) {
                    $("select[name=widget_type]").val(data.widget_type);
                    updateInputValues(data.widget_type);
                }
                if (data.widget_fields != []) {
                    let widgetFields = data.widget_fields;
                    if (Array.isArray(widgetFields) && widgetFields.length > 0) {
                        let $target = $(".addfield_target");
                        let $template = $target.find("#row").first().clone(); // Keep a template row
                        $target.empty(); // Clear old content
                        widgetFields.forEach((widgetField, index) => {
                            let $row = $template.clone(); // Clone new row

                            // Set field name + id
                            $row.find('input[name="field_name[]"]').val(widgetField.field_name);
                            $row.find('input[name="fieldnamelbl[]"]').val(widgetField.field_id);

                            // Handle required checkbox
                            let $required = $row.find('input[name="is_required[]"]');
                            if (widgetField.is_required == 1) {
                                $required.prop('checked', true);
                            } else {
                                $required.prop('checked', false);
                            }

                            // Handle variable values
                            if (widgetField.field_type === 'module' || widgetField.field_type === 'modulemenu') {
                                $row.find('.variable').val(`{!! $${widgetField.field_id} !!}`);
                            } else {
                                $row.find('.variable').val(`{{$${widgetField.field_id}}}`);
                            }

                            // Handle image field extra options
                            if (widgetField.field_type === 'image') {
                                let options = JSON.parse(widgetField.field_options || "{}");
                                $row.append(`
                                    <div class="col-lg-4">
                                        <label class="form-label">Width</label>
                                        <input type="number" name="field_width[${index}]" class="form-control" value="${options.width || 0}">
                                    </div>
                                    <div class="col-lg-4">
                                        <label class="form-label">Height</label>
                                        <input type="number" name="field_height[${index}]" class="form-control" value="${options.height || 0}">
                                    </div>
                                `);
                            }

                            // Set field type dropdown
                            $row.find('select[name="field_type[]"]').val(widgetField.field_type);

                            // Append final row
                            $target.append($row);
                        });
                    }

                }
            }

        },
        error: function (error) {
            imgload.hide();
            error = error.responseJSON;
            if (error.status_code == 404) {
                showToast(error.message, 'Error', 'error', '?P=' + page + '&M=' + menu_id + '&themeId=' + themeId);
            } else {
                showToast(error.message, 'Error', 'error');
            }
        }
    });
}

function updateInputValues(pageType) {
    const classNames = {
        'header': {
            search_list_count: 'insta-search-list-count',
            language_switcher: 'insta-manage-language-switcher',
            search_results: 'insta-manage-ecommerce-search-results',
            search_input: 'searchProducts(this.value)'
        },
    };

    const cartSectionListInputsContainer = $('.cart-section-list-inputs-container');
    cartSectionListInputsContainer.empty();

    if (classNames[pageType]) {
        const cartSectionListInputs = [];
        Object.entries(classNames[pageType]).forEach(([key, value]) => {
            let text = value.replace(/-/g, ' ');
            if (value.includes('()')) {
                text = value.replace('()', ' Onclick');
            } else if (value === 'insta-manage-single-cart') {
                text = text + ' with data-id';
            } else if (value === 'searchProducts(this.value)') {
                text = 'Search Input Oninput';
            }
            cartSectionListInputs.push(
                `<div class="col-lg-6 col-md-12 col-sm-12 mb-4"> 
                    <label class="form-label required" for="product_class"><g-t>${text}</g-t></label>
                    <div class="input-group">
                        <input type="text" class="form-control variable" value="${value}" name="cart_section_list" id="cart_section_list" placeholder="class" readonly>
                        <button class="btn btn-outline-primary waves-effect" type="button" onclick="copyInputText(this)" id="button-addon2">Copy</button>
                    </div>
                </div>`
            );
        });
        cartSectionListInputsContainer.html(cartSectionListInputs.join(''));
    }
}

$("select[name=widget_type]").change(function () {
    var widgetType = $(this).val();
    updateInputValues(widgetType); // Call updateInputValues with widget type
});

$("#editWidgetForm").on("submit", function (e) {
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
        url: ApiCms + "/theme/widget/update/" + id,
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", widgetPermission);
            xhr.setRequestHeader("theme-id", themeId);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                showToast(response.message, 'Success', 'success', '?P=widgets&M=' + menu_id + '&themeId=' + themeId);
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

$("#language").change(function () {
    let selectedLanguage = $(this).find('option:selected').val();
    editWidget(id, selectedLanguage);
});
