document.title="Dashboard | Add Module";
let themeId =  '';
let defaultLanguage = '';
$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');
    themeId = urlParams.get('themeId');
    $("#moduleList").click(function () {
        let page = 'modules';
        window.location.assign('?P='+page+'&M='+menu_id+'&themeId='+themeId);
    });
});

$("#addModuleForm").on("submit", function (e) {
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
    // return ;
    $.ajax({
        url: ApiCms + "/theme/module/store",
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
            if (response.status_code == 201) {
                let title = response.message;
                showToast(title, 'Success','success','?P=modules&M='+menu_id+'&themeId='+themeId);
            }
        },
        error: function (xhr, status, err) {
            imgload.hide();
            let statusCode = xhr.status;
            if (statusCode === 422) {
                // Validation error
                let errors = xhr.responseJSON.message;
                errors = JSON.parse(errors);
                let errorMessages = "";

                // Iterate over all errors and concatenate them
                $.each(errors, function (field, messages) {
                    messages.forEach(function (message) {
                        errorMessages += `<li>${message}</li>`; // Append each error message
                    });
                });
                let htmlError = `<ul>${errorMessages}</ul>`;
                showToast(htmlError, 'Error','error');
            } else {
                // Handle other errors
                showToast(xhr.responseJSON.message, 'Error','error');
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
