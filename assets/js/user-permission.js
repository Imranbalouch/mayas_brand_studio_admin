document.title = "Dashboard | User Permission";
$(document).ready(function () {
    // Yeh code tab chalega jab document ready ho jaye
    Onload();
    GenerateCode();

    // Select the parent container where staff blocks are present
    var userNameContainer = document.getElementById("UserName");
    // Count direct child divs of #UserName (each staff block)
    var staffBlocks = userNameContainer.querySelectorAll("div.d-flex.align-items-center");

    // Total allowed staff (you can make this dynamic if needed)
    var totalAllowed = 15;

    // Update the Staffcount h5
    var staffCountElement = document.getElementById("Staffcount");
    staffCountElement.innerText = `Staff (${staffBlocks.length} of ${totalAllowed})`;
});
// copyCode();

function Onload() {
    $.ajax({
        url: ApiForm + '/get_users', // API end point
        type: "Get",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();

            let data = response.data;
            console.log(response.data);

            let htmlLi = ``;
            for (const key in data) {
                let item = data[key];

                let getInitialName = getInitials(item.first_name)
                htmlLi += ` 
                <div id="StaffName" class="d-flex align-items-center gap-3 mb-5">
                    <span>${getInitialName}</span>
                    <div class="comment-owner-main">
                        <a class="EditStaff" href="" data-uuid="${item.uuid}">${item.first_name}</a>
                        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <p>${item.last_login ? item.last_login : "Invitation sent"}</p>
                            <div>${item.permission_status ? item.permission_status : ""}</div>
                        </div>
                    </div>
                </div>`

            }
            $("#UserName").append(htmlLi);

            const totalAllowed = 15;

            $("#Staffcount").html(`Staff (${data.length} of ${totalAllowed})`)

            // $(document).ready(function () {
            //     // Select the parent container where staff blocks are present
            //     var userNameContainer = document.getElementById("UserName");
            //     // Count direct child divs of #UserName (each staff block)
            //     var staffBlocks = userNameContainer.querySelectorAll("div.d-flex.align-items-center");
            
            //     // Total allowed staff (you can make this dynamic if needed)
            //     var totalAllowed = 15;
            
            //     // Update the Staffcount h5
            //     var staffCountElement = document.getElementById("Staffcount");
            //     staffCountElement.innerText = `Staff (${staffBlocks.length} of ${totalAllowed})`;
            // });
            
        }
    });
}

function getInitials(name) {
    const words = name.trim().split(" ");
    const initials = words.map(word => word[0].toUpperCase()).join("");
    return initials;
}



$("#EditTableButton").click(function (e) {
    e.preventDefault();
    $("#EditTable").toggle();
});

$("body").on("click", ".EditStaff", function (e) {
    e.preventDefault();
    let staffId = $(this).data('uuid'); 
    let page = 'edit-staff';
    window.location.assign('?P=' + page + '&M=' + menu_id + '&uuid=' + staffId);
});

document.getElementById("transferStore").addEventListener("submit", function (e) {
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

document.querySelectorAll("#transferStore input").forEach(function (input) {
    input.addEventListener("input", function () {
        input.parentElement.classList.remove("error");
        input.parentElement.querySelector(".error-txt").innerHTML = ""; // Remove redundant query
    });
});

$(".new-add-staff").on("click", function (e) {
    e.preventDefault();
    let page = 'new-add-staff';
    window.location.assign('?P=' + page + '&M=' + menu_id);
});

function GenerateCode() {
    // Generate a random 6-digit number
    var pin = Math.floor(1000 + Math.random() * 9000);
    // Insert the generated PIN into the input field
    document.getElementById('GenerateCodeInput').value = pin;
}

function copyCode() {
    var input = document.getElementById('GenerateCodeInput');
    var pin = input.value;

    if (pin) {
        // Copy to clipboard
        navigator.clipboard.writeText(pin).then(function () {
        //     alert("PIN copied to clipboard: " + pin);
        // }, function (err) {
        //     alert("Failed to copy: " + err);
        Toastify({
            text: "Copied to clipboard!",
            duration: 100000,
            gravity: "bottom", // top or bottom
            position: "center", // left, center or right
            backgroundColor: "#000",
            close: true
        }).showToast();
        });
    }
}

