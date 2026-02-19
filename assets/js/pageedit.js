document.title="Dashboard | Edit Page";
var urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get('id');
let pageType = '';


$(document).ready(async function () {
    await activeLanguages();
    if (id) {
        editPage(id);
    }
});

function editPage(id,lang = null) {
    if (!id) return;
    lang = lang || $('#language').find('option:selected').val();
    if (id) {
        $.ajax({
            url: ApiCms + `/page/edit/${id}?language=${lang}`,
            type: "GET",
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                xhr.setRequestHeader("menu-uuid", menu_id);
                imgload.show();
            }, 
            success: function (response) {
                imgload.hide();
                if (response.status_code == 200) {
                    let data = response.data;
                    $("input[name=title]").val(data.title);
                    $("input[name=slug]").val(data.slug);
                    $("input[name=meta_title]").val(data.meta_title);
                    $("textarea[name=meta_description]").val(data.meta_description);
                    $("input[name=og_title]").val(data.og_title);
                    $("textarea[name=og_description]").val(data.og_description);
                    $("input[name=og_image]").val(data.og_image);
                    $("input[name=x_title]").val(data.x_title);
                    $("textarea[name=x_description]").val(data.x_description);
                    $("input[name=x_image]").val(data.x_image);
                    $("#page_type").val(data.page_type);
                    $("textarea[name=custom_js]").val(data.custom_js);
                    pageType = data.page_type;
                    if (data.default_header > 0) {
                        $("input[name=default_header]").prop('checked', true);
                    }
                    if (data.default_footer > 0) {
                        $("input[name=default_footer]").prop('checked', true);
                    }
                    if (data.product_detail > 0) {
                        $("input[name=product_detail]").prop('checked', true);
                    }
                    if (data.description != null && data.description != "") {
                        setEditorValue(data.description);
                        renderAllWidgetsInIframe(data.description);

                    }
                }
            },
            error: function (error) {
                error = error.responseJSON;
                imgload.hide();
                if (error.status_code == 404) {
                    showToast(error.message, 'Error', 'error',"?P=pages&M="+menu_id);
                } else {
                    showToast(error.message, 'Error', 'error',"?P=pages&M="+menu_id);
                }
            }
        });
    }
}

$("#editPageForm").on("submit", function (e) {
    e.preventDefault();
    // Ensure css_file selects the right input elements
    var formData = new FormData(this);
    let editorVal = getEditorValue();
    formData.append('content', editorVal);
    $.ajax({
        url: ApiCms + "/page/update/"+id,
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
                showToast(title, 'Success', 'success');
                editPage(id);
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
    editPage(id, selectedLanguage);
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
            }

            let options = '<option value="">Select Page Type</option>';
            $.each(data, function (key, value) {
                options += `<option value="${value.page_type}">${value.name}</option>`;
            });

            $("#page_type").html(options);
            
            if (pageType != null) {
                $("#page_type").val(pageType);
            }
        }
    },
    error: function (xhr, status, err) {
        showToast(xhr.responseJSON.message, 'Error', 'error');
    }
});