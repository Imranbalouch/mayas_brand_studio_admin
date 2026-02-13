let imageFormat = ["jpg", "jpeg", "png", "gif"];
const tbNoFound = "No records found";
// Single File Upload

function generateFilePreview(file, fileReader) {
    let fileName = file.name;
    let fileSize = file.size;
    let fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);

    let filePreview = `
      <div class="preview-card">
        <div class="img">
          ${imageFormat.includes('.' + fileExt) ?
            `<img src="${fileReader.result}" alt=""></img>` :
            `<i class="fa-solid fa-file"></i>`
        }
          <span class="remove" onclick="this.parentNode.parentNode.remove()"><i class="fa-solid fa-x"></i></span>
        </div>
        <div class="card-info">
          <div class="card-name">${fileName}</div>
          <div class="card-size">${calc_file_size(fileSize)}</div>
        </div>
      </div>
    `;

    return filePreview;
}
function fileUpload(e) {
    let file = e.target.files[0];
    let fileUploader = $(e.target);

    if (!file) {
        return;
    }

    let fileName = file.name;
    let fileSize = file.size;
    let fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);
    let acceptedExtensions = fileUploader.attr("accept").split(",");

    // Validate file extension
    const allowedExtensions = acceptedExtensions;
    if (!allowedExtensions.includes('.' + fileExt)) {
        fileUploader.parents(".file-preview-box").parent('.form-group').addClass("error");
        fileUploader.parents(".file-preview-box").parent('.form-group').find(".error-txt").html("Invalid file extension: " + fileExt + ". Only the following extensions are allowed: " + acceptedExtensions);
        e.target.value = "";
        return;
    }

    // Display file preview
    let fileReader = new FileReader();
    fileReader.onload = function () {
        let filePreview = generateFilePreview(file, fileReader);

        fileUploader.parents(".file-preview-box").parent('.form-group').find(".file-preview-imgs").html(filePreview)

        // Add event listener to remove button
        fileUploader.parents(".file-preview-box").parent('.form-group').find(".file-preview-imgs").find(".remove").on("click", function (e) {
            e.preventDefault();
            console.log("remove");

            fileUploader.val("");
            fileUploader.parents(".file-preview-box").parent('.form-group').find(".file-preview-imgs").html("");
        })
    };
    fileReader.readAsDataURL(file);
}
function calc_file_size(bytes) {
    if (bytes >= 1073741824) {
        bytes = Math.floor(bytes / 1073741824) + " GB";
    } else if (bytes >= 1048576) {
        bytes = Math.floor(bytes / 1048576) + " MB";
    } else if (bytes >= 1024) {
        bytes = Math.floor(bytes / 1024) + " KB";
    } else if (bytes > 1) {
        bytes = Math.floor(bytes) + " Bytes";
    } else if (bytes == 1) {
        bytes = Math.floor(bytes) + " Byte";
    } else {
        bytes = "0 bytes";
    }
    return bytes;
}
// Multiple File Upload
$(".file-upload-multiple").each(function () {
    $(this).on("change", function (e) {
        e.preventDefault();
        let files = e.target.files;
        let fileUploader = $(this);

        $.each(files, function (index, file) {
            let fileName = file.name;
            let fileSize = file.size;
            let fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);

            // Validate file extension
            const allowedExtensions = ["css", "min.css", "js", "min.js"];
            if (!allowedExtensions.includes(fileExt)) {
                fileUploader.parents(".form-group").addClass("error");
                fileUploader.parents(".form-group").find(".error-txt").html("Invalid file extension");
                e.target.value = "";
                return;
            }

            // Validate file size
            if (fileSize > 2000000) {
                fileUploader.parents(".form-group").addClass("error");
                fileUploader.parents(".form-group").find(".error-txt").html("File size must be less than 2MB");
                e.target.value = "";
                return;
            }

            // Display file preview
            let fileReader = new FileReader();
            fileReader.onload = function () {
                let filePreview = `
            <div class="preview-card">
              <div class="img">
                <img src="${fileReader.result}" alt="">
                <span class="remove"><i class="fa-solid fa-x"></i></span>
              </div>
              <div class="card-info">
                <div class="card-name">${fileName}</div>
                <div class="card-size">${calc_file_size(fileSize)}</div>
              </div>
            </div>
          `;
                fileUploader.parents(".form-group").find(".file-preview-imgs").append(filePreview);

                // Add event listener to remove button
                fileUploader.parents(".form-group").find(".file-preview-imgs .remove").on("click", function (e) {
                    e.preventDefault();
                    $(this).parent().parent().remove();
                });
            };
            fileReader.readAsDataURL(file);
        });
    });
});
//cms
(function ($) {
    // USE STRICT
    "use strict";

    var AIZ = AIZ || {};

    AIZ.extra = {
        addMore: function () {
            $('[data-toggle="add-more"]').each(function () {
                var $this = $(this);
                var content = $this.data("content");
                var target = $this.data("target");
                $this.on("click", function (e) {
                    e.preventDefault();
                    $(target).append(content);
                });
            });
        },
        removeParent: function () {
            $(document).on(
                "click",
                '[data-toggle="remove-parent"]',
                function () {
                    var $this = $(this);
                    var parent = $this.data("parent");
                    $this.closest(parent).remove();
                }
            );
        },
    }

    setTimeout(function () {
        AIZ.extra.addMore();
        AIZ.extra.removeParent();
    }, 2000)
})(jQuery);


