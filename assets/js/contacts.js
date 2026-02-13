document.title = "Dashboard | Contact List";
let PageNo = 1;
let PageSize = 10;
let totalRecord = 0;
let PageLength = 0;
let Search = '';
let keyupTimer;
$(document).ready(function () {
    loadFormList();
});

function Onload(formId) {
    $('#Table_View').DataTable().clear().destroy();
    $('#buttons').html('');
    $.ajax({
        url: ApiCms + '/contactus',
        type: "Get",
        data: { form_id: formId },
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                let action_button = '';
                //New
                if (response.data.length > 0) {
                    // Step 1: Extract column names safely
                    let columnNames = Object.values(response.columnName || {});
                    let columns = columnNames.map(key => ({
                        data: key,
                        title: key
                    }));

                    // Step 2: Normalize the data rows
                    let tableData = (response.data || []).map(row => {
                        let cleanRow = {};
                        columnNames.forEach(col => {
                            cleanRow[col] = row[col] !== undefined ? row[col] : ""; // fallback if missing
                        });
                        return cleanRow;
                    });

                    // Step 3: Build the header
                    $("#table_header").html(`<th width="5%"></th>${columns.map(column => `<th>${column.title}</th>`).join('')}`);

                    // Step 4: Add serial number column config
                    const columnsConfig = [
                        {
                            data: null,
                            render: function (data, type, row, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1;
                            },
                            title: '#'
                        },
                        ...columns
                    ];

                    // Step 5: Initialize DataTable
                    makeDataTable('#Table_View', tableData, columnsConfig, {
                        showButtons: true,
                        pdf: true,
                        excel: true,
                        csv: false,
                        print: true,
                        copy: false
                    });

                } else {
                    $("#Table_View").DataTable({
                        destroy: true,
                        retrieve: true,
                        ordering: false,
                        dom: "lrt",
                        bLengthChange: false,
                        oLanguage: {
                            sEmptyTable:
                                `Record Not found`,
                        },
                    });

                }
            } else if (response.statusCode == 404) {
                imgload.hide();
                $("#Table_View").DataTable({
                    destroy: true,
                    retrieve: true,
                    ordering: false,
                    dom: "lrt",
                    bLengthChange: false,
                    oLanguage: {
                        sEmptyTable:
                            `<img class='dataTable-custom-empty-icon' src='/images/no-record-found.svg'><br>${tbNoFound}`,
                    },
                });
            }
            else {
                imgload.hide();
                showToast(response.message, 'Warning', 'warning');
            }

        },
        error: function (xhr, status, err) {
            imgload.hide();
            showToast(xhr.responseJSON.message, 'Error', 'error');
        }
    })
    return true;
}

// New
function loadFormList() {
    $.ajax({
        url: ApiCms + '/forms',
        type: "GET",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code === 200 && response.data) {
                if (response.data.length > 0) {
                    const formList = $('#form_list');
                    formList.empty(); // Clear existing options
                    formList.selectpicker("destroy");
                    response.data.forEach(form => {
                        formList.append(
                            `<option value="${form.uuid}">${form.form_name}</option>`
                        );
                    });
                    formList.selectpicker();
                    // formList.val(response.data[0].uuid).trigger('change');
                    Onload(response.data[0].uuid);
                }
            }
        },
        error: function (xhr, status, err) {
            imgload.hide();
            console.log('Error loading forms: ', err);
            showToast('Error loading forms', 'Error', 'error');
        }
    });
}

$('#form_list').on('change', function () {
    let selectedFormId = $(this).val();
    Onload(selectedFormId);
    //console.log('Selected Form ID:', selectedFormId);
});


// delete
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    let currentRow = $(this).closest("tr");
    let data = $('#Table_View').DataTable().row(currentRow).data();
    let uuid = data['uuid'];
    Swal.fire({
        title: getTranslation('deleteConfirmMsg'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: getTranslation('cancel'),
        confirmButtonColor: '#15508A',
        cancelButtonColor: '#15508A',
        confirmButtonText: getTranslation('delete'),
        reverseButtons: true,
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ApiCms + "/page/delete/" + uuid,
                type: "delete",
                data: {},
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    xhr.setRequestHeader("menu-uuid", menu_id);
                    imgload.show();
                },
                success: function (data) {
                    imgload.hide();
                    if (data.status_code == 200) {
                        showToast(data.message, 'Success', 'success', 'self');
                    }
                },
                error: function (xhr, status, err) {
                    imgload.hide();
                    showToast('Error', 'Error', 'error');
                }
            });
        }
    });
});

//edit page
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    $("#popup_title").html(getTranslation("modify_menu"));
    let currentRow = $(this).closest("tr");
    let data = $('#Table_View').DataTable().row(currentRow).data();
    let uuid = data['uuid'];
    let page = 'pageedit';
    window.location.assign('?P=' + page + '&M=' + menu_id + '&id=' + uuid);
});



function changestatus(el) {
    if (el.checked) {
        var status = 1;
    }
    else {
        var status = 0;
    }
    $.ajax({
        url: ApiCms + "/page/status/" + $(el).val(),
        type: "POST",
        data: { status: status },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (data) {
            imgload.hide();
            showToast(data.message, 'success', 'success');
            Onload();
        },
        error: function (xhr, status, err) {
            imgload.hide();
            showToast("Error", '', 'error', 'self');
        }
    })
}


function changedefault(el) {
    if (el.checked) {
        var status = 1;
    }
    else {
        var status = 0;
    }
    $.ajax({
        url: ApiCms + "/page/default/" + $(el).val(),
        type: "POST",
        data: { default: status },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (data) {
            imgload.hide();
            showToast(data.message, 'success', 'success');
            Onload();
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
                showToast(htmlError, 'Warning', 'warning');
            } else {
                // Handle other errors
                showToast(xhr.responseJSON.message, 'Error', 'error');
            }
        }
    })
}
