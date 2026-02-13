document.title="Dashboard | Activity Logs";
let PageNo = 1;
let PageSize = 10;
let totalRecord = 0;
let PageLength = 0;
let Search = '';
let keyupTimer;
$(document).ready(function () {
    Onload();
});
function Onload() {
    $('#Table_View').DataTable().clear().destroy();
    $('#buttons').html('');
    $('#Table_View').DataTable({
        processing: false,
        serverSide: true,
        ajax: {
            url: ApiForm + '/get_all_activity',
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                xhr.setRequestHeader("menu-uuid", menu_id);
                imgload.show();
            },
            dataSrc: function(response) {
                imgload.hide();            
                if (response.status_code === 200) {
                    // Show/hide new and update buttons based on permissions
                    if (response["new"] == 1) btnnew.show();
                    let action_button = '';

                    // Action buttons for Edit and Delete
                    if (response["update"] == 1) {
                        action_button += `<a href='javascript:;' class='modify_btn btn-edit' data-toggle='tooltip' title='Edit'>${getTranslation('edit')}</a>|`;
                    }
                    if (Boolean(response["delete"])) {
                        action_button += `<a href='javascript:;' class='modify_btn btn-delete' data-toggle='tooltip' title='Delete'>${getTranslation('delete')}</a>`;
                    }

                    return response.data.data; // Extract data for DataTables
                } else {
                    Swal.fire({
                        title: response.message,
                        icon: 'warning',
                        showConfirmButton: true,
                        showClass: { popup: 'animated fadeInDown faster' },
                        hideClass: { popup: 'animated fadeOutUp faster' }
                    });
                    return [];
                }
            },
            error: function(xhr, status, err) {
                imgload.hide();
                let errorMessage = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'An unknown error occurred';
                showToast(errorMessage, 'Error', 'error');
            }            
        },
        columns: [
            {
                data: null,
                render: function(data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                },
                title: '#'
            },
            {
                data: 'log_name',
                render: function(data) {
                    return data ? data.charAt(0).toUpperCase() + data.slice(1) : '';
                }
            },
            { data: 'event' },
            { data: 'causer_name' },
            {
                data: 'created_at',
                render: function(data) {
                    return new Date(data).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });
                }
            },
            {
                data: 'id',
                render: function(data) {
                    return `<a href='javascript:;' class='modify_btn btn-view' data-id='${data}' data-toggle='tooltip' title='View'><i class="ri-eye-line"></i></a>`;
                }
            }
        ],
        lengthMenu: [10, 25, 50, 100],
        pageLength: 12, // Default page length
        order: [[4, 'desc']], // Default sort by created_at
    });
}

// function Onload() {
//     $('#Table_View').DataTable().clear().destroy();
//     $('#buttons').html('');
//     $.ajax({
//         url: ApiForm + '/get_all_activity',
//         type: "Get",
//         contentType: "application/json",
//         dataType: "json",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//             xhr.setRequestHeader("menu-uuid", menu_id);
//             imgload.show();
//         },
//         success: function (response) {
//             imgload.hide();
//             if (response.status_code == 200) {
//                 let action_button = '';
//                 //New
//                 if (response["new"] == 1) {
//                     btnnew.show();
//                 }

//                 //Update 
//                 if (response["update"] == 1) {
//                     action_button += `<a href='javascript:;' class='modify_btn btn-edit' data-toggle='tooltip' title='Edit'>${getTranslation('edit')}</a>|`;

//                 }

//                 // //Delete
//                 if (Boolean(response["delete"])) {
//                     action_button += `<a href='javascript:;' class='modify_btn btn-delete' data-toggle='tooltip' title='Delete'>${getTranslation('delete')}</a>`;
//                 }
//                 console.log(response["data"]["data"]);
                
//                 if (response["data"]["data"] != null) {
                    
//                      // Ajax Data Settings
//                      const columnsConfig = [
//                         {
//                             data: null, // No data source
//                             render: function(data, type, row, meta) {
//                                 return meta.row + meta.settings._iDisplayStart + 1; // Serial number
//                             },
//                             title: '#', // AUTO Serial number Column
//                         // orderable: false // Disable sorting on this column
//                         },
//                         { data: 'log_name',
//                             render: function (data, type, row) {
//                                 return data.charAt(0).toUpperCase() + data.slice(1);
//                             }
//                         },
//                         { data: 'event' }, 
//                         { data: 'causer_name'},
//                         { data: 'created_at',
//                             render: function (data, type, row) {
//                                 return new Date(data).toLocaleDateString('en-US', {
//                                     year: 'numeric',
//                                     month: 'long',
//                                     day: 'numeric',
//                                 });
//                             }
//                         },
//                         { data: 'id',
//                             render: function (data, type, row) {
//                                 return `<i class="ri-eye-line"></i>`
//                         },
//                         },
//                     ];
//                     tableData= response["data"]["data"];
//                     makeDataTable('#Table_View', tableData, columnsConfig, { 
//                         showButtons: true, 
//                         pdf: true, 
//                         excel: true, 
//                         csv: false, 
//                         print: true, 
//                         copy: false 
//                     });