var ErrorMsgAPI = "ErrorMsgAPI";




function makeDataTable(tableId, data2, columns, exportOptions = {},configFilter = {}) {
    const defaultExportOptions = {
        buttons: []
    };
    // Add export buttons based on the provided exportOptions
    if (exportOptions.pdf) {
        defaultExportOptions.buttons.push({
            extend: 'pdf',
            text: '<i class="ri-file-pdf-line me-1"></i>Pdf',
            className: 'dropdown-item',
            exportOptions: {
                columns: ':visible',
                format: {
                    body: (inner) => exportFormat(inner)
                }
            }
        });
    }

    if (exportOptions.csv) {
        defaultExportOptions.buttons.push({
            extend: 'csv',
            text: '<i class="ri-file-text-line me-1"></i>Csv',
            className: 'dropdown-item',
            exportOptions: {
                columns: ':visible',
                format: {
                    body: (inner) => exportFormat(inner)
                }
            }
        });
    }

    if (exportOptions.excel) {
        defaultExportOptions.buttons.push({
            extend: 'excel',
            text: '<i class="ri-file-excel-line me-1"></i>Excel',
            className: 'dropdown-item',
            exportOptions: {
                columns: ':visible',
                format: {
                    body: (inner) => exportFormat(inner)
                }
            }
        });
    }

    if (exportOptions.print) {
        defaultExportOptions.buttons.push({
            extend: 'print',
            text: '<i class="ri-printer-line me-1"></i>Print',
            className: 'dropdown-item',
            exportOptions: {
                columns: ':visible',
                format: {
                    body: (inner) => exportFormat(inner)
                }
            }
        });
    }

    if (exportOptions.copy) {
        defaultExportOptions.buttons.push({
            extend: 'copy',
            text: '<i class="ri-file-copy-line me-1"></i>Copy',
            className: 'dropdown-item',
            exportOptions: {
                columns: ':visible',
                format: {
                    body: (inner) => exportFormat(inner)
                }
            }
        });
    }
    /////////////////////////////////////////////////////////
    $("#Table_View").DataTable().destroy();
    
   //console.log("config",configFilter);
   
    let dataTable = $(tableId).DataTable({
        data: data2,  // Pass the data array here
        columns: columns,
        ...configFilter,
        columnDefs: [
            // Add your custom column definitions here if necessary
        ],
        order: [[0, 'asc']],
        //dom: '<"card-header flex-column flex-md-row border-bottom"<"head-label text-center"><"dt-action-buttons text-end pt-3 pt-md-0"B>><"row"<"col-sm-12 col-md-6 mt-5 mt-md-0"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        //   dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f <"dt-action-buttons  text-end pb-md-5 pt-5 px-5"B>>>' + 
        //  't' + 
        //  '<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        dom:
            '<"card-header d-flex border-top rounded-0 flex-wrap pb-md-0 pt-0"' +
            '<"me-5 ms-n2"f>' +
            '<"d-flex justify-content-start justify-content-md-end align-items-baseline"<"dt-action-buttons d-flex align-items-start align-items-md-center justify-content-sm-center gap-4"lB>>' +
            '>t' +
            '<"row mx-1"' +
            '<"col-sm-12 col-md-6"i>' +
            '<"col-sm-12 col-md-6"p>' +
            '>',
        displayLength: 10,
        lengthMenu: [10, 25, 50, 100],
        language: {
            sLengthMenu: '_MENU_',
            search: '',
            searchPlaceholder: 'Search',
            info: 'Displaying _START_ to _END_ of _TOTAL_ entries',
            paginate: {
                next: '<i class="ri-arrow-right-s-line"></i>',
                previous: '<i class="ri-arrow-left-s-line"></i>'
            }
        },
        buttons:[], 
        // exportOptions.showButtons ? [
        //     {
        //         extend: 'collection',
        //         className: 'btn btn-label-primary dropdown-toggle me-4 waves-effect waves-light',
        //         text: '<i class="ri-external-link-line me-sm-1"></i> <span class="d-none d-sm-inline-block">Export</span>',
        //         buttons: defaultExportOptions.buttons,
        //     }
        // ]
        // : [],

        responsive: {
            details: {
                // display: $.fn.dataTable.Responsive.display.modal({
                //     header: (row) => {
                //         const secondIndexValue = row.data()[Object.keys(row.data())[1]];
                //         console.log('firstIndexValue',row.data(),secondIndexValue);
                //         return 'Details of ' + row.data()['name'] // Change if necessary
                //     }
                // }),
                type: 'column',
                renderer: (api, rowIdx, columns) => {
                    const data = $.map(columns, (col) => col.title !== ''
                        ? `<tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}"><td>${col.title.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); })}:</td><td style="white-space: normal; word-break: break-word;">${col.data}</td></tr>`
                        : ''
                    ).join('');
                    return data ? $('<table class="table"/><tbody />').append(data) : false;
                }
            }
        }
    });
    return dataTable;
}

