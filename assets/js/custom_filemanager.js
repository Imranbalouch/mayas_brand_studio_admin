document.title = "Dashboard | File Manager";
const filebase = ApiCms;
let currentField = null;
let multipleImage = false;
let selectedFiles = false; 
var customWidth;
var customHeight;
var CropBoxWidth;
var CropBoxHeight;
const imageExtensions = ['gif', 'webp', 'svg', 'png', 'jpg', 'jpeg','ico'];
const videoExtensions = ['wmv','mkv','swf','flv','mov','avi','ogg','mpeg','mpg','mp4']
const documentExtensions = ['.pdf,.doc,.docx,.odt,.txt'];
const fileCssExtensions = ['css','min.css','scss','woff2','woff','scss'];
const fileJsExtensions = ['js','min.js'];
const model3DExtensions = ['glb'];
const mediaExtensions = [...imageExtensions, ...videoExtensions, ...model3DExtensions];
const acceptTypes = imageExtensions.map(ext => `image/${ext}`).join(',');
const acceptTypesVideo = videoExtensions.map(ext => `image/${ext}`).join(',');
const acceptTypesDocument = documentExtensions.map(ext => `image/${ext}`).join(',');
const imageUploadSize = convertMBtoBytes(5); // Maximum number of images to display per page
const msgFileUpload = "File size exceeds the 5MB limit.";

const acceptTypes3DModel = model3DExtensions.map(ext => `.${ext}`).join(',');


function validateFileType(file, dataType) {
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    
    // Define validation rules for each data type
    const validationRules = {
        'image': {
            extensions: imageExtensions,
            errorMessage: 'Please select an image file. Allowed formats: ' + imageExtensions.join(', ')
        },
        'video': {
            extensions: videoExtensions,
            errorMessage: 'Please select a video file. Allowed formats: ' + videoExtensions.join(', ')
        },
        'document': {
            extensions: documentExtensions.map(ext => ext.replace(/[,.]/g, '')), // Remove dots and commas
            errorMessage: 'Please select a document file. Allowed formats: ' + documentExtensions.join(', ')
        },
        'css': {
            extensions: fileCssExtensions,
            errorMessage: 'Please select a CSS file. Allowed formats: ' + fileCssExtensions.join(', ')
        },
        'js': {
            extensions: fileJsExtensions,
            errorMessage: 'Please select a JavaScript file. Allowed formats: ' + fileJsExtensions.join(', ')
        },
        '3dmodel': {
            extensions: model3DExtensions,
            errorMessage: 'Please select a 3D model file. Allowed formats: ' + model3DExtensions.join(', ')
        },
        'media': {
            extensions: mediaExtensions,
            errorMessage: 'Please select an image, video, or 3D model file. Allowed formats: ' + mediaExtensions.join(', ')
        },
        'all': {
            extensions: null, // No restriction for 'all' type
            errorMessage: null
        }
    };
    
    // Get validation rule for the current data type
    const rule = validationRules[dataType];
    
    // If no rule exists or dataType is 'all', allow all files
    if (!rule || dataType === 'all' || !rule.extensions) {
        return { isValid: true, errorMessage: null };
    }
    
    // Check if file extension is in allowed extensions
    const isValid = rule.extensions.includes(fileExtension);
    
    return {
        isValid: isValid,
        errorMessage: isValid ? null : rule.errorMessage
    };
}

function convertMBtoBytes(mb) {
    return mb * 1024 * 1024;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced version of fetchImages
const debouncedFetchImages = debounce(fetchImages, 1000);

// Modified click handler
$(document).ready(function() {
    $('.custome-filemanager').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling
      
      try {
        const $this = $(this);
        currentField = $this.find('.selected-files');
        
        // Safe data retrieval with default values
        let dataType = $(this).data('type')  == 'undefined' ||  $(this).data('type')  == null  ? 'all' :$(this).data('type');
        multipleImage = $(this).data('multiple')  == 'undefined' ||  $(this).data('multiple')  == null  ? false : true ;
        let inputName = $(this).find('.selected-files').attr('name');
        let inputFiles = $(this).find('.selected-files').val() ?? null;
        
        // Safe width/height retrieval
        customWidth = parseInt($this.data('width')) || 0;
        customHeight = parseInt($this.data('height')) || 0;
        
        // Update form fields
        $('#custom_width').val(customWidth);
        $('#custom_height').val(customHeight);
        
        CropBoxWidth = customWidth;
        CropBoxHeight = customHeight;
        
        $('input[name="inputfielddata"]').val(inputName);
        $('input[name="filedataType"]').val(dataType);
        
        // Show modal safely
        const $modal = $('#exampleModalLarge01');
        if ($modal.length) {
          $modal.modal('show');
        }
        
        $('input[name="filemanaerselectedfiles"]').val(inputFiles);
        
        // Set file type restrictions
        const uploadFile = $('#uploadFile');
        if (uploadFile.length) {
          switch(dataType) {
            case 'image':
              uploadFile.attr('accept', acceptTypes);
              break;
            case 'video':
              uploadFile.attr('accept', acceptTypesVideo);
              break;
            case 'document':
              uploadFile.attr('accept', acceptTypesDocument);
              break;
            case 'css':
              uploadFile.attr('accept', fileCssExtensions);
              break;
            case 'js':
              uploadFile.attr('accept', fileJsExtensions);
              break;
            case '3dmodel':
              uploadFile.attr('accept', acceptTypes3DModel);
              break;
            default:
              uploadFile.attr('accept', '*');
          }
        }
        
        // Update selected files display
        const inputFilesArray = inputFiles ? inputFiles.split(',') : [];
        const selectedfilemsg = inputFilesArray.length > 0 
          ? `<p>${inputFilesArray.length} Files Selected <span class="text-primary"><a href="javascript:void(0)" onclick="filemanagerclearselection()">Clear Selection</a></span></p>`
          : `0 Files Selected`;
        
        $('.no_ofselectedfiles').html(selectedfilemsg);
        
        // Fetch images safely
        fetchImages(1, null, inputName, inputFiles, this);
        
        // Show appropriate tab
        $('a[href="#tab_block_14"]').tab('show');
      } catch (error) {
        console.error('File manager initialization error:', error);
      }
    });
});

