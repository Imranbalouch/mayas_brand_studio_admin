document.title="Dashboard | Plugins";
$(document).ready(function () {
    Onload();
});

function timeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (let [unit, seconds] of Object.entries(intervals)) {
        const difference = Math.floor(diffInSeconds / seconds);
        
        if (difference >= 1) {
            return difference === 1 ? `1 ${unit} ago` : `${difference} ${unit}s ago`;
        }
    }
    
    return 'just now';
}

function Onload() {
    $.ajax({
        url: ApiPlugin + "/plugins",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            let data = response.data;
            let html = '';
            $.each(data, function (i, item) {
                let status = item.status == 1 ? 'btn-secondary' : 'btn-primary';
                let btn = item.status == 1 ? 'Deactivate' : 'Activate';
                html += `<div class="col-lg-4 col-sm-6">
                                        <div class="card plugin-card">
                                          <div class="row g-0">
                                              <div class="col-2">
                                                  <img class="card-img card-img-left" src="./assets/images/plugin/${item.slug}.png" alt="${item.name}">
                                              </div>
                                              <div class="col-10">
                                                  <div class="card-body">
                                                      <h5 class="card-title">${item.name}</h5>
                                                      <p class="card-text">${item.description}</p>
                                                        <p class="card-text"><small class="text-muted">Last updated ${timeAgo(item.updated_at)}</small></p>                                                      <div class="d-flex justify-content-between align-items-center">
                                                          <a href="javascript:void(0)" onclick="activatePlugin('${item.uuid}')" class="btn ${status} btn-sm">${btn}</a>
                                                          ${item.status != 1 ? `<a href="javascript:void(0)" onclick="uninstallPlugin('${item.uuid}', '${item.status}')" class="btn btn-sm">Uninstall</a>` : ''}
                                                          ${(item.settings == 1 || item.settings == null) && item.status == 1 ? `<a href="javascript:void(0)" onclick="managePlugin('${item.slug}')">Manage Setting</a>` : ''}
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>`;
            });
            $('#plugin_list').html(html);
        },
        error: function(xhr, status, error) {
            var errorMessage = xhr.responseJSON.message;
            showToast(errorMessage,'Error','error');
        }
    });
}
//update plugin status
function activatePlugin(uuid){
    $.ajax({
        url: ApiPlugin + "/plugins/update-status",
        type: "POST",
        data: {
            uuid: uuid,
            status: 1   
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                let title = response.message;
                showToast(title, 'Success', 'success','self');
            }
        },
        error: function(xhr, status, error) {
            var errorMessage = xhr.responseJSON.message;
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
                showToast(htmlError, 'Warning', 'warning');
            } else {
                // Handle other errors
                showToast('Something went wrong!','Error','error');
            }
        }
    });
}
function uninstallPlugin(uuid, status){
    if(status == 1){
        showToast('Please deactivate plugin first!','Warning','warning');
        return;
    }
    $.ajax({
        url: ApiPlugin + "/plugins/plugin-uninstall",
        type: "POST",
        data: {
            uuid: uuid,
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                let title = response.message;
                showToast(title, 'Success', 'success','self');
            }
        },
        error: function(xhr, status, error) {
            var errorMessage = xhr.responseJSON.message;
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
                showToast(htmlError, 'Warning', 'warning');
            } else {
                let msg = "Something went wrong!";
                if (xhr.responseJSON?.message) msg = xhr.responseJSON.message;
                // Handle other errors
                showToast(msg,'Error','error');
            }
        }
    });
}


function managePlugin(name) {
    let page = name;
    window.location.assign('?P='+page+'&M='+menu_id);
}

document.getElementById("uploadZipForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let formData = new FormData(this);

    $.ajax({
        url: ApiPlugin + "/plugins/plugin-install",
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
                showToast(title, 'Success', 'success', 'self');
            }
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.responseJSON.message;
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
                showToast(htmlError, 'Warning', 'warning');
            } else {
                let msg = "Something went wrong!";
                if (xhr.responseJSON?.message) msg = xhr.responseJSON.message;
                // Handle other errors
                showToast(msg,'Error','error');
            }
        }
    });
});