function exportFormat(inner) {
    if (inner.length <= 0) return inner;
    let result = '';
    const el = $.parseHTML(inner);
    $.each(el, function (index, item) {
        if (item.classList && item.classList.contains('user-name')) {
            result += item.lastChild.firstChild.textContent;
        } else {
            result += item.innerText || item.textContent;
        }
    });
    return result;
}
// Function to disable all buttons on the page
function disableAllButtons(disable = true) {
    document.querySelectorAll("button").forEach(button => {
        button.disabled = disable;
    });
    document.querySelectorAll("input[type='checkbox']").forEach(button => {
        button.disabled = disable;
    });
    document.querySelectorAll("a.btn").forEach(button => {
        button.style.pointerEvents = disable ? 'none' : 'auto';
        button.style.opacity = disable ? '0.5' : '1';
    });
}

function showToast(message, title = '', type = 'info', redirect = null) {
    disableAllButtons(true);
    // Set display time based on the toast type
    let timeOut = ['warning', 'error'].includes(type) ? 3000 : 600;        // 1 second for warning, 0.6 seconds for other types
    let extendedTimeOut = ['warning', 'error'].includes(type) ? 3000 : 600;
    toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: true,
        progressBar: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        showDuration: 1000,
        hideDuration: 1000,
        timeOut: timeOut,
        extendedTimeOut: extendedTimeOut,
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut',
        onHidden: function () {
            if (redirect === 'self') {
                location.reload();
            } else if (redirect != null) {
                location.assign(redirect);
            }
            disableAllButtons(false);
            imgload.hide();
        }
    };
    toastr[type](message, title);

}



