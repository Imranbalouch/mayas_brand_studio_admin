
var PageNo = 1;
var PageSize = 10;
var totalRecord = 0;
var PageLength = 0;
var Search = '';
let keyupTimer;
var btnupd = $('#btn_upd');
var btnsav = $('#btn_sav');
var txtid = $('#txt_id');
var btnnew=$('#btnnew');
let translations=[]; 
 $(document).ready(function() {  
   // Onload(); 
  
 }); 
 let myTimeout1; // Declare myTimeout1 at a higher scope 
$("#uploadFile1").on("change", async function(e) {
    e.preventDefault();
    let file = e.target.files[0];
    if (!file) {
        return;
    }

    $(this).parents(".form-group").removeClass("error");
    let fileName = file.name;
    let fileSize = file.size;
    inputCrop = e.target;
    let fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase(); // Ensure this is defined
    let fileImage = URL.createObjectURL(file);

    const validExtensions = ["png", "jpg", "jpeg", "webp", "docx", "pdf", "svg"];
    
    if (!validExtensions.includes(fileExt)) {
        showError("Invalid file extension.");
        return;
    }

    if (fileSize > 5000000) {
        showError("File size must be less than 5MB.");
        return;
    }

    await displayFilePreview(file, fileImage, fileExt, fileSize); // Pass fileExt and fileSize

    // Start the upload process after a delay
    clearTimeout(myTimeout1);
    myTimeout1 = setTimeout(upload_file, 2000);
});

function showError(message) {
    $(inputCrop).parents(".form-group").addClass("error");
    $(inputCrop).parents(".form-group").find(".error-txt").html(message);
    $(inputCrop).val(""); // Clear the input value
}

async function displayFilePreview(file, fileImage, fileExt, fileSize) { 
    // Define an object to map file extensions to icons
    const fileIcons = {
        'pdf': AssetsPath+'/upload_files/icons/pdf-icon.png',
        'docx': AssetsPath+'/upload_files/icons/docx-icon.png',
        'png': AssetsPath+'/upload_files/icons/file-line-icon.png',
        'jpg': AssetsPath+'/upload_files/icons/file-line-icon.png',
        'jpeg': AssetsPath+'/upload_files/icons/file-line-icon.png',
        'webp': AssetsPath+'/upload_files/icons/file-line-icon.png',
        'svg': AssetsPath+'/upload_files/icons/file-line-icon.png'
        // Add more file types and their corresponding icons if needed
    };

    const iconPath = fileIcons[fileExt] || AssetsPath+'/upload_files/icons/file-line-icon.png'; // Default icon for unknown types

    // If it's an image, show it as an image preview
    if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(fileExt)) {
        var fileReader = new FileReader();

        fileReader.onload = function() {
            var img = new Image();
            img.src = fileReader.result;

            img.onload = function() {
                $(inputCrop).parents(".form-group").find(".file-preview-imgs").html(`
                    <div class="preview-card">
                        <div class="img">
                            <img src="${fileImage}" alt="">
                        </div>
                        <div class="card-info">
                            <div class="card-name">${file.name.length >= 7 ? file.name.slice(0, 7).replace(/\.[^/.]+$/, "") + "..." : file.name.replace(/\.[^/.]+$/, "")}.${fileExt}</div>
                            <div class="card-size">${calc_file_size(fileSize)}</div>
                        </div>
                    </div>
                `);
            };
        };

        fileReader.readAsDataURL(file);
    } else {
        // For other file types, show an icon and file info
        $(inputCrop).parents(".form-group").find(".file-preview-imgs").html(`
            <div class="preview-card">
                <div class="img">
                    <img src="${iconPath}" alt="${fileExt} icon">
                </div>
                <div class="card-info">
                    <div class="card-name">${file.name.length >= 7 ? file.name.slice(0, 7).replace(/\.[^/.]+$/, "") + "..." : file.name.replace(/\.[^/.]+$/, "")}.${fileExt}</div>
                    <div class="card-size">${calc_file_size(fileSize)}</div>
                </div>
            </div>
        `);
    }

    // Remove file preview
    $(inputCrop).parents(".form-group").find(".file-preview-imgs .preview-card .remove").on("click", function(e) {
        e.preventDefault();
        $(this).closest('.preview-card').remove();
        $(inputCrop).val("");
    });
}
async function upload_file() {
    var formData = new FormData();
    var files = $('#uploadFile1')[0].files;

    for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
    }

    $('#images-container').append(`
        <div style="display:flex;justify-content:center">
            <span class="spinner-border spinner-border-sm"></span>&nbsp; Processing...
        </div>
    `);

    try {
        const data = await ajax_call(formData);
        // Handle success (e.g., display success message)
    } catch (error) {
        // Handle error (e.g., display error message)
        console.error(error);
    }
}

function ajax_call(formData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${ApiCms}/filemanager/store`,
            type: "POST",
            processData: false,
            contentType: false,
            data: formData,
            headers: {
                "Authorization": `Bearer ${strkey}`,
                'menu-uuid': menu_id
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${strkey}`);
                imgload.show();
                $('#images-container').append(`
                    <div style="display:flex;justify-content:center">
                        <span class="spinner-border spinner-border-sm"></span>&nbsp; Processing...
                    </div>
                `);
            },
            success: function(data) {
                resolve(data);
                imgload.hide();
                $('#images-container').html(``);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                reject(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    });
}
