document.title = "Dashboard | Add Staff";
$(document).ready(function () {
    fetchPermissions();
});

function fetchPermissions() {
    $.ajax({
        url: ApiForm + '/permissions_menu',
        type: 'GET',
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
        },
        success: function(response) {
            console.log('Permissions API response:', response); // Debug response
            if (response.status_code === 200) {
                window.rawPermissions = response.data;
                console.log('Raw permissions set:', window.rawPermissions); // Debug data
                // Call loadPermissions with staffData (ensure staffData is available)
                loadPermissions({ specialPermissions: [] }); // Replace with actual staffData
            } else {
                showError('Failed to load permissions data');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching permissions:', xhr.responseText, status, error); // Debug error
            showError('Error fetching permissions: ' + error);
        }
    });
}

function loadPermissions(staffData) {
    const permissionsContainer = $('#permissionsContainer');
    if (!permissionsContainer.length) {
        console.error('permissionsContainer not found in DOM'); // Debug selector issue
        return;
    }
    permissionsContainer.empty();
    console.log('permissionsContainer cleared'); // Debug

    const userPermissions = staffData.specialPermissions || [];
    console.log('User Permissions:', userPermissions); // Debug

    // Check if rawPermissions exists
    if (!window.rawPermissions || !Array.isArray(window.rawPermissions)) {
        console.error('rawPermissions is undefined or not an array:', window.rawPermissions);
        showError('No permissions data available');
        return;
    }

    const menuPermissionsMap = {};
    window.rawPermissions.forEach(perm => {
        if (!menuPermissionsMap[perm.menu_id]) {
            menuPermissionsMap[perm.menu_id] = {
                menu_name: perm.menu_name,
                permissions: []
            };
        }
        if (!menuPermissionsMap[perm.menu_id].permissions.some(p => p.id === perm.permission_id)) {
            menuPermissionsMap[perm.menu_id].permissions.push({
                id: perm.permission_id,
                name: perm.permission_name
            });
        }
    });
    console.log('Menu permissions map:', menuPermissionsMap); // Debug

    // Build UI
    Object.entries(menuPermissionsMap).forEach(([menuId, menuData]) => {
        const menuPermissions = menuData.permissions || [];
        const groupHtml = `
            <div class="collapse-main">
                <div class="checkbox-permission-main">
                    <div class="form-check mb-0">
                        <label class="form-check-label group-checkbox-label" data-group="${menuData.menu_name}">
                            <input class="form-check-input group-checkbox" type="checkbox" 
                                   data-menu-id="${menuId}" id="ck_head_${menuId}">
                            <span>${menuData.menu_name}</span>
                        </label>
                    </div>
                    <a class="collapse-arrow" href="#">
                        <span class="permission-count" id="count_${menuId}">0/${menuPermissions.length}</span>
                        <svg width="16" height="16" fill="#3b4056" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M3.72 6.47a.75.75 0 0 1 1.06 0l3.47 3.47 3.47-3.47a.749.749 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 0-1.06"></path>
                        </svg>
                    </a>
                </div>
                <div class="collapse-body">
                    <div class="bg-transparent collapse-permission-main">
                        ${menuPermissions.map(perm => `
                            <div class="form-check">
                                <label class="form-check-label">
                                    <input class="form-check-input permission-checkbox checkmark_${perm.id}" 
                                           type="checkbox" 
                                           name="permissions[]" 
                                           id="ck_check_${menuId}_${perm.id}"
                                           data-menu-id="${menuId}"
                                           data-permission-id="${perm.id}"
                                           value="${perm.id}">
                                    <span>${perm.name}</span>
                                </label>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        permissionsContainer.append(groupHtml);
        console.log(`Appended permissions for menu ${menuId}`); // Debug
    });

    checkUserPermissions(userPermissions);
    initPermissionCheckboxes();
}
// Function to check permissions based on user data
function checkUserPermissions(userPermissions) {
    if (!userPermissions || userPermissions.length === 0) {
        console.log("No user permissions to check");
        return;
    }
    
    console.log("Checking user permissions:", userPermissions);
    
    // Clear all checkboxes first
    $('.permission-checkbox').prop('checked', false);
    
    // For each user permission, check the corresponding checkbox
    userPermissions.forEach(perm => {
        const menuId = perm.menu_id;
        const permissionId = perm.permission_id;
        const status = perm.status;
        
        console.log(`Checking permission: menu=${menuId}, permission=${permissionId}, status=${status}`);
        
        // Only check if status is 1 (enabled)
        if (status == 1) {
            const checkboxId = `#ck_check_${menuId}_${permissionId}`;
            console.log(`Looking for checkbox: ${checkboxId}`);
            
            const checkbox = $(checkboxId);
            if (checkbox.length) {
                checkbox.prop('checked', true);
                console.log(`Checkbox found and checked: ${checkboxId}`);
            } else {
                console.log(`Checkbox not found: ${checkboxId}`);
            }
        }
    });
    
    // Update group checkboxes and counts
    $('.collapse-main').each(function() {
        updateGroupCheckboxState($(this));
    });
}