// input text copy for widget and module use

function copyInputText(event) {
    let copyText = $(event).siblings('.variable');
    navigator.clipboard.writeText(copyText.val());
    showToast('Copied the text: ' + copyText.val(), 'Copy to Clipboard', 'success');
}

const fieldName = (e) => {
    let variableName = $(e).val().replace(/\s+/g, '_').toLowerCase();
    let row = $(e).parents("#row");
    let selectedVal = row.find("select option:selected").val();
    let label = row.find(".variable");
    let inputField = row.find("input[name='fieldnamelbl[]']");
    if (variableName === '') {
        label.val('');
    } else {
        let formattedVar = '{' + '{$' + variableName + '}' + '}';
        let formattedVar1 = variableName;
        if (selectedVal !== 'image') {
            let widthHeightInputs = label.parent().parent().nextAll("div").filter(function () {
                return $(this).find("label").text().includes("Width") || $(this).find("label").text().includes("Height");
            });
            widthHeightInputs.remove();
        }
        if (selectedVal === 'image') {
            let result = checkWordBeforeUnderscore(variableName, 'input');
            if (!result) {
                formattedVar = '{' + '{$input_' + variableName + '}' + '}';
                formattedVar1 = 'input_' + variableName + '';
            }
        }

        // widthHeightInputs.remove();
        // if (selectedVal === 'image') {
        //     let result = checkWordBeforeUnderscore(variableName, 'input');
        //     if (!result) {
        //         formattedVar = '{' + '{$input_' + variableName + '}' + '}';
        //         formattedVar1 = 'input_' + variableName+'';
        //         let rowIndex = $(e).parents("#row").index();
        //         if ($(`input[name=field_width[${rowIndex}]]`).length === 0 || $(`input[name=field_height[${rowIndex}]]`).length === 0 || $(`input[name=field_width[${rowIndex}]]`).val() === '' || $(`input[name=field_height[${rowIndex}]]`).val() === '') {
        //             label.parent().after(`
        //             <div class="col-4">
        //                 <div class="mb-6 fv-row col-md-12">
        //                     <label class="form-label required" for="field_width[]"><g-t>Width</g-t></label>
        //                     <input type="number" name="field_width[${rowIndex}]" class="form-control mb-2 required" palceholder="100">
        //                 </div>
        //             </div>
        //             <div class="col-4">
        //                 <div class="mb-6 fv-row col-md-12">
        //                     <label class="form-label required" for="field_height[]"><g-t>Height</g-t></label>
        //                     <input type="number" name="field_height[${rowIndex}]" class="form-control mb-2 required" palceholder="100">
        //                 </div>
        //             </div>`);
        //         }
        //     }
        // }
        if (selectedVal == 'video') {
            let result = checkWordBeforeUnderscore(variableName, 'input');
            if (!result) {
                formattedVar = '{' + '{$input_' + variableName + '}' + '}';
                formattedVar1 = 'input_' + variableName + '';
            }
        }
        if (selectedVal === 'module') {
            let result = checkWordBeforeUnderscore(variableName, 'module');
            if (!result) {
                formattedVar = '{' + '!! $module_' + variableName + ' !!' + '}';
                formattedVar1 = 'module_' + variableName + '';
            }
        }
        if (selectedVal === 'modulemenu') {
            let result = checkWordBeforeUnderscore(variableName, 'modulemenu_');
            if (!result) {
                formattedVar = '{' + '!! $modulemenu_' + variableName + ' !!' + '}';
                formattedVar1 = 'modulemenu_' + variableName + '';
            }
        }
        label.val(formattedVar);
        inputField.val(formattedVar1);
    }
}

