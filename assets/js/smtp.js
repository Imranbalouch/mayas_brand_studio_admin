document.title="Dashboard | SMTP";
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
        url: ApiPlugin+'/plugins/smtp',
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
            $("input[name=smtp_server]").val(data.host);
            $("input[name=smtp_port]").val(data.port);
            $("input[name=smtp_encryption]").val(data.encryption);
            $("input[name=smtp_username]").val(data.username);
            $("input[name=smtp_password]").val(data.password);
            $("input[name=from_email]").val(data.from_address);
            $("input[name=from_name]").val(data.from_name);
        }, 
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('API call failed:', textStatus, errorThrown);
            // handle error response
            imgload.hide();
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
                window.location.assign('?P=smtp&M='+menu_id);
            });
        }
    });
}

$('#smtp-form').submit(function(e){
    e.preventDefault();
    var formData = new FormData(this);
    $.ajax({
        url: ApiPlugin+'/plugins/smtp/store',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function(response) {
            // handle success response
            imgload.hide();
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
                    window.location.assign('?P=smtp&M='+menu_id);
                });
            }
        }, 
        error: function(jqXHR, textStatus, errorThrown) {
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