function updateGroupCheckboxState(groupContainer) {
    const groupCheckbox = groupContainer.find('.group-checkbox');
    const menuId = groupCheckbox.data('menu-id');
    const permissionCheckboxes = groupContainer.find('.permission-checkbox');
    const totalCheckboxes = permissionCheckboxes.length;
    const checkedCheckboxes = permissionCheckboxes.filter(':checked').length;
    
    // Update count
    groupContainer.find('.permission-count').text(`${checkedCheckboxes}/${totalCheckboxes}`);
    
    // Update group checkbox state
    if (checkedCheckboxes === 0) {
        groupCheckbox.prop('checked', false);
        groupCheckbox.prop('indeterminate', false);
    } else if (checkedCheckboxes === totalCheckboxes) {
        groupCheckbox.prop('checked', true);
        groupCheckbox.prop('indeterminate', false);
    } else {
        groupCheckbox.prop('checked', false);
        groupCheckbox.prop('indeterminate', true);
    }
}

function initPermissionCheckboxes() {
    // Group checkbox behavior - check/uncheck all permissions in the group
    $('.group-checkbox').off('change').on('change', function() {
        const isChecked = $(this).prop('checked');
        const menuId = $(this).data('menu-id');
        
        $(this).closest('.collapse-main').find('.permission-checkbox').each(function() {
            $(this).prop('checked', isChecked);
        });
        
        updateGroupCheckboxState($(this).closest('.collapse-main'));
    });
    
    // Permission checkbox behavior - update group checkbox state
    $('.permission-checkbox').off('change').on('change', function() {
        updateGroupCheckboxState($(this).closest('.collapse-main'));
    });
    
    // Collapse behavior
    $('.collapse-arrow').off('click').on('click', function(e) {
        e.preventDefault();
        $(this).closest('.collapse-main').find('.collapse-body').slideToggle();
    });
    
    // Initially update all group states
    $('.collapse-main').each(function() {
        updateGroupCheckboxState($(this));
    });
}


$("#addStaff").on("submit", function (e) {
    e.preventDefault();

    // Collect form data
    const formData = {
        first_name: $(this).find('input[name="first_name"]').val(),
        last_name: $(this).find('input[name="last_name"]').val(),
        email: $(this).find('input[name="email"]').val(),
        menus: []
    };

    // Build menus array from checked permissions
    $('.collapse-main').each(function() {
        const menuId = $(this).find('.group-checkbox').data('menu-id');
        const permissions = [];

        $(this).find('.permission-checkbox:checked').each(function() {
            permissions.push(parseInt($(this).val()));
        });

        if (permissions.length > 0) {
            formData.menus.push({
                menu_id: parseInt(menuId),
                permissions: permissions
            });
        }
    });

    console.log("Form data being sent:", formData); 

    $.ajax({
        url: ApiForm + "/add_staff",
        type: "POST",
        contentType: "application/json", 
        data: JSON.stringify(formData), 
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                let title = response.message;
                showToast(title, 'Success', 'success', "?P=user-permission&M=" + menu_id);
            }
        },
        error: function (xhr, status, err) {
            imgload.hide();
            if (xhr.status === 422) {
                let errors = xhr.responseJSON.errors;
                let errorMessages = "";

                $.each(errors, function (field, messages) {
                    messages.forEach(function (message) {
                        errorMessages += `<li>${message}</li>`;
                    });
                });
                let htmlError = `<ul>${errorMessages}</ul>`;
                showToast(htmlError, 'Error', 'error');
            } else {
                showToast(xhr.responseJSON.message, 'Error', 'error');
            }
        }
    });
});

$("#UserPermission").on("click", function (e) {
    e.preventDefault();
    let page = 'user-permission';
    window.location.assign('?P=' + page + '&M=' + menu_id);
});

$("#EditTableButton").click(function (e) {
    e.preventDefault();
    $("#EditTable").toggle();
})

document.getElementById("addStaff").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = this.querySelector("[name='email']");
    let status = true; // Use `status` consistently

    if (email.value === "") {
        email.parentElement.classList.add("error");
        email.parentElement.querySelector(".error-txt").innerHTML = "Email can’t be blank";
        status = false; // Fix variable usage
    } else if (!checkEmailField(email.value)) {
        email.parentElement.classList.add("error");
        email.parentElement.querySelector(".error-txt").innerHTML = "Invalid email";
        status = false;
    }
});

function checkEmailField(val) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(val);
}