const fieldType = async (e) => {
    let row = $(e).parents("#row");
    let selectedVal = row.find("select option:selected").val();
    let variableName = row.find("input[name='field_name[]']").val().replace(/\s+/g, '_').toLowerCase();
    let label = row.find(".variable");
    let inputField = row.find("input[name='fieldnamelbl[]']");

    if (variableName === '') {
        label.val('');
        row.find("select option:selected").prop('selected', false);
        showToast('Please enter field name', 'Error', 'error');
    } else {
        let formattedVar = '{' + '{$' + variableName + '}' + '}';
        let formattedVar1 = variableName;
        if (selectedVal !== 'image') {
            let widthHeightInputs = label.parent().parent().nextAll("div").filter(function () {
                return $(this).find("label").text().includes("Width") || $(this).find("label").text().includes("Height");
            });
            widthHeightInputs.remove();
        }
        if (selectedVal == 'image') {
            let result = checkWordBeforeUnderscore(variableName, 'input');
            if (!result) {
                formattedVar = '{' + '{$input_' + variableName + '}' + '}';
                formattedVar1 = 'input_' + variableName + '';
                let rowIndex = $(e).parents("#row").index();
                label.parent().parent().after(`
              <div class="col-lg-4 col-md-12 col-sm-12">
                  <div class="mb-6 fv-row col-md-12">
                      <label class="form-label" for="field_width[]"><g-t>Width</g-t></label>
                      <input type="number" name="field_width[${rowIndex}]" class="form-control mb-2" min="0" palceholder="100">
                  </div>
              </div>
              <div class="col-lg-4 col-md-12 col-sm-12">
                  <div class="mb-6 fv-row col-md-12">
                      <label class="form-label" for="field_height[]"><g-t>Height</g-t></label>
                      <input type="number" name="field_height[${rowIndex}]" class="form-control mb-2" min="0" palceholder="100">
                  </div>
              </div>`);
            }
        }
        if (selectedVal == 'video') {
            let result = checkWordBeforeUnderscore(variableName, 'input');
            if (!result) {
                formattedVar = '{' + '{$input_' + variableName + '}' + '}';
                formattedVar1 = 'input_' + variableName + '';
            }
        }
        if (selectedVal === 'module') {
            let result = checkWordBeforeUnderscore(variableName, 'module');
            if (!result) {
                formattedVar = '{' + '!! $module_' + variableName + ' !!' + '}';
                formattedVar1 = 'module_' + variableName + '';
            }
        }
        if (selectedVal === 'modulemenu') {
            let result = checkWordBeforeUnderscore(variableName, 'modulemenu_');
            if (!result) {
                formattedVar = '{' + '!! $modulemenu_' + variableName + ' !!' + '}';
                formattedVar1 = 'modulemenu_' + variableName + '';
            }
        }
        label.val(formattedVar);
        inputField.val(formattedVar1);
    }
}
// <input type="url" class="form-control variable" name="api_url" placeholder="https://">
function moduleType(e) {
    let selectedValue = $(e).val();
    let row = $(e).parent().parent();
    if (selectedValue === 'api' && row.siblings().find("input[name='api_url']").length === 0) {
        if (BaseApi == '' || BaseApi == null) {
            showToast('Please add base url first', 'Error', 'error');
            return false;
        }
        row.after(`
            <div class="col-lg-8 col-md-12 col-sm-12">
            <label class="form-label required">Api Link</label>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon3">${BaseApi ?? 'https://example.com'}</span>
                <input type="text" class="form-control variable" name="api_url" id="basic-url" aria-describedby="basic-addon3">
                <button class="btn btn-outline-primary waves-effect cus-btn" type="button" onclick="getDummyProducts($(this).siblings('input[name=api_url]').val(),$(this).parent())">GET</button>
            </div>
        </div>`);
        $('.addfield_target').parent().addClass('d-none');
        $('.addfield_target').find('label').removeClass('required');
        $('.addfield_target').find('input').removeAttr('required');
        $('.addfield_target').find('select').removeAttr('required');
    } else if (selectedValue !== 'api' && row.siblings().find("input[name='api_url']").length > 0) {
        row.siblings().find(".variable-list").parent().remove();
        console.log("p",row.siblings().find("input[name='api_url']").parent().parent().remove());
        row.siblings().find("input[name='api_url']").parent().parent().remove();
        $('.addfield_target').parent().removeClass('d-none');
        $('.addfield_target').find('label').addClass('required');
        $('.addfield_target').find('input').addAttr('required');
        $('.addfield_target').find('select').addAttr('required');
    }

}

