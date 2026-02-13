document.title="Dashboard | Whatsapp";
let Search = '';
let keyupTimer;
$(document).ready(function () {
    btnnew = $('#plugin');
    btnnew.click(function (e) {
        e.preventDefault();
        let page = 'plugin';
        window.location.assign('?P='+page+'&M='+menu_id);
    });
    Onload();
});

function Onload() {
    $.ajax({
        url: ApiPlugin+'/plugins/whatsapp',
        type: 'GET',
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function(response) {
            // handle success response
            imgload.hide();
            let data = response.data;
            $('input[name=phone_number]').val(data.number);
            $('input[name=whatsapp_logo]').val(data.whatsapp_logo);
            $('textarea[name=custom_css]').val(data.custom_css);
            $('textarea[name=html_code]').val(data.html_code);
            filemanagerImagepreview();
        }, 
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('API call failed:', textStatus, errorThrown);
            // handle error response
            imgload.hide();
        }
    });
}

$('#whatsapp-form').submit(function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    $.ajax({
        url: ApiPlugin+'/plugins/whatsapp/store',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function(response) {
            console.log('API call successful:', response);
            imgload.hide();
            // handle success response
            if (response.status_code == 200) {
                let title = response.message;
                Swal.fire({ 
                    title: title, 
                    icon: 'success',
                    showConfirmButton: true, 
                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }
                }).then(() => {
                    window.location.assign('?P=whatsapp&M='+menu_id);
                });
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('API call failed:', textStatus, errorThrown);
            // handle error response
            imgload.hide();

            if (jqXHR.status === 422) {
                // Validation error
                let errors = jqXHR.responseJSON.errors;
                errors = JSON.parse(errors);
                let errorMessages = "";

                // Iterate over all errors and concatenate them
                $.each(errors, function (field, messages) {
                    messages.forEach(function (message) {
                        errorMessages += `<li>${message}</li>`; // Append each error message
                    });
                });
                let htmlError = `<ul>${errorMessages}</ul>`;
                Swal.fire({
                    title: "Error",
                    html: htmlError,
                    icon: "warning",
                    showConfirmButton: true,
                    showClass: {
                        popup: "animated fadeInDown faster"
                    },
                    hideClass: {
                        popup: "animated fadeOutUp faster"
                    }
                });
            } else {
                // Handle other errors
                Swal.fire({
                    title: "Error",
                    text: "Something went wrong!",
                    icon: "error",
                    showConfirmButton: true,
                    showClass: {
                        popup: "animated fadeInDown faster"
                    },
                    hideClass: {
                        popup: "animated fadeOutUp faster"
                    }
                });
            }
        }
    });
});
