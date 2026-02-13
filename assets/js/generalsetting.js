document.title = "Dashboard | General Setting";
$(document).ready(function () {

    $.ajax({
        url: ApiForm + "/business-settings/get",
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code === 200 && Array.isArray(response.data)) {
                response.data.forEach(function (item) {
                    // Find input field by the `type` column value as its name
                    const inputSelector = `input[name="${item.type}"]`;
                    // Set the value dynamically
                    $(inputSelector).val(item.value);
                });
            }
        },
        error: function (xhr, status, error) {
            imgload.hide();
            showToast(xhr.responseJSON.message, 'Error', 'error');
        }
    });
    

    $("#generalSettingForm").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        imgload.show();
        $.ajax({
            url: ApiForm + "/business-settings/update",
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
                showToast(response.message, 'Success', 'success','self');
            },
            error: function (error) {
                imgload.hide();
                showToast('Error occurred while updating the setting.', 'Error', 'error');
            }
        });
    });
});