function getDummyProducts(url,label = false) {
    if (url == '') {
        showToast('Please enter url', 'Error', 'error');
        return ;
    }
    return $.ajax({
        url: BaseApi+url,
        type: 'GET',
        beforeSend: function (xhr) {
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            $("input[name='api_url']").val(url);
            if (response.data && response.data.length > 0) {
                let products = response.data;
                let keys = response.data.length > 0 ? Object.keys(response.data[0]) : [];
                let li = '';
                if (label.parent().siblings().find(".variable-list").length > 0) {
                    label.parent().siblings().find(".variable-list").parent().remove();
                }
                for (let i = 0; i < keys.length; i++) {
                    li += '<div class="col-3 mb-3"><div class="list-group-item copy-variable">${item.' + keys[i] + '}</div></div>';
                }
                label.parent().after(`
                <div class="col-lg-10 col-md-12 col-sm-12 my-5 card p-3">
                    <div class="list-group variable-list">
                        <h4 class="mb-3">Variables</h4>
                        <div class="row">
                            ${li}
                        </div>
                    </div>
                </div>`);
                return products;
            } else {
                showToast('No Data available', 'Error', 'error');
                return [];
            }
        },
        error: function (xhr, status, err) {
            imgload.hide();
            let errorMessage = '';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            } else if (xhr.statusText) {
                errorMessage = xhr.statusText;
            } else {
                errorMessage = err;
            }
            showToast(errorMessage, 'error', 'error');
        }
    });
}

function checkWordBeforeUnderscore(inputString, word) {
    let underscoreIndex = inputString.indexOf('_');
    if (underscoreIndex !== -1) {
        let partBeforeUnderscore = inputString.substring(0, underscoreIndex);
        return partBeforeUnderscore === word;
    }
    return false;
}


function makeSlug(current,slug) {
    let field = $(current).val();
    field = field.toLowerCase().trim();
    // remove accents, swap ? with a, etc.
    const map = {
        '-': ' ', ' ': '-',
        'a': 'a,?', 'c': 'c,?', 'e': 'e,?', 'i': 'i,?', 'o': 'o,?', 'u': 'u,?','n': 'n,?','s': 's,?','z': 'z,?','y': 'y,?'
    };
    for (let pattern in map) {
        field = field.replace(new RegExp(pattern, 'g'), map[pattern]);
    }
    field = field.replace(/&/g, '-and-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
    $(`input[name=${slug}]`).val('insta-manage-'+field);

}

function generateSlug(sourceField, targetField) {
    // Select source and target fields using the `name` attribute
    const sourceElement = document.querySelector(`[name="${sourceField}"]`);
    const targetElement = document.querySelector(`[name="${targetField}"]`);

    // Ensure both fields exist
    if (sourceElement && targetElement) {
        let timeoutId = null;

        // Add an input event listener to the source field
        sourceElement.addEventListener("input", (e) => {
            e.preventDefault();

            // Clear any existing timeout
            clearTimeout(timeoutId);

            // Set a debounce timeout
            timeoutId = setTimeout(() => {
                // Get the source field value
                const sourceValue = sourceElement.value;

                // Generate the slug
                const slug = sourceValue
                    .toLowerCase() // Convert to lowercase
                    .trim() // Remove whitespace from start and end
                    .replace(/[\s_]+/g, "-") // Replace spaces or underscores with dashes
                    .replace(/[^a-z0-9\-]/g, ""); // Remove non-alphanumeric characters except dashes

                // Set the slug to the target field
                targetElement.value = slug;
            }, 300); // Debounce delay (300ms)
        });
    } else {
        console.error("Source or target field not found!");
    }
}


function enableProductDesign(currentElement, shortcodeAddFieldElement) {
    if ($(currentElement).is(':checked') == true) {
        $.ajax({
            url: ApiCms+'/theme/productdesign/show/',
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                xhr.setRequestHeader("menu-uuid", menu_id);
                xhr.setRequestHeader("theme-id", theme_id);
                imgload.show();
            }, 
            success: function(response) {
                imgload.hide();
                console.log('Data received:', response);
                setEditorValue(response.data);
                // $(shortcodeAddFieldElement).html(response.data);

                // Process the response data here
            },
            error: function(xhr, status, error) {
                imgload.hide();
                $(currentElement).prop('checked', false)
                showToast(xhr.responseJSON.message, 'Error', 'error');
            }
        });
    }
}