function hide_add_button(){ 
    $("#add_custom_file").hide();
}
const customFilemanager = (file)=>{
    currentField = $(file).find('.selected-files');
    let dataType = $(file).data('type')  == 'undefined' ||  $(file).data('type')  == null  ? 'all' :$(file).data('type') ;
    multipleImage = $(file).data('multiple')  == 'undefined' ||  $(file).data('multiple')  == null  ? false : true ;
    let inputName = $(file).find('.selected-files').attr('name');
    let inputFiles = $(file).find('.selected-files').val() ?? null;

    // Extract width and height from data attributes
    customWidth = $(file).data('width') || 0; // default 0 if not defined
    customHeight = $(file).data('height') || 0; // default 0 if not defined
    // Set these values to the respective inputs
    $('#custom_width').val(customWidth);
    $('#custom_height').val(customHeight);

    CropBoxWidth = customWidth;
    CropBoxHeight = customHeight;
      
    $('input[name="inputfielddata"]').val(inputName);
    $('input[name="filedataType"]').val(dataType);
    $('#exampleModalLarge01').modal('show');
    $('input[name="filemanaerselectedfiles"]').val(inputFiles)
    if (dataType == 'image') {
        $('#uploadFile').attr('accept', acceptTypes);
    } else if (dataType == 'video') {
        $('#uploadFile').attr('accept', acceptTypesVideo);
    } else if (dataType == 'document') {
        $('#uploadFile').attr('accept', acceptTypesDocument);
    } else if (dataType == 'media') {
        // Combine accept types for images, videos and 3D models
        const acceptMediaTypes = [
            ...imageExtensions.map(ext => `image/${ext}`),
            ...videoExtensions.map(ext => `video/${ext}`),
            ...model3DExtensions.map(ext => `model/${ext}`)
        ].join(',');
        $('#uploadFile').attr('accept', acceptMediaTypes);
    } else {
        $('#uploadFile').attr('accept', '*');
    }
    fetchImages(1, null, inputName, inputFiles,this);
    let inputFilesArray = inputFiles !== '' && inputFiles !== null ? inputFiles.split(',') : [];
    let selectedfilemsg = inputFilesArray.length> 0 ?`<p>${inputFilesArray.length} Files Selected <span style="text-primary"><a href="javascript:void(0)" onclick="filemanagerclearselection()">Clear Selection</a></span></p>`:`0 Files Selected`;
    $('.no_ofselectedfiles').html(selectedfilemsg);
    $('a[href="#tab_block_14"]').tab('show');
    $('a[href="#tab_block_14"]').click();
}

// Add debounce function at the top
const swithtabselectfile = () => {
    let inputfielddata = $('input[name="inputfielddata"]').val()
    // let selectedData = $('input[name="' + inputfielddata + '"]').val();
    let selectedData = $(currentField).val();
    let searchval = $('input[name="search"]').val();
    fetchImages(1, searchval, null, selectedData);
    $("#add_custom_file").show();
}

