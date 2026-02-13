document.title="Dashboard | Add Theme";
$("#addThemeForm").on("submit", function (e) {
    e.preventDefault();
    let css_file = $(".cssfile_target").find('input[name="css_file[]"]');
    if (css_file.length > 0) {
        $.each(css_file, (index, file) => {
            if (file.value === "") {
                // Check if the file preview exists
                const previewCards = $(file).parents(".file-preview-box").parent().find(".file-preview-imgs .preview-card");
                if (previewCards.length <= 0) {
                    const errorElement = $(file).parents(".file-preview-box").parent();
                    // Add error class and message
                    errorElement.addClass("error");
                    errorElement.find(".error-txt").html("Please select file");
                    // Optional: Focus or highlight the error element
                    errorElement.focus();
                    return ;
                }
            }
        });
    }
    let js_file = $(".jsfile_target").find('input[name="js_file[]"]');
    if (js_file.length > 0) {
        $.each(js_file, (index, file) => {
            if (file.value === "") {
                // Check if the file preview exists
                const previewCards = $(file).parents(".file-preview-box").parent().find(".file-preview-imgs .preview-card");
                if (previewCards.length <= 0) {
                    const errorElement = $(file).parents(".file-preview-box").parent();
                    // Add error class and message
                    errorElement.addClass("error");
                    errorElement.find(".error-txt").html("Please select file");
                    // Optional: Focus or highlight the error element
                    errorElement.focus();
                    return ;
                }
            }
        });
    }
    let formData = new FormData(this);
    $.ajax({
        url: ApiCms + "/theme/store",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        }, 
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                let title = response.message;
                showToast(title, 'Success', 'success', "?P=themes&M="+menu_id);
            }
        },
        error: function(xhr, status, err) {
            imgload.hide();
            
            if (xhr.status === 422) {
                let errors = xhr.responseJSON.errors;
                errors = JSON.parse(errors);
                let errorMessages = "";
                
                $.each(errors, function (field, messages) {
                    messages.forEach(function(message) {
                        errorMessages += `<li>${message}</li>`;
                    });
                });
                let htmlError = `<ul>${errorMessages}</ul>`;
                showToast(htmlError, 'Error', 'error');
            }else{
                showToast(xhr.responseJSON.message, 'Error', 'error');
            }        
        }
    });
});

$(document).ready(function(){
    $(".ui-sortable-css").sortable({
        update: function(event, ui) {
            updateSorting(this);
        }
    });

    $(".ui-sortable-js").sortable({
        update: function(event, ui) {
            updateSortingJs(this);
        }
    });
});

function updateSorting(e) {
    var sorting = [];
    let fileItem = $(e).find(".preview-card");
    console.log("fileItem",fileItem);
    
    fileItem.each(function(index,value) {
        const dataPreviewImage = $(value).data("previewimage");
        sorting.push(dataPreviewImage); // Push value to sorting array
    });
    const inputElement = $(e).parent(".form-group").find("input[name='css_file']");

    if (inputElement.length > 0) {
        inputElement.val(sorting.join(","));
    }
}

function updateSortingJs(e) {
    var sorting = [];
    let fileItem = $(e).find(".preview-card");

    fileItem.each(function() {
        const dataPreviewImage = $(value).data("previewimage");
        sorting.push(dataPreviewImage); // Push value to sorting array
    });
    const inputElement = $(e).parent(".form-group").find("input[name='js_file']");
    if (inputElement.length > 0) {
        inputElement.val(sorting.join(","));
    }
}