document.title="Dashboard | Add Page";
$("input[name='title']").on('keyup', function () {
    setSlugValue($(this).val(), $("input[name='slug']"));
});

$("#addPageForm").on("submit", function (e) {
    e.preventDefault();
    // Ensure css_file selects the right input elements
    var formData = new FormData(this);
    let editorVal = getEditorValue();
    formData.append('content', editorVal);
    $.ajax({
        url: ApiCms + "/page/store",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            xhr.setRequestHeader("theme-id", theme_id);
            imgload.show();
        }, 
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                let title = response.message;
                showToast(title, 'Success', 'success','?P=pages&M='+menu_id);
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


$.ajax({
    url: ApiCms + "/page-type/get_page_type",
    type: "GET",
    dataType: "json",
    beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + strkey);
        xhr.setRequestHeader("menu-uuid", menu_id);
        xhr.setRequestHeader("theme-id", theme_id);
    },
    success: function (response) {
        if (response.status_code == 200) {
            let data = response.data;

            if(data.length > 0){
                $('.page_type').removeClass('d-none');
            };

            let options = '<option value="">Select Page Type</option>';
            $.each(data, function (key, value) {
                options += `<option value="${value.page_type}">${value.name}</option>`;
            });

            $("#page_type").html(options);
        }
    },
    error: function (xhr, status, err) {
        showToast(xhr.responseJSON.message, 'Error', 'error');
    }
});