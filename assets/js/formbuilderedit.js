document.title="Dashboard | Edit Form Builder";
var urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get('id');
var themeId = urlParams.get('themeId');
let formBuilder = '';
$(document).ready(function() {
    // formBuilder = $('#fb-editor').formBuilder({showActionButtons:false});
    formBuilder = $('#fb-editor').formBuilder({
        fieldEditContainer:null,
        disableHTMLLabels:false,
        scrollToFieldOnAdd:true,
        controlOrder: [
            'text',
            'textarea'
        ],
        disabledActionButtons: ['data','save'],
        editOnAdd: true,
    });
});

function getFieldNames() {
    const formData = formBuilder.actions.getData(); // Get form data in JSON format
    const fieldNames = formData.map(field => field.name).filter(Boolean); // Extract and filter out any undefined names
    const fieldTypes = formData.map(field => field.type).filter(Boolean); // Extract and filter out any undefined names
    return {"fieldNames":fieldNames,"fieldTypes":fieldTypes};
}

$('#nnav-file-email-tab').click(function() {
    let Fields = getFieldNames();
    let emailFields=  '';
    $("#email-template-client-opts-box").html('');
    if (Fields.fieldNames.length > 0) {
        Fields.fieldNames.forEach((field,key) => {
            console.log(Fields.fieldTypes,key);
            emailFields += `
                <div class="d-flex flex-wrap justify-content-between my-1">
                    <span>${field}</span>
                    <a class="our-clickable-appender ms-auto" onclick="appendTextToEditor('{${field}}')">{${field}}</a>
                </div>
            `
        });
        $("#email-template-client-opts-box").append(emailFields);      
    }
})

if (id) {
    $.ajax({
        url: ApiCms + "/theme/form/edit/" + id,
        type: "GET",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", formbuilderPermission);
            imgload.show();
        },
        success: function (response) {
            if (response.status_code == 200) {
                let data = response.data;
                $("input[name=form_name]").val(data.form_name);
                formBuilder.actions.setData(data.details);
                $("input[name='details']").val(data.details);
                $("input[name='is_recaptcha'][value='" + data.is_recaptcha + "']").prop("checked", true);
                let toEmails = data.to_email ? JSON.parse(data.to_email) : [];
                if (toEmails.length > 0) {
                    let widgetFieldHtml = $(".addfield_target").html();
                    $(".addfield_target").html('');
                    toEmails.forEach(toEmail => {
                        if (toEmail) {
                            $(".addfield_target").append(widgetFieldHtml);
                            $(".addfield_target").find('input[name="to_email[]"]:last').val(toEmail);
                        }
                    });
                }
                imgload.hide();
            }
        },
        error: function (error) {
            imgload.hide();
            error = error.responseJSON;
            if (error.status_code == 404) {
                showToast(error.message, 'Error', 'error', '?P='+page+'&M='+menu_id+'&themeId='+themeId);
            } else {
                showToast(error.message, 'Error', 'error');
            }
        }
    });
}

$("#editFormBuilder").on("submit", function (e) {
    e.preventDefault();
    let savedFormData = formBuilder.actions.getData('json');
    $('.fb-render').formRender({
      formData: savedFormData
    });
    $("input[name='details']").val(savedFormData);
    $("input[name='formrender']").val($(".fb-render").html());
    let formData = new FormData(this);
    $.ajax({
      url: ApiCms + "/theme/form/update",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + strkey);
          xhr.setRequestHeader("menu-uuid", formbuilderPermission);
          xhr.setRequestHeader("uuid", id);
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
            showToast(htmlError, 'Error', 'warning');
        } else {
            // Handle other errors
            showToast(xhr.responseJSON.message, 'Error', 'error');
        }
    }
    });
});

