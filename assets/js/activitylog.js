document.title="Dashboard | Activity Logs";
let PageNo = 1;
let PageSize = 10;
let totalRecord = 0;
let PageLength = 0;
let Search = '';
let keyupTimer;
let currentPage = 1;
let per_page = 10;
let search = '';

$(document).ready(function () {
    Onload(1);
    // $('#custom_search').on('keyup', function () {
    //     clearTimeout(keyupTimer);
    //     keyupTimer = setTimeout(() => {
    //         search = $(this).val();
    //         Onload(1); // Reset to first page on search
    //     }, 500);
    // });
});
// function Onload() {
//     $('#Table_View').DataTable().clear().destroy();
//     $('#buttons').html('');
//     $('#Table_View').DataTable({
//         processing: false,
//         serverSide: true,
//         info: false,
//         ajax: {
//             url: ApiForm + '/get_all_activity',
//             type: "GET",
//             contentType: "application/json",
//             dataType: "json",
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader("Authorization", "Bearer " + strkey);
//                 xhr.setRequestHeader("menu-uuid", menu_id);
//                 imgload.show();
//             },
//             dataSrc: function(response) {
//                 imgload.hide();            
//                 if (response.status_code === 200) {
//                     // Show/hide new and update buttons based on permissions
//                     if (response["new"] == 1) btnnew.show();
//                     let action_button = '';

//                     // Action buttons for Edit and Delete
//                     if (response["update"] == 1) {
//                         action_button += `<a href='javascript:;' class='modify_btn btn-edit' data-toggle='tooltip' title='Edit'>${getTranslation('edit')}</a>|`;
//                     }
//                     if (Boolean(response["delete"])) {
//                         action_button += `<a href='javascript:;' class='modify_btn btn-delete' data-toggle='tooltip' title='Delete'>${getTranslation('delete')}</a>`;
//                     }

//                     return response.data.data; // Extract data for DataTables
//                 } else {
//                     Swal.fire({
//                         title: response.message,
//                         icon: 'warning',
//                         showConfirmButton: true,
//                         showClass: { popup: 'animated fadeInDown faster' },
//                         hideClass: { popup: 'animated fadeOutUp faster' }
//                     });
//                     return [];
//                 }
//             },
//             error: function(xhr, status, err) {
//                 imgload.hide();
//                 let errorMessage = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'An unknown error occurred';
//                 showToast(errorMessage, 'Error', 'error');
//             }            
//         },
//         columns: [
//             {
//                 data: null,
//                 render: function(data, type, row, meta) {
//                     return meta.row + meta.settings._iDisplayStart + 1;
//                 },
//                 title: '#'
//             },
//             {
//                 data: 'log_name',
//                 render: function(data) {
//                     return data ? data.charAt(0).toUpperCase() + data.slice(1) : '';
//                 }
//             },
//             { data: 'event' },
//             { data: 'causer_name' },
//             {
//                 data: 'created_at',
//                 render: function(data) {
//                     return new Date(data).toLocaleDateString('en-US', {
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric',
//                     });
//                 }
//             },
//             {
//                 data: 'id',
//                 render: function(data) {
//                     return `<a href='javascript:;' class='modify_btn btn-view' data-id='${data}' data-toggle='tooltip' title='View'><i class="ri-eye-line"></i></a>`;
//                 }
//             }
//         ],
//         lengthMenu: [10, 25, 50, 100],
//         pageLength: 10, // Default page length
//         order: [[4, 'desc']], // Default sort by created_at
//     });
// }
 $('#custom_search').on('keyup', function (e) {
    e.preventDefault(); // optional: prevents form submission if inside a form
    Onload(1);
});
function Onload(page) {
    currentPage = page || 1;
    search=$('#custom_search').val();
    $('#Table_View').DataTable().clear().destroy();
    $('#buttons').html('');

    $.ajax({
        url: `${ApiForm}/get_all_activity?page=${currentPage}&per_page=${per_page}&search=${search}`,
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey); // Placeholder: strkey must be defined
            xhr.setRequestHeader("menu-uuid", menu_id); // Placeholder: menu_id must be defined
            imgload.show(); // Placeholder: imgload must be defined
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code === 200) {
                // Show/hide new button based on permissions
                if (response["new"] === 1) {
                    btnnew.show(); // Placeholder: btnnew must be defined
                }

                // Action buttons for Edit and Delete
                let action_button = '';
                if (response["update"] === 1) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-edit' data-toggle='tooltip' title='Edit'>${getTranslation('edit')}</a>|`; // Placeholder: getTranslation must be defined
                }
                if (response["delete"]) {
                    action_button += `<a href='javascript:;' class='modify_btn btn-delete' data-toggle='tooltip' title='Delete'>${getTranslation('delete')}</a>`;
                }

                const tableData = response.data.data || [];
                const paginationData = response.data;
                const totalRecords = paginationData.total || 0;
                $('#Table_View').DataTable().clear().destroy();
                // Initialize DataTable
                $('#Table_View').DataTable({
                    data: tableData,
                    columns: [
                        {
                            data: null,
                            render: function (data, type, row, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1;
                            },
                            title: '#'
                        },
                        {
                            data: 'log_name',
                            render: function (data) {
                                return data ? data.charAt(0).toUpperCase() + data.slice(1) : '';
                            }
                        },
                        { data: 'event' },
                        { data: 'causer_name' },
                        {
                            data: 'created_at',
                            render: function (data) {
                                return new Date(data).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });
                            }
                        },
                        {
                            data: 'id',
                            render: function (data) {
                                return `<a href='javascript:;' class='modify_btn btn-view' data-id='${data}' data-toggle='tooltip' title='View'><i class="ri-eye-line"></i></a>`;
                            }
                        }
                    ],
                    pageLength: per_page === 'all' ? tableData.length : parseInt(per_page),
                    order: [[4, 'desc']],
                    info: false,
                    paging: false,
                    searching: false,
                    // infoCallback: function (settings, start, end, max, total, pre) {
                    //     $('#product_count').text(`Showing ${start} to ${end} of ${total} entries`);
                    // }
                });

                // Show/hide pagination
                if (per_page === 'all' || paginationData.last_page <= 1) {
                    $('#Table_View_paginate').hide();
                } else {
                    $('#Table_View_paginate').show();
                    renderPagination(currentPage, paginationData.last_page);
                }
            } else if (response.status_code === 404) {
                imgload.hide();
                $('#Table_View').DataTable({
                    destroy: true,
                    ordering: false,
                    dom: "lrt",
                    language: {
                        emptyTable: `<img class='dataTable-custom-empty-icon' src='/images/no-record-found.svg'><br>${tbNoFound}` // Placeholder: tbNoFound must be defined
                    }
                });
            } else {
                imgload.hide();
                Swal.fire({
                    title: response.message || 'An error occurred',
                    icon: 'warning',
                    showConfirmButton: true
                });
            }
        },
        error: function (xhr) {
            imgload.hide();
            const errorMessage = xhr.responseJSON?.message || 'An unknown error occurred';
            Swal.fire({
                title: errorMessage,
                icon: 'error',
                showConfirmButton: true
            });
        }
    });
}