function enableProductTemplateDesign(currentElement, shortcodeAddFieldElement) {
    if ($(currentElement).is(':checked') == true) {
        $.ajax({
            url: ApiCms+'/theme/page-template/show/',
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                xhr.setRequestHeader("menu-uuid", menu_id);
                xhr.setRequestHeader("theme-id", theme_id);
                imgload.show();
            }, 
            success: function(response) {
                imgload.hide();
                console.log('Data received:', response);
                setEditorValue(response.data);
                // $(shortcodeAddFieldElement).html(response.data);

                // Process the response data here
            },
            error: function(xhr, status, error) {
                imgload.hide();
                $(currentElement).prop('checked', false)
                showToast(xhr.responseJSON.message, 'Error', 'error');
            }
        });
    }
}
function handlePageTypeChange(selectElement) {
    const selectedValue = selectElement.value;
    
    if (selectedValue) {
        $.ajax({
            url: ApiCms+'/theme/page-template/show/',
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            data: {
                page_type: selectedValue // Pass the selected page type to the API
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                xhr.setRequestHeader("menu-uuid", menu_id);
                xhr.setRequestHeader("theme-id", theme_id);
                imgload.show();
            }, 
            success: function(response) {
                imgload.hide();
                console.log('Data received:', response);
                setEditorValue(response.data);
                // $('#content').html(response.data); // Uncomment if needed
            },
            error: function(xhr, status, error) {
                imgload.hide();
                // selectElement.value = ""; // Reset selection on error
                // showToast(xhr.responseJSON.message, 'Error', 'error');
            }
        });
    }
}

const formatDate = (dateString) => {
    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

const formattedDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}; 


const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};
function formatedDate(dateString) {
    // Parse the date
    const date = new Date(dateString); 
    // Format the date to "Month Day, Year at HH:MM am/pm"
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        // hour: '2-digit',
        // minute: '2-digit',
        // hour12: true
    };
    const formattedDate = date.toLocaleString('en-US', options);
    // Adjust the format to match "May 6, 2025 at 9:01 am from Draft Orders"
    return `${formattedDate}`;
}



function validateHiddenRequiredFields(formSelector) {
    let isValid = true;

    // Only check fields inside the specified form
    $(formSelector).find('.validate-hidden-required').each(function () {
        
        if (!$(this).val()) {
            isValid = false;

            // Optional: Highlight the error visually
            $(this).closest(".form-group").addClass("has-error");

            const fieldName = $(this).attr("name") || "Unknown field";
            showToast('Please select a file for: ' + fieldName.replace(/_/g, ' '), 'Error', 'error');

            // Optional: Focus the field
            $(this).trigger('focus');
        } else {
            $(this).closest(".form-group").removeClass("has-error");
        }
    });

    return isValid;
}


window.onload = function () {
    const target = document.querySelector(".sortable_element");
    if (target) {
        Sortable.create(target, {
            animation: 150,
            handle: ".drag-handle",
            draggable: ".row",
        });
    }
};