//                 }
//             } else if (response.statusCode == 404) {
//                 imgload.hide();
//                 $("#Table_View").DataTable({
//                     destroy: true,
//                     retrieve: true,
//                     ordering: false,
//                     dom: "lrt",
//                     bLengthChange: false,
//                     oLanguage: {
//                         sEmptyTable:
//                             `<img class='dataTable-custom-empty-icon' src='/images/no-record-found.svg'><br>${tbNoFound}`,
//                     },
//                 });
//             }
//             else {
//                 imgload.hide();
//                 Swal.fire({
//                     title: response.message,
//                     icon: 'warning',
//                     showConfirmButton: true,

//                     showClass: {
//                         popup: 'animated fadeInDown faster'
//                     },
//                     hideClass: {
//                         popup: 'animated fadeOutUp faster'
//                     }

//                 })
//             }

//         },
//         error: function (xhr, status, err) {
//             imgload.hide();
//             Swal.fire({
//                 title: "Error",
//                 icon: 'error',
//                 showConfirmButton: true,

//                 showClass: {
//                     popup: 'animated fadeInDown faster'
//                 },
//                 hideClass: {
//                     popup: 'animated fadeOutUp faster'
//                 }

//             })
//         }
//     })
//     return true;
// }

// delete
$('table').on('click', '.btn-view', function (e) {
    e.preventDefault();
    let currentRow = $(this).closest("tr");
    let data = $('#Table_View').DataTable().row(currentRow).data();
    console.log("data",data['id']);
    let uuid = data['id'];
    let activityHtml = '';
    let table1 = '';
    $.ajax({
        url: ApiForm + "/activity-show/"+uuid,
        type: "GET",
        dataType: "json",
        data: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (data) {
            imgload.hide();            
            $("#activity-log-modal").modal("show");
            if (data.status_code == 200) {
                let activityData = data.data;
                let created_at = new Date(activityData.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
                console.log(activityData.log_name);
                if (activityData.log_name != 'Login') {
                table1 += `<tr>
                                <td>Type</td>
                                <td><span>${activityData.event}</span></td>
                            </tr>`;
                }
                table1 +=`<tr>
                            <td>Table</td>
                            <td>${activityData.log_name}</td>
                        </tr>`;
                table1 += `<tr>
                                <td>Time</td>
                                <td>${created_at}</td>
                            </tr>
                            <tr>
                                <td>Done by</td>
                                <td>${activityData.causer_name}</td>
                            </tr>`;
                activityHtml += ` <table class="table">
                        <thead class="thead-secondary">
                            <tr>
                                <th colspan="2">Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${table1}
                        </tbody>
                    </table>`;
                let table2 = '';
                if (activityData.log_name == 'Login' && Object.keys(activityData.properties).length > 0) {
                    Object.keys(activityData.properties).forEach(function (field) {
                        let detail = activityData.properties[field];
                        table2 += `<td> 
                                ${field.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                            </td>
                            <td>
                                ${detail}
                            </td>`       
                    });
                }else{
                    if (activityData.event === 'created') {
                        Object.keys(activityData.properties['attributes']).forEach(function (field) {
                            let currentValue = activityData.properties['attributes'][field] ?? null;
                            table2 += `<tr>
                            <td>${field.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}</td>
                            <td>${currentValue}</td>
                            <td>${currentValue}</td>
                            </tr>`
                        });
                    }else{
                        Object.keys(activityData.properties['attributes']).forEach(function (field) {
                            let currentValue = activityData.properties['attributes'][field] ?? null;
                            let previous = activityData.properties['old'][field] ?? null;
                            table2 += `<tr>
                            <td>${field.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}</td>
                            <td>${previous}</td>
                            <td>${currentValue}</td>
                            </tr>`
                        });
                    }
                }

                $("#activity-log-detail").empty();
                $("#activity-log-detail").append(`${activityHtml}
                    <table class="table">
                        <thead class="thead-secondary">
                            <tr>
                                <th>Field</th>
                                ${(activityData.log_name == 'Login') ? '' : '<th>Previous</th>'}
                                <th>Current</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${table2}
                        </tbody>
                    </table>
                `);
            }
        },
        error: function (xhr, status, err) {
            imgload.hide();
            Swal.fire({
                title: "Error",
                icon: 'error',
                showConfirmButton: true,

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }

            })
        }
    });
});

