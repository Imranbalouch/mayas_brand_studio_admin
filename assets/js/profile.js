document.title="Dashboard | Profile";
$(document).ready(function () {
    let iti
    let uuid = localStorage.getItem('Id')
    if (uuid) {
        document.querySelector('input[name="uuid"]').value = uuid;
    }

    let Role_id = localStorage.getItem('Role_id')
    if (Role_id) {
        document.querySelector('input[name="role_id"]').value = Role_id;
    }

    Onload();

    // Update/reset user image of account page
    let accountUserImage = document.getElementById('uploadedAvatar_Add');
    const fileInput = document.querySelector('.account-file-input'),
        resetFileInput = document.querySelector('.account-image-reset');

    if (accountUserImage) {
        const resetImage = accountUserImage.src;
        fileInput.onchange = () => {
            if (fileInput.files[0]) {
                accountUserImage.src = window.URL.createObjectURL(fileInput.files[0]);
            }
        };

    }
    function maskEmail(email) {
        const parts = email.split('@');
        let maskedEmail;
    
        if (parts[1] !== 'gmail.com') {
            const domainemail = parts.length === 2 ? parts[1] : '@gmail.com';
            const domainsubstr_1 = domainemail.slice(0, 3) + '***';
            const domainsubstr_2 = domainemail.slice(-4);
            const firstTwoLetters = parts[0].slice(0, 2);
            maskedEmail = `${firstTwoLetters}***@${domainsubstr_1}${domainsubstr_2}`;
        } else {
            const firstTwoLetters = email.slice(0, 2);
            const lastTwoBeforeDomain = email.slice(-12, -10);
            maskedEmail = `${firstTwoLetters}***${lastTwoBeforeDomain}@gmail.com`;
        }
    
        return maskedEmail;
    }

    function Onload() {

        // alert("sdsd");

        $.ajax({
            url: ApiForm + '/profile/edit/' + uuid,
            type: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                xhr.setRequestHeader("uuid", uuid);
                imgload.show();
            },
            success: function (response) {
                imgload.hide();
                if (response.status_code == 200) {

                    const data = response.data;

                    $('#first_name').val(data.first_name);
                    $('#last_name').val(data.last_name);
                    $('#email').val(data.email);
                    $('#role_id').val(data.role_id);
                    $('#organization').val(data.organization);
                    $('#phone').val(data.phone);
                    iti.setNumber(data.phone);
                    $('input[name="phone"]').val(data.phone);
                    $('#address').val(data.address);
                    $('#state').val(data.state);
                    $('#zipcode').val(data.zipcode);
                    $('#country').val(data.country).trigger('change');
                    $('#language').val(data.language);
                    const maskedEmail = maskEmail(data.email);
                    $('.modal-body .fw-medium.d-block').text(maskedEmail);

                   
                localStorage.setItem("FirstName", data.first_name || '');
                localStorage.setItem("LastName", data.last_name || '');
                localStorage.setItem("Email", data.email);
                localStorage.setItem("PhotoUrl", data.image);

                updateStaffName();

                    if (data.image) {
                        $('#uploadedAvatar_Add').addClass('d-block');
                        $('#uploadedAvatar_Add').attr('src', AssetsPath + data.image);
                    }

                    if (data.image) {
                        $('#uploadedAvatar_Add').removeClass('d-none').addClass('d-block').attr('src', AssetsPath + data.image);
                    } else {
                        $('#uploadedAvatar_Add').removeClass('d-block').addClass('d-none').attr('src', '');
                    }

                    $('#status').val(data.status);
                    $('#role_name').val(data.role_name); 

                }
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
                    showToast(htmlError, 'Error', 'error');

                } else {
                    // Handle other errors
                    showToast('Error', 'Error', 'error');
                }
            }
        });

        return true;

    }
    function updateStaffName() {
        const StaffFirstName = localStorage.getItem('FirstName');
        const StaffLastName = localStorage.getItem('LastName');
        const StaffImage = localStorage.getItem('PhotoUrl');
        $('#staff_name').html(StaffFirstName + ' ' + StaffLastName);
        $('.rounded-circle').attr('src', AssetsPath + StaffImage);
    }  

    $("#formAccountSettings").on("submit", function (e) {
        e.preventDefault();  // Prevent the form's default submit action

        // Initialize FormData and populate it with form fields
        let formData = new FormData(this);

        // Handle image upload
        const imageFile = $("#FileUploadSingle_add")[0].files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        }
        $.ajax({
            url: ApiForm + "/profile_update",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                xhr.setRequestHeader("uuid", uuid);
                imgload.show();
            },
            success: function (response) {
                if (response.status_code == 200) {
                    imgload.hide();
                    startTimer();
                    let title = response.message;
                    showToast(title, 'Success', 'success');
                    $("#profileOtpModal").modal('show');
                }
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
                    showToast(htmlError, 'Error', 'error');

                } else {
                    // Handle other errors
                    showToast('', 'Error', 'error');
                }
            }
        });


    });

    // Reset button
    $(".account-image-reset").click(function () {
        $("#uploadedAvatar_Add").attr("src", "assets/img/avatars/1.png"); // Reset image preview
        $("#FileUploadSingle_add").val(null); // Clear the file input
    });

    // intlTelInput JS
    
    var input = document.querySelector("#phone");
    if (input) {
      iti = window.intlTelInput(input, {
        initialCountry: "ae",
        preferredCountries: ['ae'],
        autoPlaceholder: "polite",
        showSelectedDialCode: true,
        utilsScript: "./assets/plugins/intel-input/utils.js",
        hiddenInput: () => ({ phone: "phone" })
      });
      function validateInput() {
        if (input.value.trim()) {
          if (iti.isValidNumber()) {
            input.parentElement.parentElement.classList.remove("error");
            input.parentElement.parentElement.querySelector(".error-txt").innerHTML = "";
            $("#formAccountSettings").find("button[type='submit']").prop("disabled", false);
            $("input[name='phone']").val(iti.getNumber());
            input.setAttribute("data-full-phone", iti.getNumber());
          } else {
            input.parentElement.parentElement.classList.add("error");
            input.parentElement.parentElement.querySelector(".error-txt").innerHTML = "Invalid Number";
            $("#formAccountSettings").find("button[type='submit']").prop("disabled", true);
            $("input[name='phone']").val('');
            input.removeAttribute("data-full-phone");
          }
        } else {
          input.parentElement.parentElement.classList.remove("error");
          input.parentElement.parentElement.querySelector(".error-txt").innerHTML = "";
          $("#formAccountSettings").find("button[type='submit']").prop("disabled", false);
          $("input[name='phone']").val('');
          input.removeAttribute("data-full-phone");
        }
      }

      input.addEventListener("blur", validateInput);
      input.addEventListener("keyup", validateInput);
    }
    // intlTelInput JS End    
});