function renderPagination(currentPage, lastPage) {
  let paginationHTML = '<div class="dataTables_wrapper dt-bootstrap5 no-footer"><div class="col-sm-12 col-md-5"></div><div class="col-sm-12 col-md-7" style="float: right;"><div class="dataTables_paginate paging_simple_numbers" id="Table_View_paginate"><ul class="pagination">';

  const maxVisiblePages = 10;
  let startPage, endPage;

  // Calculate the range of pages to display
  if (lastPage <= maxVisiblePages) {
    // Less than max pages: show all
    startPage = 1;
    endPage = lastPage;
  } else {
    const half = Math.floor(maxVisiblePages / 2);
    if (currentPage <= half) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage + half >= lastPage) {
      startPage = lastPage - maxVisiblePages + 1;
      endPage = lastPage;
    } else {
      startPage = currentPage - half;
      endPage = currentPage + half - 1;
    }
  }

  // Previous button
  if (currentPage > 1) {
    paginationHTML += `<li class="paginate_button page-item previous"><a href="#" class="page-link" onclick="Onload(${currentPage - 1})">Previous</a></li>`;
  }

  // First page shortcut (optional)
  if (startPage > 1) {
    paginationHTML += `<li class="paginate_button page-item"><a href="#" class="page-link" onclick="Onload(1)">1</a></li>`;
    if (startPage > 2) {
      paginationHTML += `<li class="paginate_button page-item disabled"><span class="page-link">...</span></li>`;
    }
  }

  // Numbered page buttons
  for (let i = startPage; i <= endPage; i++) {
    let activeClass = i === currentPage ? 'active' : '';
    paginationHTML += `<li class="paginate_button page-item ${activeClass}"><a href="#" class="page-link ${activeClass}" onclick="Onload(${i})">${i}</a></li>`;
  }

  // Last page shortcut (optional)
  if (endPage < lastPage) {
    if (endPage < lastPage - 1) {
      paginationHTML += `<li class="paginate_button page-item disabled"><span class="page-link">...</span></li>`;
    }
    paginationHTML += `<li class="paginate_button page-item"><a href="#" class="page-link" onclick="Onload(${lastPage})">${lastPage}</a></li>`;
  }

  // Next button
  if (currentPage < lastPage) {
    paginationHTML += `<li class="paginate_button page-item next"><a href="#" class="page-link" onclick="Onload(${currentPage + 1})">Next</a></li>`;
  }

  paginationHTML += `</ul></div></div></div>`;
  $('#pagination').html(paginationHTML);
}


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