function fetchImages(page, val = null, inputname = null, inputFiles = null) {    
    let dataType = $('input[name="filedataType"]').val();
    //console.log("current_theme",current_theme);
    
    $.ajax({
        url: `${filebase}/filemanager/getfiles?page=${page}`,
        type: 'GET',
        data: {
            search: val,
            dataType: dataType === 'media' ? 'all' : dataType // Pass 'all' to backend but we'll filter client-side
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", filemanager_id);
            xhr.setRequestHeader("current-theme", current_theme);
            imgload.show();
        }, 
        success: function(response) {
            $('#images-container').empty();
            $('#pagination-links').empty();
            let deletetbn = 0;
            if (Boolean(response.permissions["add"])) {
                $("#fileupload-modal").show();
            }else{
                $("#fileupload-modal").hide();
            }
            if (Boolean(response.permissions["delete"])) {
                deletetbn = 1
            }
            let inputFilesArray = [];
            if (inputFiles != null) {
                inputFilesArray = inputFiles.split(',');
            }
            
            // Filter by media types if dataType is 'media'
            let filteredImages = response.images.data;
            if (dataType === 'media') {
                filteredImages = response.images.data.filter(image => {
                    const ext = image.file_name.split('.').pop().toLowerCase();
                    return mediaExtensions.includes(ext);
                });
            }
            
            $.each(filteredImages, function(index, image) {
                const filename = image.file_original_name.substring(0, 7);
                const filenameOriginal = image.file_original_name;
                const fileuniqueimg = image.file_name;
                const fileuniqueLinkimg = AssetsCMSPath+'/'+image.file_name;

                let activeSelectedFile = '';
                if (inputFilesArray.length > 0) {
                    if (inputFilesArray.includes(fileuniqueimg)) {
                        activeSelectedFile = 'selected-image';
                    }
                }
                let viewfile = generatePreviewImage(image.file_name);
                
                $('#images-container').append(
                    `<div class="col-sm-3 p-2">
                        <div class="card card-border ${activeSelectedFile}" style="cursor:pointer;margin-bottom: 10px; margin-top: 40px;height: 200px" data-inputname="${inputname}" data-oname="${filename}" data-image="${fileuniqueLinkimg}"  data-name="${fileuniqueimg}" data-h="${image.height}" data-w="${image.width}" onclick="selectImage(this)">
                            <div class="d-flex justify-content-center align-items-center overflow-hidden">
                                ${viewfile}
                            </div>
                            <div class="card-footer">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                    <div 
                                        class="file-name" 
                                        title="${filenameOriginal}" 
                                        data-filename="${filename}" 
                                        data-original="${filenameOriginal}" 
                                        style="position: relative; display: inline-block; cursor: pointer;"
                                        onmouseover="this.innerText=this.getAttribute('data-original')"
                                        onmouseout="this.innerText=this.getAttribute('data-filename') + '..'">
                                        ${filename}..
                                    </div>
                                        <div class="text-truncate fs-10">Size: (${bytesToSize(image.file_size)})</div>
                                        ${image.height !== null && image.width !== null ? `<div class="text-truncate fs-10">Dimensions: (${image.height} x ${image.width})</div>` : ''}
                                    </div>
                                    <div class="d-flex">
                                        <span class="file-star"><span class="feather-icon"><i data-feather="star"></i></span></span>
                                        <a class="btn btn-xs btn-icon btn-flush-dark btn-rounded flush-soft-hover flex-shrink-0"
                                        href="#" data-bs-toggle="dropdown" role="button"
                                        aria-haspopup="true" aria-expanded="false">
                                        <span class="icon"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></span></span>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-end">
                                            <a class="dropdown-item" href="${AssetsPath+image.uploaded_image}" target="_blank">
                                                <span class="feather-icon dropdown-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></span>
                                                <span>Preview</span></a>
                                            <a class="dropdown-item" href="${AssetsPath+image.uploaded_image}" download>
                                                <span class="feather-icon dropdown-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></span>
                                                <span>Download</span></a>
                                            ${Boolean(deletetbn) ? `<a class="dropdown-item del-button" onclick="deletedRoute(this)" data-deleteroute="${image.uuid}" href="javascript:void(0)">
                                                <span class="feather-icon dropdown-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span>
                                                <span>Delete</span></a>` : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                );
            });

            if (response.images.prev_page_url != null) {
                const prev_page_url = response.images.prev_page_url;
                const prev_pageParam = new URLSearchParams(new URL(prev_page_url).search);
                const prevPageParamNumber = prev_pageParam.get("page");
                $('#pagination-links').append(`
                    <button type="button" data-page="${prevPageParamNumber}" title="Previous Page" aria-pressed="false" class="fc-prev-button btn btn-primary btn-icon btn-flush-dark btn-rounded flush-soft-hover prev-page">
                        <span class="tf-icon ri-arrow-left-s-line ri-20px"></span>
                    </button>
                `);
            }
            if (response.images.next_page_url != null) {
                const nextPage = response.images.next_page_url;
                const nextPageParam = new URLSearchParams(new URL(nextPage).search);
                const nextPageParamNumber = nextPageParam.get("page");
                $('#pagination-links').append(
                    `<button type="button" data-page="${nextPageParamNumber}" title="Next Page" aria-pressed="false" class="fc-next-button btn btn-primary btn-icon btn-flush-dark btn-rounded flush-soft-hover next-page">
                        <span class="tf-icon ri-arrow-right-s-line ri-20px"></span>
                    </button>
                `);

            }
            imgload.hide();  
            $("#tab_block_24").find('.file-preview-imgs').empty();
        },
        error: function (xhr, status, err) {
            imgload.hide();
            showToast(xhr.responseJSON.message, 'Error', 'error');
        }
    });
}
// Helper function to get view file HTML based on file type
function getViewFile(image) {
    if (image.type === 'image') {
        return `<img height="100" class="filemanage_img" src="${AssetsCMSPath + '/' + image.uploaded_image}"
                alt="" data-h="${image.height}" data-w="${image.width}">`;
    } else if (image.type === 'video') {
        return `<div class="card-body fmapp-info-trigger justify-content-center align-item-center" style="height:100px">
                <span class="feather-icon filemanager-documnet">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-video">
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                </span>
               </div>`;
    }
    return `<div class="card-body fmapp-info-trigger">
            <i class="fa fa-file text-danger filemanager-documnet"></i>
           </div>`;
}

// Helper function to render pagination
function renderPagination(images) {
    if (images.prev_page_url) {
        const prev_pageParam = new URLSearchParams(new URL(images.prev_page_url).search);
        const prevPageParamNumber = prev_pageParam.get("page");
        $('#pagination-links').append(generatePaginationButton('prev', prevPageParamNumber));
    }
    
    if (images.next_page_url) {
        const nextPageParam = new URLSearchParams(new URL(images.next_page_url).search);
        const nextPageParamNumber = nextPageParam.get("page");
        $('#pagination-links').append(generatePaginationButton('next', nextPageParamNumber));
    }
}

// Add event listeners for search input
$('input[name="search"]').on('input', function() {
    const searchval = $(this).val();
    debouncedFetchImages(1, searchval);
});

const selectImage = (imagebox) => {
    let fileName = $(imagebox).data('name');
    fileHeight = $(imagebox).data('h'); // Extracting height
    fileWidth = $(imagebox).data('w');  // Extracting width

    let filemanaerselectedfiles = $('input[name="filemanaerselectedfiles"]').val();
    let filemanaerselectedfilesArray = [];
    let selectedOfileNames = []; // Array to hold multiple oname values

    if (filemanaerselectedfiles != '') {
        filemanaerselectedfilesArray = filemanaerselectedfiles.split(',');
    }

    let allSelectedFiles = $('.selected-image');

    if (!multipleImage) {
        allSelectedFiles.each((index, element) => {
            $(element).removeClass('selected-image');
        });
    }

    if ($(imagebox).hasClass('selected-image')) {
        $(imagebox).removeClass('selected-image');
        filemanaerselectedfilesArray = filemanaerselectedfilesArray.filter(e => e !== fileName);
    } else {
        $(imagebox).addClass('selected-image');
        if (!filemanaerselectedfilesArray.includes(fileName)) {
            if (!multipleImage && filemanaerselectedfilesArray.length < 1) {
                filemanaerselectedfilesArray.push(fileName);
            } else {
                filemanaerselectedfilesArray.push(fileName);
            }
        }
    }

    // Collect all selected `oname` values
    $('.selected-image').each((index, element) => {
        selectedOfileNames.push($(element).data("oname"));
    });

    let seperatedImages = filemanaerselectedfilesArray.join();
    if (!multipleImage) {
        seperatedImages = fileName;
    }

    $('input[name="filemanaerselectedfiles"]').val(seperatedImages);
    $('input[name="filemanaerselectedfiles"]').attr('data-oname', selectedOfileNames.join(','));

    // Assign height and width data attributes after confirming the image selection
    $('input[name="filemanaerselectedfiles"]').attr('data-h', fileHeight);  // Setting height attribute
    $('input[name="filemanaerselectedfiles"]').attr('data-w', fileWidth);   // Setting width attribute
    let selectedfilemsg = $('.selected-image').length> 0 ?`<p>${$('.selected-image').length} Files Selected <span style="text-primary"><a href="javascript:void(0)" onclick="filemanagerclearselection()">Clear Selection</a></span></p>`:`0 Files Selected`;
    $('.no_ofselectedfiles').html(selectedfilemsg);
}

const addFilestoField = (btn) => {
    let filemanaerselectedfiles = $('input[name="filemanaerselectedfiles"]').val();
 
    let filemanaerselectedfilesArray = [];
    if (filemanaerselectedfiles == '') {
        showToast('Please select at least one image', 'Error', 'error');
        return;
    }
    if (filemanaerselectedfiles != '') {
        filemanaerselectedfilesArray = filemanaerselectedfiles.split(',');
    }
    var imagesext = imageExtensions.filter(ext => ext !== 'svg'); // List of allowed image extensions, excluding svg
    if (filemanaerselectedfiles != '') {
        
        if (fileWidth < customWidth) {
            showToast('File size is too small. Please select another file.', 'Warning', 'warning');
            let inputName = $('input[name="inputfielddata"]').val();
            let inputFieldData = currentField;
            // let inputFieldData = $('input[name="' + inputName + '"]');
            let previewimgdiv = inputFieldData.parent().parent().find('.filemanager-image-preview');
            
            $(previewimgdiv).empty();
            filemanagerclearselection();
            return;

        }else if(fileHeight < customHeight){
            showToast("File size is too small. Please select another file", 'Warning', 'warning');
            let inputName = $('input[name="inputfielddata"]').val();
            let inputFieldData = currentField;
            // let inputFieldData = $('input[name="' + inputName + '"]');
            let previewimgdiv = inputFieldData.parent().parent().find('.filemanager-image-preview');
            $(previewimgdiv).empty();
            filemanagerclearselection();
            
            return;

        }else{
            // Split the selected files
            filemanaerselectedfilesArray = filemanaerselectedfiles.split(',');

            // Check if all selected files are images
            let allImages = filemanaerselectedfilesArray.every(function (file) {
                let fileExtension = file.split('.').pop().toLowerCase();
                return imagesext.includes(fileExtension); // Check if the file extension is an image
            });

            if (allImages) {
                // If the file dimensions don't match the crop dimensions
                if ((customHeight > 0 && customWidth > 0) && (fileWidth > customWidth || fileHeight > customHeight)  && fileWidth != null && fileHeight != null) {
                    // Open the cropper modal for cropping images
                    openCropperModal(filemanaerselectedfiles);
                }
            }
        }
    }

    let inputName = $('input[name="inputfielddata"]').val();
    let inputFieldData = currentField;
    let previewimgdiv = inputFieldData.parent().parent().find('.filemanager-image-preview');

    $(previewimgdiv).empty();

    // Assuming Onames are stored as data attributes for each selected image
    let selectedOfileNames = [];
    $('.selected-image').each((index, element) => {
        selectedOfileNames.push($(element).data("oname"));
    });
    
    //console.log('filemanaerselectedfilesArray',filemanaerselectedfilesArray);
    filemanaerselectedfilesArray.map((e, i) => {
        
        let viewfile = generatePreviewImage(e);
        //console.log("viewfileadd",viewfile);
        
        // Get the corresponding Onames for the current file
        let currentOname = selectedOfileNames[i] || ''; // Default to empty if not found

        if (currentOname) {
            viewfile += `
            <span class="preview-title2" style="display:none>${currentOname}</span>
            `;
        }
        
        $(previewimgdiv).append(`
            <div class="card filemanager-preview-image preview-card" data-previewimage="${e}">
                <div class="rounded-end bg-primary-light-5 close-over position-relative">
                    <button type="button" class="close-row" onClick="removepreviewImage(this)">
                        <span aria-hidden="true">x</span>
                    </button>
                </div>
                ${viewfile}
            </div>`);
    });

    inputFieldData.val(filemanaerselectedfiles).trigger("input");
    let fileAmountMessage = '';
    if (filemanaerselectedfilesArray.length > 0) {
        fileAmountMessage = `${filemanaerselectedfilesArray.length} files selected`;
    } else {
        fileAmountMessage = `Choose File`;
    }
    inputFieldData.parent().find('.file-amount').html(fileAmountMessage);

    $('input[name="inputfielddata"]').val('');
    $('input[name="filemanaerselectedfiles"]').val('');
    $('input[name="filemanaerselectedfiles"]').attr('data-oname', '');
    $('#exampleModalLarge01').modal('hide');
    $('.dz-preview').remove();
}

let cropperInstance;
let currentFiles = [];
let currentFileIndex = 0;
let croppedFilesArray = []; // Store the cropped files

// Open Cropper Modal and initialize cropping
const openCropperModal = (filemanagerselectedfiles) => {
    currentFiles = filemanagerselectedfiles.split(',');
    currentFileIndex = 0;
    croppedFilesArray = []; // Clear any previous cropped files
    showImageForCropping(currentFiles[currentFileIndex]);
};

// Function to show image for cropping
const showImageForCropping = (fileURL) => {
    const croppingImage = document.getElementById('croppingImage');
    croppingImage.src = AssetsPath+'/' + fileURL;

    $('#cropModal').modal('show');

    // Initialize Cropper for the current image
    if (cropperInstance) {
        cropperInstance.destroy();
    }

    setTimeout(() => {
        cropperInstance = new Cropper(croppingImage, {
            viewMode: 2,
            autoCropArea: 0.1,
            aspectRatio: CropBoxWidth / CropBoxHeight,
            zoomable: false,
            minCropBoxWidth: CropBoxWidth,
            minCropBoxHeight: CropBoxHeight,
            cropBoxResizable: false,
            dragMode: "move",
            movable: false
        });
    }, 500);
};

// When user clicks crop button, apply the crop and save the cropped image
$('#cropButton').on('click', function () {
    if (cropperInstance) {

        const croppedCanvas = cropperInstance.getCroppedCanvas({
            width: CropBoxWidth,
            height: CropBoxHeight,
        });

        // Convert the cropped image to a Blob (optional)
        croppedCanvas.toBlob(function (blob) {
            // Generate a random filename with width and height
            const filename = `cropped-image (${CropBoxWidth}x${CropBoxHeight})-${generateRandomFileName()}.jpg`;
            const formattedURL = 'uploads/all/' + filename;

            // Add the cropped file URL to the array for the preview
            croppedFilesArray.push(formattedURL);

            // Move to the next image in the list
            currentFileIndex++;
            if (currentFileIndex < currentFiles.length) {
                showImageForCropping(currentFiles[currentFileIndex]); // Show next image for cropping
            } else {
                // All images cropped, close the modal and update the UI
                $('#exampleModalLarge01').modal('show');  // Show the main modal
                $('#cropModal').modal('hide');           // Hide the crop modal

                // Reset cropper and file index after cropping all images
                $('#cropModal').on('hidden.bs.modal', function () {
                    $('#cropModal').off('hidden.bs.modal');
                    
                });

                // Call updateFilePreview to update the UI with cropped images
                updateFilePreview();

                // Trigger function after showing the modal
                $('#exampleModalLarge01').on('shown.bs.modal', function () {
                    swithtabselectfile();  // Call the function when the modal is shown
                });
            }

        }, 'image/jpeg');
    }
});

// Utility function to generate a random filename
const generateRandomFileName = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Update the file preview with cropped images
const updateFilePreview = () => {
    let inputFieldData = currentField;  // Get the current input field
    let previewimgdiv = inputFieldData.parent().parent().find('.filemanager-image-preview');
    $(previewimgdiv).empty();  // Clear the existing preview

    // Loop through cropped files and generate preview
    croppedFilesArray.map((fileURL) => {
        let viewfile = generatePreviewImage(fileURL);  // Generate the preview HTML
        $(previewimgdiv).append(`
            <div class="card filemanager-preview-image" data-previewimage="${fileURL}">
                <div class="rounded-end bg-primary-light-5 close-over position-relative">
                    <button type="button" class="close-row btn-close" onClick="removepreviewImage(this)">
                        <span aria-hidden="true">x</span>
                    </button>
                </div>
                ${viewfile}
            </div>`);
    });

    // Also update the hidden input with the cropped file URLs (comma-separated)
    inputFieldData.val(croppedFilesArray.join(','));
};

const generatePreviewImage = (file) => {
    
    let extension = file.substring(file.lastIndexOf('.') + 1);
    let viewfile = ``;
    let imagesext = imageExtensions;
    let cssext=fileCssExtensions;
    let jsext=fileJsExtensions;
    let model3Dext=model3DExtensions;
    let filesext =videoExtensions
    
    if (extension != '') {
        if (imagesext.includes(extension)) {
            viewfile = `
            <img class="filemanager-previewImage" src="${AssetsPath+'/'+file}" onerror="this.src='./assets/images/no-image.png'" 
            alt="" srcset="" height="75px;">
            `;
        }else  if (cssext.includes(extension)) {
            viewfile = `<div class="card-body fmapp-info-trigger">
                <i class="ri-file-fill text-danger filemanager-documnet"></i>
            </div>`;
        }else  if (jsext.includes(extension)) {
            viewfile = `<div class="card-body fmapp-info-trigger">
                 <i class="ri-file-fill text-danger filemanager-documnet"></i>
            </div>`;
        }else if (model3Dext.includes(extension)) {
            viewfile = `
                <div class="card-body fmapp-info-trigger text-center">
                    <model-viewer src="${AssetsPath + '/' + file}" 
                                alt="3D Model" 
                                auto-rotate>
                    </model-viewer>
                </div>`;
        }else if(filesext.includes(extension)) {
            viewfile = `<div class="fmapp-info-trigger filemanager-previewImage">
                            <video height="100" class="filemanage_img" src="${AssetsPath+'/'+file}"></video>
                        </div>
                        <a href="${AssetsPath+'/'+file}" target="_blank">View</a>`;
        }
         else {
            viewfile = `<div class="card-body fmapp-info-trigger filemanager-previewImage">
                <i class="ri-file-fill text-danger filemanager-documnet"></i>
            </div>`;
        }
        return viewfile;
    }    
}

const updatePreviewImageOnModal = (modalId,file) => {
     let previewimgdiv = $('#'+modalId).find('.filemanager-image-preview'); 
    $(previewimgdiv).empty();
    let viewfile = generatePreviewImage(file);
    if (viewfile !== undefined) {
        $(previewimgdiv).append(`
        <div class="${(page_id == 'themeadd' || page_id == 'themeedit') ? 'col-sm-2' : 'col-sm-4' } px-1 py-5">
            <div class="card filemanager-preview-image" data-previewimage="${file}">
                <div
                    class=" rounded-end  bg-primary-light-5 close-over position-relative">
                    <button type="button" class="close-row " onClick="removepreviewImage(this)">
                        <span aria-hidden="true">x</span>
                    </button>
                </div>
                ${viewfile}
            </div>
        </div>`);
    }
}

$('input[name="search"]').on('input', function() {
    let searchval = $('input[name="search"]').val();
    debouncedFetchImages(1, searchval, null, null);
})

const removepreviewImage = (btn) => {
    let removeimage = $(btn).parent().parent().data('previewimage');
    console.log(removeimage);
    
    // let fileldVlaue = $(fieldname).val();
    let field = $(btn).parent().parent().parent().parent().parent().find('.selected-files');
    let fileldVlaue = $(field).val();
    let fileldVlaueArray = fileldVlaue.split(',');
    let updatedValues = [];
    if (fileldVlaueArray.length > 0) {
        fileldVlaueArray.map((e, i) => {
            if (e != removeimage) {
                updatedValues.push(e)
            }
        })
    }
    let splicImages = '';
    let fileamoumtmsg = 'Choose File';
    let fileamount = $(btn).parent().parent().parent().parent().parent().find('.file-amount');
    if (updatedValues.length > 0) {
        splicImages = updatedValues.join();
        fileamoumtmsg = `${updatedValues.length} files selected`;
    } else {}

    $(fileamount).html(fileamoumtmsg);
    $(field).val(splicImages);
    $(field).trigger('change');
    $(btn).parent().parent().remove();    
}


const getSelectedFilesName = async (fieldname) => {
    return new Promise((resolve, reject) => {
        if (fieldname !== '') {
            $.ajax({
                url: ApiCms + '/filemanager/getselectedfile',
                type: "GET", // Make sure it's "GET"
                contentType: "application/json",
                dataType: "json",
                data: { fileid: fieldname },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                    imgload.show();
                },
                success: function (response) {
                    imgload.hide();
                    resolve(response.file?.file_original_name);  // Resolving the name
                },
                error: function (error) {
                    imgload.hide();
                    reject('Failed to fetch file name');  // Rejecting on error
                }
            });
        } else {
            reject('Fieldname is empty'); // Reject if no fieldname
        }
    });
};

const filemanagerImagepreview = async () => {
    let selectedfiles = $('.selected-files');
    let imagesext = ['gif', 'webp', 'svg', 'png', 'jpg', 'jpeg'];
    let filesext = ['wmv', 'mkv', 'swf', 'flv', 'mov', 'avi', 'ogg', 'mpeg', 'mpg', 'mp4'];
    let model3d = ['glb'];
    for(const selectedfile of selectedfiles){
        let allFiles = $(selectedfile).val();
        let inputName = $(selectedfile).attr('name');
        if(allFiles != ''){
            let allFilesArray = allFiles.split(',');
            let previewParent = $(selectedfile).parent().parent().find('.filemanager-image-preview');
            $(previewParent).empty();
            for(const allFileArray of allFilesArray){
                let Name = await getSelectedFilesName(allFileArray);
                
                let extension = allFileArray.substring(allFileArray.lastIndexOf('.') + 1);               
                let viewfile = ``;
                if (imagesext.includes(extension)) {
                    viewfile = `
                    <img class="filemanager-previewImage" src="${AssetsPath+'/'+allFileArray}"
                    alt="" srcset="">
                    `; 
                } else if (filesext.includes(extension)) {
                    viewfile =
                        `<div class="card-body fmapp-info-trigger filemanager-previewImage"><span class="feather-icon filemanager-documnet"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-video"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg></span></div>
                        <a href="${AssetsPath+'/'+allFileArray}" target="_blank"> view </a>`;
    
                }else if(model3d.includes(extension)){
                    viewfile = `
                    <div class="card-body fmapp-info-trigger text-center">
                        <model-viewer src="${AssetsPath + '/' + allFileArray}" 
                                    alt="3D Model" 
                                    auto-rotate>
                        </model-viewer>
                    </div>
                    `;
                } else {
                    viewfile = `<div class="card-body fmapp-info-trigger filemanager-previewImage">
                        <i class="ri-file-fill text-danger filemanager-documnet"></i>
                    </div>`;
                }
                if(Name!=null){
                    viewfile =viewfile+`
                    <span class="preview-title2">${Name}<span>
                    `;
                }
                $(previewParent).append(`
                    <div class="card filemanager-preview-image preview-card" data-previewimage="${allFileArray}">
                        <div
                            class=" rounded-end  bg-primary-light-5 close-over position-relative">
                            <button type="button" class="close-row  " onClick="removepreviewImage(this)">
                                <span aria-hidden="true">x</span>
                            </button>
                        </div>
                        ${viewfile}
                    </div>
                `);
            }
    
            let fileAmountMessage = '';
            if (allFilesArray.length > 0) {
                fileAmountMessage = `${allFilesArray.length} files selected`;
            } else {
                fileAmountMessage = `Choose File`;
            }
            $(selectedfile).parent().find('.file-amount').html(fileAmountMessage)            
        }
    }
    
}

$(document).on('click', '.prev-page, .next-page', function(e) {
    e.preventDefault();
    let filemanaerselectedfiles = $('input[name="upload_file]').val();
    let inputfielddata = $('input[name="inputfielddata"]').val()
    let selectedData = $('input[name="' + inputfielddata + '"]').val();
    var page = $(this).data('page');
    let searchval = null;
    debouncedFetchImages(page, searchval, null, filemanaerselectedfiles);
});


$('input[name="filemanagersearch"]').on('input',function () {
    let filemanagersearch = $('input[name="filemanagersearch"]').val();
    let filemanaerselectedfiles = $('input[name="filemanaerselectedfiles"]').val();
    debouncedFetchImages(1, filemanagersearch, null, filemanaerselectedfiles);
})

const filemanagerclearselection = ()=>{
    $(currentField).val('');
    $('input[name="filemanaerselectedfiles"]').val('');
    let previewImgDiv =  $(currentField).parent().parent().find('.filemanager-image-preview');
    previewImgDiv.empty();
    $(previewImgDiv).parent().find('.file-amount').html('Choose File');
    debouncedFetchImages(1, null, null, null);
    let selectedfilemsg = `0 Files Selected`;
    $('.no_ofselectedfiles').html(selectedfilemsg);

}

$(document).ready(function () {
    filemanagerImagepreview();
});

//////////// Save File

let myTimeout; // Declare myTimeout at a higher scope 
$("#uploadFile").on("change", async function(e) {
    e.preventDefault();
    
    let files = e.target.files;
    if (!files || files.length === 0) {
        return;
    }
    
    // Get current data type
    let dataType = $('input[name="filedataType"]').val() || 'all';
    
    // Validate each file before processing
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        
        // Validate file type
        let validation = validateFileType(file, dataType);
        if (!validation.isValid) {
            showToast(validation.errorMessage, 'File Type Error', 'error');
            $(this).val(''); // Clear the input
            return; // Stop processing if any file is invalid
        }
        
        // Validate file size
        if (file.size > imageUploadSize) {
            showToast(msgFileUpload, 'File Size', 'error');
            $(this).val(''); // Clear the input
            return;
        }
    }
    
    // If all files pass validation, proceed with existing logic
    imgload.show();
    
    for (let i = 0; i < files.length; i++) {
        $(this).parents(".form-group").removeClass("error");
        let fileName = files[i].name;
        let fileSize = files[i].size;
        inputCrop = e.target;
        let fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        let fileImage = URL.createObjectURL(files[i]);
        
        await displayFilePreview(files[i], fileImage, fileExt, fileSize);
    }
    
    // Start the upload process after a delay
    clearTimeout(myTimeout);
    myTimeout = setTimeout(upload_file, 2000);
    
    imgload.hide();
});

$("#uploadFileImage").on("change", async function(e) {
    e.preventDefault();
    
    let files = e.target.files;
    if (!files || files.length === 0) {
        return;
    }
    
    // Get current data type
    let dataType = $('input[name="filedataType"]').val() || 'all';
    
    // Validate each file before processing
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        
        // Validate file type
        let validation = validateFileType(file, dataType);
        if (!validation.isValid) {
            showToast(validation.errorMessage, 'File Type Error', 'error');
            $(this).val(''); // Clear the input
            return; // Stop processing if any file is invalid
        }
        
        // Validate file size (50MB for image upload)
        if (file.size > 52428800) {
            showError("File size must be less than 50MB.");
            $(this).val(''); // Clear the input
            return;
        }
    }
    
    // If all files pass validation, proceed with existing logic
    for (let i = 0; i < files.length; i++) {
        $(this).parents(".form-group").removeClass("error");
        let fileName = files[i].name;
        let fileSize = files[i].size;
        inputCrop = e.target;
        let fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        let fileImage = URL.createObjectURL(files[i]);
        
        await displayFilePreview(files[i], fileImage, fileExt, fileSize);
    }
    
    // Start the upload process after a delay
    clearTimeout(myTimeout);
    myTimeout = setTimeout(upload_file, 2000);
    debouncedFetchImages(1, null, null, null);
});

function showError(message) {
    $(inputCrop).parents(".form-group").addClass("error");
    $(inputCrop).parents(".form-group").find(".error-txt").html(message);
    $(inputCrop).val(""); // Clear the input value
}

async function displayFilePreview(file, fileImage, fileExt, fileSize) { 
    // Define an object to map file extensions to icons
    const fileIcons = {
        'pdf': AssetsPath+'/upload_files/icons/file-line-icon.png',
        'docx': AssetsPath+'/upload_files/icons/file-line-icon.png',
        'png': AssetsPath+'/upload_files/icons/image-icon.png',
        'jpg': AssetsPath+'/upload_files/icons/image-icon.png',
        'jpeg': AssetsPath+'/upload_files/icons/image-icon.png',
        'webp': AssetsPath+'/upload_files/icons/image-icon.png',
        'svg': AssetsPath+'/upload_files/icons/file-line-icon.png'
        // Add more file types and their corresponding icons if needed
    };

    const iconPath = fileIcons[fileExt] || AssetsPath+'/upload_files/icons/file-line-icon.png'; // Default icon for unknown types

    // If it's an image, show it as an image preview
    if (imageExtensions.includes(fileExt)) {
        var fileReader = new FileReader();

        fileReader.onload = function() {
            var img = new Image();
            img.src = fileReader.result;

            img.onload = function() {
                $(inputCrop).parents(".form-group").find(".file-preview-imgs").append(`<hr>
                    <div class="preview-card">
                        <div class="img">
                            <img width="50" src="${fileImage}" alt="">
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
        $(inputCrop).parents(".form-group").find(".file-preview-imgs").html(`<hr>
            <div class="preview-card">
                <div class="img">
                    <img width="50" src="${iconPath}" alt="${fileExt} icon">
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
    var files = $('#uploadFile')[0].files;
    let ErrorFile = [];
    
    // Get current data type for additional validation
    let dataType = $('input[name="filedataType"]').val() || 'all';
    
    for (var i = 0; i < files.length; i++) {
        // Double-check validation before upload
        let validation = validateFileType(files[i], dataType);
        if (!validation.isValid) {
            showToast(validation.errorMessage, 'File Type Error', 'error');
            imgload.hide();
            return;
        }
        
        formData.append('file', files[i]);
        $('#images-container').append(`
            <div style="display:flex;justify-content:center">
                <span class="spinner-border spinner-border-sm"></span>&nbsp; Processing...
            </div>
        `);
        
        try {
            const data = await ajax_call(formData);
            ErrorFile = data
        } catch (error) {
            imgload.hide();
            showToast(error, 'Error', 'error');
        }
    }
    
    if (ErrorFile.status_code == 201) {
        showToast(ErrorFile.message, 'Success', 'success');
        $('a[href="#tab_block_14"]').tab('show');
        $('a[href="#tab_block_14"]').click();
        fetchImages(1, null, null, null);
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
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${strkey}`);
                xhr.setRequestHeader("menu-uuid", menu_id);
                xhr.setRequestHeader("current-theme", current_theme);
                imgload.show();
            },
            success: function(data) {
                console.log("filemanager store", data);
                resolve(data);
                imgload.hide();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(`Error: ${jqXHR.responseJSON.message} - ${errorThrown}`);
                reject(`Error: ${jqXHR.responseJSON.message} - ${errorThrown}`);
            }
        });
    });
}

///
$('#cropButton').on('click', function () {
    if (cropperInstance) {
        cropperInstance.getCroppedCanvas({
            width: CropBoxWidth,
            height: CropBoxHeight,
        }).toBlob(function (blob) {
            // Create a FormData object
            const formData = new FormData();
            // Create a file-like object for the blob
            const filename = `cropped-image (${CropBoxWidth}x${CropBoxHeight}).jpg`;
            const croppedFile = new File([blob], filename, { type: 'image/jpeg' });
            // Append the cropped file to the FormData object with the key 'file'
            formData.append('file', croppedFile);
            // Send the cropped image to the server using AJAX
            ajax_call(formData);
        }, 'image/jpeg'); // Specify the image format as needed
    }
});


function bytesToSize(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

const deletedRoute = (element) => {
    const deleteRoute = $(element).data('deleteroute');
    Swal.fire({
        title: getTranslation('deleteConfirmMsg'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: getTranslation('cancel'),
        confirmButtonColor: '#15508A',
        cancelButtonColor: '#15508A',
        confirmButtonText:  getTranslation('delete'),
        reverseButtons: true, 
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        $.ajax({
            url: ApiCms+'/filemanager/destroy/'+deleteRoute,
            type: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strkey); 
                xhr.setRequestHeader("menu-uuid", filemanager_id); 
                imgload.show();
            }, 
            success: function(data) {
                try {
                    if (data.status_code == 200) {
                        imgload.hide();
                        showToast(data.message, 'Success', 'success');
                        fetchImages(1, null, null, null);
                    }
                } catch (error) {
                    console.error('Error while deleting image:', error);
                    imgload.hide();
                    showToast(error.message, 'Error', 'error');
                }
                
            },
            error: function(xhr, status, error) {
                imgload.hide();
                showToast(xhr.responseJSON.message, 'Error', 'error');
            }
        });
    });
}

// Reset modal and destroy cropper when it's closed
$('#cropModal').on('hidden.bs.modal', function () {
    if (cropperInstance) {
        cropperInstance.destroy();  // Destroy cropper instance
        cropperInstance = null;
    }
    currentFiles = [];
    croppedFilesArray = [];
    currentFileIndex = 0;

    let inputName = $('input[name="inputfielddata"]').val();
    let inputFieldData = currentField;
    // let inputFieldData = $('input[name="' + inputName + '"]');
    let previewimgdiv = inputFieldData.parent().parent().find('.filemanager-image-preview');
    $(previewimgdiv).empty();
    filemanagerclearselection();
});