document.querySelectorAll("#addStaff input").forEach(function (input) {
    input.addEventListener("input", function () {
        input.parentElement.classList.remove("error");
        input.parentElement.querySelector(".error-txt").innerHTML = ""; // Remove redundant query
    });
});

$(document).ready(function () {
    // Initially hide Collapse all
    $("#Collapseall").hide();

    // Hide collapse-body by default
    $(".collapse-body").hide();

    // Toggle collapse-body visibility on arrow click
    $(".collapse-arrow").click(function (e) {
        e.preventDefault();
        var collapseBody = $(this).closest('.collapse-main').find(".collapse-body");
        collapseBody.slideToggle();
        toggleExpandCollapseLinks();
    });

    // Toggle collapse-body visibility on header click
    $(".collapse-head").click(function (e) {
        e.preventDefault();
        $(this).next(".collapse-body").slideToggle();
        toggleExpandCollapseLinks();
    });

    // Expand all collapsible sections when Expand All is clicked
    $("#Expandall").click(function (e) {
        e.preventDefault();
        $(".collapse-body").slideDown();
        toggleExpandCollapseLinks();
    });

    // Collapse all collapsible sections when Collapse All is clicked
    $("#Collapseall").click(function (e) {
        e.preventDefault();
        $(".collapse-body").slideUp();
        toggleExpandCollapseLinks();
    });

    $("#Selectall input").change(function () {
        var isChecked = $(this).prop('checked');
        $(".permission-checkbox").prop('checked', isChecked);
        updateSelectAllState();
    });

    // Update "Select all" checkbox when a child checkbox is clicked
    $(".permission-checkbox").change(function () {
        updateSelectAllState();
    });

    // Function to update the state of the "Select all" checkbox
    function updateSelectAllState() {
        var totalCheckboxes = $(".permission-checkbox").length;
        var checkedCheckboxes = $(".permission-checkbox:checked").length;

        if (checkedCheckboxes === totalCheckboxes) {
            $("#Selectall input").prop("checked", true).prop("indeterminate", false);
        } else if (checkedCheckboxes > 0) {
            $("#Selectall input").prop("checked", false).prop("indeterminate", true);
        } else {
            $("#Selectall input").prop("checked", false).prop("indeterminate", false);
        }
    }

    // Function to update visibility of Expand/Collapse links
    function toggleExpandCollapseLinks() {
        var totalCollapsibles = $(".collapse-body").length;
        var openCollapsibles = $(".collapse-body:visible").length;

        if (openCollapsibles === totalCollapsibles) {
            // Agar saare collapsibles open hain, "Expand all" hide ho aur "Collapse all" show ho
            $("#Expandall").hide();
            $("#Collapseall").show();
        } else {
            // Agar koi bhi collapse band hai, "Expand all" show ho aur "Collapse all" hide ho
            $("#Expandall").show();
            $("#Collapseall").hide();
        }
    }

    // Call toggle function on initial page load to set correct state
    toggleExpandCollapseLinks();


    $("#MainCheckbox").change(function () {
        var isChecked = $(this).prop('checked');
        $(this).closest('.checkbox-permission-main').find(".permission-checkbox").prop('checked', isChecked);
    });
});

$(document).ready(function () {

    // Initially hide the "Hide permission" link and Managercollapse
    $("#hidePermission").hide();
    $("#Managercollapse").hide();

    // Show the permission (display Managercollapse)
    $("#showPermission").click(function (e) {
        e.preventDefault();
        $("#Managercollapse").slideDown(); // Show Managercollapse
        $("#showPermission").hide(); // Hide "Show permission"
        $("#hidePermission").show(); // Show "Hide permission"
    });

    // Hide the permission (hide Managercollapse)
    $("#hidePermission").click(function (e) {
        e.preventDefault();
        $("#Managercollapse").slideUp(); // Hide Managercollapse
        $("#hidePermission").hide(); // Hide "Hide permission"
        $("#showPermission").show(); // Show "Show permission"
    });
});

document.getElementById('AccessCheckbox').addEventListener('change', function () {
    var setupRoleDiv = document.querySelector('.setuprole');
    if (this.checked) {
        setupRoleDiv.style.display = 'block'; // Show the div if checkbox is checked
    } else {
        setupRoleDiv.style.display = 'none'; // Hide the div if checkbox is unchecked
    }
});

document.getElementById('SetupCheckbox').addEventListener('change', function () {
    var setupRoleDiv = document.querySelector('.alert-box');
    if (this.checked) {
        setupRoleDiv.style.display = 'flex'; // Show the div if checkbox is checked
    } else {
        setupRoleDiv.style.display = 'none'; // Hide the div if checkbox is unchecked
    }
});

function generatePin() {
    // Generate a random 6-digit number
    var pin = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
    // Insert the generated PIN into the input field
    document.getElementById('pinInput').value = pin;
}