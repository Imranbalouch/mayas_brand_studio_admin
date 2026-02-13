document.title="Dashboard | File Manager";
let uploadbtn = $("#fileUploadbtn");
$(document).ready(function(){
    uploadbtn.hide();
    showFileList();
});
function showUploadFileForm() {
    $('#filesList').hide();
    $("#images-fileUpload").empty();
    $("#fileFetch").parent().removeClass("d-none");
    $("#fileUploadbtn").parent().addClass("d-none");
    $("#pagination-file-links").parent().addClass("d-none");
    $("#images-fileUpload").append(
        `<div class="row">
                <div class="col-sm">
                    <div class="fm-body" style="text-align: center;">
                    <div class="mb-6 fv-row col-md-12">
                        <div class="form-group">
                        <input class="required" multiple id="uploadFileImage" type="file" w="20" h="20"
                            accept=".svg,.pdf,.docx,.png, .jpg, .jpeg, .webp" required hidden>
                        <div class="file-preview-box">
                            <label for="uploadFile" class="custom-upload-file-wrapper2 cursor">
                            <div>
                                <img class="d-block mx-auto" width="40px" src="./assets/img/Image-preview.svg"
                                alt="">
                                <label class="mb-6  form-label" for=""><span>(max file size 5mb)</span></label>
                            </div>
                            </label>
                        </div>
                        <div class="file-preview-imgs"></div>
                        <div class="row" id="images-container"></div>
                        <span class="error-txt"></span>
                        </div>

                    </div>
                    </div>
                </div>
            </div>`
    );
}

function showFileList() {
    $('#filesList').show();
    $('#images-container').empty();
    $("#images-fileUpload").empty();
    $("#fileFetch").parent().addClass("d-none");
    $("#fileUploadbtn").parent().removeClass("d-none");
    $("#pagination-file-links").parent().removeClass("d-none");
    filesmanager(1, null, null, null);
}

function filesmanager(page, val = null, inputname = null, inputFiles = null) {
    let dataType = $('input[name="filedataType"]').val();
    $.ajax({
        url: `${filebase}/filemanager/getfiles?page=${page}`,
        type: 'GET',
        data: {
            search: val,
            dataType:dataType
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        }, 
        success: function(response) {
            $('#files-container').empty();
            $('#pagination-file-links').empty();
            let deletetbn = 0;
            if (Boolean(response.permissions["add"])) {
                uploadbtn.show();
            }
            if (Boolean(response.permissions["delete"])) {
                deletetbn = 1
            }
            let inputFilesArray = [];
            if (inputFiles != null) {
                inputFilesArray = inputFiles.split(',');
            }
            
            $.each(response.images.data, function(index, image) {
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
                let viewfile='';
                if(image.type == 'image'){
                    viewfile = `<img height="100" class="filemanage_img" src="${AssetsCMSPath+'/'+image.uploaded_image}"
                    alt="" data-h="${image.height}" data-w="${image.width}">`;
                }else if(image.type== 'video'){
                    viewfile=`<video height="100" class="filemanage_img" src="${AssetsCMSPath+'/'+image.uploaded_image}"></video>`;
                }else{
                    viewfile = `<div class="card-body fmapp-info-trigger">
                        <i class="fa fa-file text-danger filemanager-documnet"></i>
                    </div>`;
                }
                
                $('#files-container').append(
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
                                    </div>                                        <div class="text-truncate fs-10">Size: (${bytesToSize(image.file_size)})</div>
                                        ${image.height !== null && image.width !== null ? `<div class="text-truncate fs-10">Dimensions: (${image.height} x ${image.width})</div>` : ''}
                                    </div>
                                    <div class="d-flex">
                                        <span class="file-star"><span class="feather-icon"><i data-feather="star"></i></span></span>
                                        <a class="btn btn-xs btn-icon btn-flush-dark btn-rounded flush-soft-hover flex-shrink-0"
                                        href="#" data-bs-toggle="dropdown" role="button"
                                        aria-haspopup="true" aria-expanded="false">
                                        <span class="icon"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></span></span>
                                        </a>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item" href="${AssetsPath+image.uploaded_image}" target="_blank">
                                                <span class="feather-icon dropdown-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></span>
                                                <span>Preview</span></a>
                                                
                                            <a class="dropdown-item" href="${AssetsPath+image.uploaded_image}" download>
                                                <span class="feather-icon dropdown-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></span>
                                                <span>Download</span></a>
                                            
                                            ${Boolean(deletetbn) ? `<a class="dropdown-item del-button" onclick="deletedFileRoute(this)" data-deleteroute="${image.uuid}" href="javascript:void(0)">
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
                $('#pagination-file-links').append(`
                    <button type="button" data-page="${prevPageParamNumber}" title="Previous Page" aria-pressed="false" class="fc-prev-button btn btn-primary btn-icon btn-flush-dark btn-rounded flush-soft-hover prev-file-page">
                        <span class="tf-icon ri-arrow-left-s-line ri-20px"></span>
                    </button>
                `);
            }
            if (response.images.next_page_url != null) {
                const nextPage = response.images.next_page_url;
                const nextPageParam = new URLSearchParams(new URL(nextPage).search);
                const nextPageParamNumber = nextPageParam.get("page");
                $('#pagination-file-links').append(
                    `<button type="button" data-page="${nextPageParamNumber}" title="Next Page" aria-pressed="false" class="fc-next-button btn btn-primary btn-icon btn-flush-dark btn-rounded flush-soft-hover next-file-page">
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

const deletedFileRoute = (element) => {
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
                xhr.setRequestHeader("menu-uuid", menu_id);
                imgload.show();
            }, 
            success: function(data) {
                try {
                    if (data.status_code == 200) {
                        imgload.hide();
                        showToast(data.message, 'Success', 'success');
                        filesmanager(1, null, null, null);
                    }
                } catch (error) {
                    console.error('Error while deleting image:', error);
                    imgload.hide();
                    showToast(error.message, 'Error', 'error');
                }
                
            },
            error: function(xhr, status, error) {
                imgload.hide();
                showToast('Error', 'Error', 'error');
            }
        });
    });
}

$(document).on('click', '.prev-file-page, .next-file-page', function(e) {
    e.preventDefault();
    let filemanaerselectedfiles = $('input[name="upload_file]').val();
    let inputfielddata = $('input[name="inputfielddata"]').val()
    let selectedData = $('input[name="' + inputfielddata + '"]').val();
    var page = $(this).data('page');
    let searchval = null;
    filesmanager(page, searchval, null, filemanaerselectedfiles);
});

$("#fileUploadbtn").click(showUploadFileForm);

$("#fileFetch").click(showFileList);
