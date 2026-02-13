 let PageNo = 1;
let PageSize = 10;
let totalRecord = 0;
let PageLength = 0;
let Search = '';
let keyupTimer;
let menu_id="c3526ef9-55c8-4a5f-8e8a-084702008589";
$(document).ready(function () { 
     activitylog();
    
}); 

function activitylog() {
    $('#activityList').html(''); // Clear the existing list
    imgload.show();

    $.ajax({
        url: ApiForm + '/get_active_activity',
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
        },
        success: function (response) {
            imgload.hide();

            if (response.status_code === 200) {
                if (response["new"] == 1) btnnew.show();

                const data = response.data.data;

                // Sort by created_at descending
                const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                // Get only the last 5 records
                const recentFive = sortedData.slice(0, 3);

                const container = $('#activityList');

                if (recentFive.length === 0) {
                    container.append('<li>No activities found.</li>');
                    return;
                }

                recentFive.forEach(item => {
                    const dateObj = new Date(item.created_at);
                    const formattedDate = dateObj.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });

                    const formattedTime = dateObj.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                    });

                    const listItem = `
                    <li class="timeline-item timeline-item-transparent">
                        <span class="timeline-point timeline-point-success"></span>
                        <div class="timeline-event">
                            <div class="timeline-header mb-3">
                                <h6 class="mb-0">${item.log_name || 'Activity log'}</h6>
                                <small class="text-muted">${formattedDate} - ${formattedTime}</small>
                            </div>
                            <p class="mb-2">${item.event || 'No description available'}</p>
                            <div class="d-flex justify-content-between flex-wrap gap-2">
                                <div class="d-flex flex-wrap align-items-center">
                                    <div class="avatar avatar-sm me-2">
                                        <img src="assets/images/user-input-icon.svg" alt="Avatar" class="rounded-circle" />
                                    </div>
                                    <div>
                                        <p class="mb-0 small fw-medium">${item.causer_name || 'Unknown User'}</p>
                                        <small>${item.description}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>`;
                    container.append(listItem);
                });
            } else {
                Swal.fire({
                    title: response.message,
                    icon: 'warning',
                    showConfirmButton: true,
                    showClass: { popup: 'animated fadeInDown faster' },
                    hideClass: { popup: 'animated fadeOutUp faster' }
                });
            }
        },
        error: function (xhr) {
            imgload.hide();
            const errorMessage = xhr.responseJSON?.message || 'An unknown error occurred';
            showToast(errorMessage, 'Error', 'error');
        }
    });
}

 $(document).ready(function() {
   if (localStorage.getItem('FirstName') != null) { 
        $(".staff_name").html(localStorage.getItem('FirstName') +" "+ localStorage.getItem('LastName')); 
    }
    // var dataTable; 
    // // Initialize the DataTable
    // function initializeDataTable() { 
    //     dataTable = $('.datatable').DataTable({
    //         paginate: false,
    //         searching: false,
    //         ordering: false,
    //         info: false,
    //         responsive: true
    //     });
    // }

    // // Initialize DataTable on document ready
    // initializeDataTable();

    // // Reinitialize DataTable on window resize
    // $(window).on('resize', function() {
    //     // Check if DataTable instance exists before destroying it
    //     if ($.fn.DataTable.isDataTable('.datatable')) {
    //         dataTable.destroy();
    //         // Reinitialize the DataTable with updated configuration
    //         initializeDataTable();
    //     }
    // });
 // Chart configuration Start
//  const dataDongut = {
//     labels: ['Label 1', 'Label 2', 'Label 3'],
//     datasets: [{
//         data: [22, 31, 26],
//         backgroundColor: ['#00D770', '#FF9D0B', '#FCE40E'],
//         cutout: 60,
//     }],
// };
// const configDongut = {
//     type: 'doughnut',
//     data: dataDongut,
// };


// const myChart = new Chart(document.getElementById('myDoughnutChart'), configDongut);
// const dataDongut1 = {
//     labels: ['Label 1', 'Label 2', 'Label 3'],
//     datasets: [{
//         data: [22, 31, 26],
//         backgroundColor: ['#00D770', '#FF9D0B', '#FCE40E'],
//         cutout: 60,
//     }],

// };
// const configDongut1 = {
//     type: 'doughnut',
//     data: dataDongut1,
// };
// const myChart1 = new Chart(document.getElementById('myDoughnutChart1'), configDongut1);
// const dataBarChart = {
//     labels: ['January', 'February', 'March', 'April', 'May'],
//     datasets: [{
//         label: 'Monthly Sales',
//         data: [1200, 1500, 1800, 1400, 1600], // Example sales data
//         backgroundColor: '#1F71ED', // Bar color
//         borderWidth: 1, // Border width
//     }]
// };
// const configBarChart = {
//     type: 'bar', // Specify the chart type
//     data: dataBarChart, // Use the dataset we created
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true, // Start the y-axis from zero
//             }
//         }
//     }
// };
// const myChartBarChart = new Chart('myChartBarChart', configBarChart);
// const dataBarChart1 = {
//     labels: ['January', 'February', 'March', 'April', 'May'],
//     datasets: [{
//         label: 'Monthly Sales',
//         data: [1200, 1500, 1800, 1400, 1600], // Example sales data
//         backgroundColor: '#FD6CB0', // Bar color
//         borderWidth: 1, // Border width
//     }]
// };
// const configBarChart1 = {
//     type: 'bar', // Specify the chart type
//     data: dataBarChart1, // Use the dataset we created
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true, // Start the y-axis from zero
//             }
//         }
//     }
// };
// const myChartBarChar2 = new Chart('myChartBarChart2', configBarChart1);
// // Chart configuration End


   }); 