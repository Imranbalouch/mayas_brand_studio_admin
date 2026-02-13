document.title = "Dashboard | Edit Staff";
$(document).ready(function () {
    // Get staff UUID from URL or other source
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get('uuid');
    
    // Fetch permissions first, then staff data
    fetchPermissions().then(() => {
        // Only fetch staff data after permissions are loaded
        if (uuid) {
            fetchStaffData(uuid);
        }
    });
    
    $('#RemoveAccess .btn-primary').on('click', function() {
        removeStaffMember(uuid);
    });
    
    // Form submission handler
    $('#staffForm').on('submit', function(e) {
        e.preventDefault();
        updateStaffData(uuid);
    });
    
    // Cancel button handler
    $('#cancelBtn').on('click', function() {
        window.location.href = '/staff'; // Redirect to staff listing
    });
    
    // Initially hide Collapse all
    $("#Collapseall").hide();

    // Hide collapse-body by default
    $(".collapse-body").hide();

    // Toggle collapse-body visibility on arrow click
    $(document).on("click", ".collapse-arrow", function(e) {
        e.preventDefault();
        var collapseBody = $(this).closest('.collapse-main').find(".collapse-body");
        collapseBody.slideToggle();
        toggleExpandCollapseLinks();
    });

    // Toggle collapse-body visibility on header click
    $(document).on("click", ".collapse-head", function(e) {
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
    $(document).on("change", ".permission-checkbox", function() {
        updateSelectAllState();
        updateGroupCheckboxState($(this).closest('.collapse-main'));
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
            $("#Expandall").hide();
            $("#Collapseall").show();
        } else {
            $("#Expandall").show();
            $("#Collapseall").hide();
        }
    }

    // Call toggle function on initial page load to set correct state
    toggleExpandCollapseLinks();

    // Group checkbox behavior
    $(document).on("change", ".group-checkbox", function() {
        const isChecked = $(this).prop('checked');
        $(this).closest('.collapse-main').find('.permission-checkbox').prop('checked', isChecked);
        updateGroupCheckboxState($(this).closest('.collapse-main'));
    });

    // Add staff name to the modal title dynamically
    $('.detail-input-red a').on('click', function() {
        const staffName = $('.comment-owner-main p').text();
        $('#RemoveAccessLabel').text('Confirm removing account for ' + staffName);
        $('.modal-title').text('Confirm removing account for ' + staffName);
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

document.addEventListener("DOMContentLoaded", function() {
    // Setup checkbox functionality
    const setupCheckbox = document.getElementById('SetupCheckbox');
    if (setupCheckbox) {
        setupCheckbox.addEventListener('change', function () {
            var setupRoleDiv = document.querySelector('.alert-box');
            if (this.checked) {
                setupRoleDiv.style.display = 'flex'; // Show the div if checkbox is checked
            } else {
                setupRoleDiv.style.display = 'none'; // Hide the div if checkbox is unchecked
            }
        });
    }

    // Generate PIN on page load
    generatePin();
});

function generatePin() {
    // Generate a random 6-digit number
    var pin = Math.floor(100000 + Math.random() * 900000);
    // Insert the generated PIN into the input field
    const pinInput = document.getElementById('pinInput');
    if (pinInput) {
        pinInput.value = pin;
    }
}

// Use Promise to ensure permissions are loaded before staff data
function fetchPermissions() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: ApiForm + '/permissions_menu',
            type: 'GET',
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                xhr.setRequestHeader("menu-uuid", menu_id);
            },
            success: function(response) {
                if (response.status_code === 200) {
                    // Store the raw permissions data
                    window.rawPermissions = response.data;
                    console.log("Permissions loaded successfully");
                    resolve();
                } else {
                    console.error('Failed to load permissions data:', response.message);
                    showToast('Failed to load permissions data', 'Error', 'error');
                    reject(response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching permissions:', error);
                showToast('Error fetching permissions: ' + error, 'Error', 'error');
                reject(error);
            }
        });
    });
}

function fetchStaffData(uuid) {
    if (!uuid) {
        console.error('Staff UUID is missing');
        showToast('Staff UUID is required', 'Error', 'error');
        return;
    }

    $.ajax({
        url: ApiForm + '/edit_staff/' + uuid,
        type: 'GET',
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
        },
        success: function(response) {
            if (response.status_code === 200) {
                // First populate form
                populateForm(response.data);
                
                // Then load permissions using the stored permissions data
                if (window.rawPermissions && window.rawPermissions.length > 0) {
                    loadPermissions(response.data);
                } else {
                    console.error('Permissions data not available');
                    showToast('Permissions data not available', 'Error', 'error');
                }
            } else {
                console.error('Failed to load staff data:', response.message);
                showToast('Failed to load staff data', 'Error', 'error');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching staff data:', error);
            showToast('Error fetching staff data: ' + error, 'Error', 'error');
        }
    });
}

function populateForm(data) {
    // Basic info
    $('#bio').val(data.bio || '');
    $('#personal_website').val(data.personal_website || '');
    $('#notification').prop('checked', data.notification == 1);
    
    // Set initials and name
    const initials = (data.first_name.charAt(0) + (data.last_name ? data.last_name.charAt(0) : ''));
    const fullName = `${data.first_name} ${data.last_name || ''}`.trim() || 'Unknown User';
    
    // Update main title
    $('.purchase-title').text(fullName);
    
    // Update admin name section
    $('.admin-name-main span').text(initials);
    $('.comment-owner-main p').text(fullName);
    $('.comment-owner-main a').text(data.email).attr('href', `mailto:${data.email}`);
    
    // Update Suspend Access Modal
    $('#SuspendAccess .modal-title').text(`Suspend ${fullName} account access`);
    $('#SuspendAccess .modal-body .detail-input span').text(`Are you sure you want to suspend account access for ${fullName}?`);
    
    // Update Remove Access Modal
    $('#RemoveAccess .modal-title').text(`Confirm removing account for ${fullName}`);
    $('#RemoveAccess .modal-body span').text(`Are you sure you want to remove the account for ${fullName}? This action cannot be reversed.`);
    
    // Update Manage Staff Access Section
    $('.detail-input label:contains("{{ full_name }}")').text(fullName);
    $('.detail-input-red a:contains("Remove {{ full_name }}")').text(`Remove ${fullName}`);
    
    // Update Store Permissions Section
    $('.pos-heading-main p:contains("Manage permissions for {{ full_name }}")').text(`Manage permissions for ${fullName}`);
}

function loadPermissions(staffData) {
    const permissionsContainer = $('#permissionsContainer');
    
    // Clear existing content to prevent duplicates
    permissionsContainer.empty();

    // Ensure we have permissions data
    if (!window.rawPermissions || window.rawPermissions.length === 0) {
        console.error('No raw permissions data available');
        showToast('No permissions data available to display', 'Error', 'error');
        return;
    }

    // Get the user's current permissions
    const userPermissions = staffData.special_permissions || [];
    console.log("User Permissions:", userPermissions);
    
    // Create a map of menu_id to permission data
    const menuPermissionsMap = {};
    
    // Process the raw permissions data to create our structure
    window.rawPermissions.forEach(perm => {
        // Build menu permissions map
        if (!menuPermissionsMap[perm.menu_id]) {
            menuPermissionsMap[perm.menu_id] = {
                menu_name: perm.menu_name,
                permissions: []
            };
        }
        
        // Add permission if not already present
        if (!menuPermissionsMap[perm.menu_id].permissions.some(p => p.id === perm.permission_id)) {
            menuPermissionsMap[perm.menu_id].permissions.push({
                id: perm.permission_id,
                name: perm.permission_name
            });
        }
    });

    // Build UI for permissions
    Object.entries(menuPermissionsMap).forEach(([menuId, menuData]) => {
        const menuPermissions = menuData.permissions || [];
        
        // Skip if no permissions in this menu
        if (menuPermissions.length === 0) {
            return;
        }
        
        // Create an HTML structure similar to the reference code
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
                        ${menuPermissions.map(perm => {
                            return `
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input permission-checkbox" 
                                               type="checkbox" 
                                               name="permissions[]" 
                                               id="ck_check_${menuId}_${perm.id}"
                                               data-menu-id="${menuId}"
                                               data-permission-id="${perm.id}"
                                               value="${perm.id}">
                                        <span>${perm.name}</span>
                                    </label>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
        
        permissionsContainer.append(groupHtml);
    });
    
    // Now check boxes based on user permissions after the DOM is built
    checkUserPermissions(userPermissions);
    
    // Update all group checkbox states
    $('.collapse-main').each(function() {
        updateGroupCheckboxState($(this));
    });
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
        // Fix: Access the proper fields from the permission object
        const menuId = perm.menu_id;
        const permissionId = perm.permission_id;
        const status = perm.status;
        
        console.log(`Checking permission: menu=${menuId}, permission=${permissionId}, status=${status}`);
        
        // Only check if status is 1 (enabled)
        if (status == 1) {
            // Find the checkbox by its ID which is constructed from menu_id and permission_id
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
    if (!groupContainer || groupContainer.length === 0) {
        return;
    }
    
    const groupCheckbox = groupContainer.find('.group-checkbox');
    if (!groupCheckbox.length) {
        return;
    }
    
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

function updateStaffData(uuid) {
    if (!uuid) {
        showToast('Staff UUID is required', 'Error', 'error');
        return;
    }
    
    const formData = {
        // Your existing form data
        first_name: $('#staffForm').find('input[name="first_name"]').val(),
        last_name: $('#staffForm').find('input[name="last_name"]').val(),
        email: $('#staffForm').find('input[name="email"]').val(),
        bio: $('#bio').val(),
        personal_website: $('#personal_website').val(),
        notification: $('#notification').is(':checked') ? 1 : 0,
        menus: []
    };
    
    // Build permissions data structure similar to the reference code
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
    
    console.log("Saving permissions:", formData.menus);
    
    // AJAX call to save data
    $('#saveBtn').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...');
    
    $.ajax({
        url: ApiForm + '/update_staff/' + uuid,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
        },
        success: function(response) {
            if (response.status_code === 200) {
                showToast('Staff updated successfully', 'Success', 'success', "?P=user-permission&M="+menu_id);
            } else {
                showToast(response.message || 'Failed to update staff', 'Error', 'error');
            }
        },
        error: function(xhr, status, error) {
            let errorMessage = 'Error updating staff';
            if (xhr.responseJSON && xhr.responseJSON.errors) {
                errorMessage += ': ' + Object.values(xhr.responseJSON.errors).join(', ');
            }
            showToast(errorMessage);
        },
        complete: function() {
            $('#saveBtn').prop('disabled', false).text('Save Changes');
        }
    });
}

function removeStaffMember(uuid) {
    if (!uuid) {
        showToast('Staff ID not found', 'Error', 'error');
        return;
    }
    
    // Disable the button and show loading state
    const $removeBtn = $('#RemoveAccess .btn-primary');
    const originalText = $removeBtn.text();
    $removeBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Removing...');
    
    $.ajax({
        url: ApiForm + '/delete_staff/' + uuid,
        type: 'DELETE',
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
        },
        success: function(response) {
            if (response.status_code === 200) {
                // Show success message
                showToast('Staff member successfully removed', 'Success', 'success', "?P=user-permission&M="+menu_id);
                // Close the modal
                $('#RemoveAccess').modal('hide');
            } else {
                showToast(response.message || 'Failed to remove staff member', 'Error', 'error');
                $removeBtn.prop('disabled', false).text(originalText);
            }
        },
        error: function(xhr, status, error) {
            let errorMessage = 'Error removing staff member';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            }
            showToast(errorMessage, 'Error', 'error');
            $removeBtn.prop('disabled', false).text(originalText);
        }
    });
}