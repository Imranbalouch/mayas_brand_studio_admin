document.title="Dashboard | Add Form Builder";
$(document).ready(function() {
  var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');
    themeId = urlParams.get('themeId');
    let formBuilder = $('#fb-editor').formBuilder({
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
    $("#addFormBuilder").on("submit", function (e) {
      e.preventDefault();
      let savedFormData = formBuilder.actions.getData('json');
      $('.fb-render').formRender({
        formData: savedFormData
      });
      $("input[name='details']").val(savedFormData);
      $("input[name='formrender']").val($(".fb-render").html());
      let formData = new FormData(this);
      $.ajax({
        url: ApiCms + "/theme/form/store",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", formbuilderPermission);
            xhr.setRequestHeader("theme-id", themeId);
            imgload.show();
        },
        success: function (response) {
          if (response.status_code == 200) {
            imgload.hide();
            let title = response.message;
            showToast(title, 'Success', 'success','?P=formbuilder&M='+menu_id+'&themeId='+themeId);
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
                showToast(htmlError, 'Success', 'success');
          } else {
              // Handle other errors
              showToast(xhr.responseJSON.message, 'Error', 'error');
          }
      }
      });
    });
  });
