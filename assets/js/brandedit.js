document.title = "Dashboard | Edit Brand";
var urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get('id');
let selectedLanguage = '';

$(document).ready(async function () {
    await activeLanguages();
    if (id) {
        loadBrandData(selectedLanguage);
    }

    $(document).on('change', 'select[name="language"]', function () {
        selectedLanguage = $(this).val();
        if (id) {
            loadBrandData(selectedLanguage);
        }
    });
});

function loadBrandData(lang) {
    $.ajax({
        url: ApiForm + "/brand/edit_brand/" + id + "?language=" + lang,
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

                // Populate form fields
                $("input[name=brand]").val(data.brand);
                $("input[name=slug]").val(data.slug);
                $("input[name=logo]").val(data.logo);
                $("input[name=order_level]").val(data.order_level);
                $("textarea[name=description]").val(data.description);
                $("input[name=meta_title]").val(data.meta_title);
                $("textarea[name=meta_description]").val(data.meta_description);
                $("input[name=og_title]").val(data.og_title);
                $("textarea[name=og_description]").val(data.og_description);
                $("input[name=og_image]").val(data.og_image);
                $("input[name=x_title]").val(data.x_title);
                $("textarea[name=x_description]").val(data.x_description);
                $("input[name=x_image]").val(data.x_image);

                filemanagerImagepreview();
            }
        },
        error: function (error) {
            imgload.hide();
            error = error.responseJSON;
            if (error.status_code == 404) {
                showToast(error.message, 'Error', 'error', '?P=brand&M=' + menu_id);
            } else {
                showToast('Internal Server Error.', 'Error', 'error', '?P=brand&M=' + menu_id);
            }
        }
    });
}

/// edit form submit
$("#editBrandForm").on("submit", function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    formData.append('language', selectedLanguage);

    imgload.show();
    $.ajax({
        url: ApiForm + "/brand/update_brand",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            xhr.setRequestHeader("uuid", id);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                showToast(response.message, 'Success', 'success');
                loadBrandData(selectedLanguage);
            }
        },
        error: function (xhr, status, err) {
            imgload.hide();
            if (xhr.status === 422) {
                let errors = xhr.responseJSON.errors;
                errors = JSON.parse(errors);
                let errorMessages = "";
                $.each(errors, function (field, messages) {
                    messages.forEach(function (message) {
                        errorMessages += `<li>${message}</li>`;
                    });
                });
                let htmlError = `<ul>${errorMessages}</ul>`;
                showToast(htmlError, 'Error', 'error');
            } else {
                showToast(getTranslation('somthing_went_worng'), 'Error', 'error');
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

            selectedLanguage = languageSelect.val();

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