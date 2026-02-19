let editorInstance;
let WidgetshortKey = '';
let themeData = {};
function CKeditor() {
    if (editorInstance) {
        editorInstance.destroy()
            .then(() => {
                initializeEditor();
            })
            .catch(error => {
                console.error("Error destroying the editor instance:", error);
            });
    } else {
        initializeEditor();
    }
}

function parseEditorSegments(content) {
    const segments = [];
    const shortcodeRegex = /(?:<shortcode>)?\[([A-Za-z_-]+)(.*?)\]\[\/\1\](?:<\/shortcode>)?/gs;
    let lastIndex = 0, match;
    while ((match = shortcodeRegex.exec(content)) !== null) {
        if (match.index > lastIndex) segments.push({ type: 'text', value: content.slice(lastIndex, match.index) });
        segments.push({ type: 'shortcode', value: match[0] });
        lastIndex = shortcodeRegex.lastIndex;
    }
    if (lastIndex < content.length) segments.push({ type: 'text', value: content.slice(lastIndex) });
    return segments;
}

function replaceShortcodeAtGlobalIndex(content, globalIndex, newShortcode) {
    const segments = parseEditorSegments(content);
    let count = 0;
    for (let i = 0; i < segments.length; i++) {
        if (segments[i].type === 'shortcode') {
            if (count === globalIndex) { segments[i].value = newShortcode; break; }
            count++;
        }
    }
    return segments.map(s => s.value).join('');
}

function removeShortcodeAtGlobalIndex(content, globalIndex) {
    const segments = parseEditorSegments(content);
    let count = 0;
    for (let i = 0; i < segments.length; i++) {
        if (segments[i].type === 'shortcode') {
            if (count === globalIndex) { segments[i].value = ''; break; }
            count++;
        }
    }
    return segments.map(s => s.value).join('');
}

function loadPreviewContent(htmlContent) {
    const iframe = document.getElementById('previewIframe');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    const cssSource = (themeData.css_link_rtl)
        ? themeData.css_link_rtl
        : themeData.css_link;

    const cssLinks = cssSource
        ? cssSource.split(',').filter(Boolean).map(href =>
            `<link rel="stylesheet" href="${href.trim()}">`
          ).join('\n')
        : '';

    const headJsLinks = themeData.js_head_link
        ? themeData.js_head_link.split(',').filter(Boolean).map(src =>
            `<script src="${src.trim()}"></script>`
          ).join('\n')
        : '';

    const jsSource = (themeData.js_link_rtl)
        ? themeData.js_link_rtl
        : themeData.js_link;

    const bodyJsLinks = jsSource
        ? jsSource.split(',').filter(Boolean).map(src =>
            `<script src="${src.trim()}"></script>`
          ).join('\n')
        : '';

    iframeDoc.open();
    iframeDoc.write(`
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${cssLinks}
                ${headJsLinks}
                <style>
                    body { margin: 0; padding: 15px; }
                    a { pointer-events: none !important; }
                </style>
            </head>
            <body>
                ${htmlContent}
                ${bodyJsLinks}
                <script>
                    document.addEventListener('click', function (event) {
                        const anchor = event.target.closest('a');
                        if (anchor) {
                            event.preventDefault();
                            event.stopPropagation();
                            return false;
                        }
                    }, true);

                    window.editWidget = function(shortkey, shortcodeRaw, globalIndex) {
                        window.parent.editWidget(shortkey, shortcodeRaw, globalIndex);
                    };

                    window.removeWidget = function(index) {
                        window.parent.removeWidget(index);
                    };
                    window._widgetShortcodes = window.parent._widgetShortcodes;
                </script>
            </body>
        </html>
    `);
    iframeDoc.close();
}


function initializeEditor() {
    ClassicEditor
        .create(document.querySelector('#editorCk'), {
            entities: false,  
            toolbar: [
                'heading',
                '|',
                'fontColor',
                'fontSize',
                'fontBackgroundColor',
                'fontFamily',
                'bold',
                'italic',
                'underline',
                'link',
                'strikethrough',
                'bulletedList',
                'numberedList',
                '|',
                'alignment',
                'direction',
                'outdent',
                'indent',
                '|',
                'htmlEmbed',
                'imageInsert',
                'ckfinder',
                'blockQuote',
                'insertTable',
                'mediaEmbed',
                'undo',
                'redo',
                'findAndReplace',
                'removeFormat',
                'sourceEditing',
                'codeBlock',
                'fullScreen'
            ],
        }).then(editor => {
            editorInstance = editor;

            function setEditorHeight() {
                editor.ui.view.editable.element.style.height = "300px"; 
            }

            setEditorHeight();

            editor.model.document.on('change:data', setEditorHeight);

            editor.ui.view.editable.element.addEventListener("focus", setEditorHeight);
            $(".use-button").click(async function () {
                let shortCodeKey = $(this).attr("data-shortcode");
                try {
                    $(".shortcodeAttr-item").html('');
                    let attr = await showwidgets(shortCodeKey);
                    let widgetHtml = attr.data.data.html_code;
                    themeData = attr.data.data.theme;
                    let attrHtml = attr.html;
                    attr = attr.data;
                    let attrCount = Object.keys(attr.data.widget_fields).length;
                    let widgetAttr = attr.widget_fields;
                    if (attrCount > 0) {
                        $("#shortcodeAttr").modal('show');
                        $(".shortcodeAttr-item").html(attrHtml);
                        $('#shortcodeForm').off('submit').on('submit',async function (event) {
                            event.preventDefault();
                            const formData = $(this).serializeArray();
                            if (!validateHiddenRequiredFields("#shortcodeForm")) {
                                return; // Stop if validation fails
                            }
                            let attributes = '';

                            for (const formDa of formData) {
                                attributes += `${formDa.name}="${formDa.value}" `;
                            }
                            const shortcode = `<shortcode>[${attr.data.shortkey} ${attributes.trim()}][/${attr.data.shortkey}]</shortcode>`;

                            editor.model.change(writer => {
                                const insertPosition = editor.model.document.selection.getFirstPosition();
                                editor.setData(editor.getData() + shortcode);
                            });
                            await renderAllWidgetsInIframe(editor.getData());

                            $("#shortcodeAttr").modal('hide');
                        });
                    } else {
                        const shortcode = '<shortcode>[' + shortCodeKey + ']' + '[/' + shortCodeKey + ']</shortcode>';
                        editor.model.change(writer => {
                            const insertPosition = editor.model.document.selection.getFirstPosition();
                            editor.setData(editor.getData() + shortcode);
                        })
                        await renderAllWidgetsInIframe(editor.getData());
                    }
                    $("#shortcodeModal").modal('hide');
                } catch (error) {
                    console.error('Error fetching widget:', error);
                }
            });

            $(".use-button-form").click(async function () {
                let shortCodeKey = $(this).attr("data-shortcode");
                try {
                    $(".shortcodeAttr-item").html('');
                    const shortcode = '<shortcode>[' + shortCodeKey + ']' + '[/' + shortCodeKey + ']</shortcode>';
                    editor.model.change(writer => {
                        const insertPosition = editor.model.document.selection.getFirstPosition();
                        editor.setData(editor.getData() + shortcode);
                    })
                    $("#shortcodeModal").modal('hide');
                } catch (error) {
                    console.error('Error fetching widget:', error);
                }
            });
        }).catch(error => {
            console.error('There was a problem initializing the editor.', error);
        });
}

function setEditorValue(content) {
    if (editorInstance) {
        const decodedContent = decodeHtmlEntities(content);  // Decode any entities before setting
        editorInstance.setData(decodedContent);
    } else {
        console.error('Editor not initialized');
    }
}

function getEditorValue() {
    const editorContent = editorInstance.getData();
    // console.log(editorContent);
    return decodeHtmlEntities(editorContent);  // Decode the content before returning it
}

// Decoding HTML entities (i.e., converting `&amp;` back to `&`)
function decodeHtmlEntities(str) {
    var txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
}

$(document).on('ckeditor-bb-shortcode-edit', async (e) => {
    const { shortcode, name } = e.detail;
    // console.log("Original shortcode:", shortcode);
    // console.log("Shortcode name:", name);
    $(".shortcodeAttr-item").html('');
    let attr = await showwidgets(name);
    let attrHtml = attr.html;
    let menuList = attr.menuList;
    if (Object.keys(attr.data).length > 0) {
        $("#shortcodeAttr").modal('show');
        $(".shortcodeAttr-item").html(attrHtml);
        await new Promise((resolve) => setTimeout(resolve, 0));
        for (const menu of menuList) {
            await menuListshort(menu);
        }
        const attributes = {};
        shortcode.replace(/(\w+)="([^"]*)"/g, (match, key, value) => {
            attributes[key] = value;
            if (key.startsWith('modulemenu_')) {
                let selectLenght = $('.shortcodeAttr-item').find('select');
                for (const selectElement of selectLenght) {
                    const name = $(selectElement).attr('name');
                    if (attributes[name]) {
                        $(selectElement).val(attributes[name]).trigger('change');
                    }
                }
            }
        });
        $.each(attributes, function (key, valueObj) {
            $("#" + key).val(valueObj);
        })
        $('#shortcodeForm').off('submit').on('submit', async function (event) {
            event.preventDefault();
            const formData = $(this).serializeArray();
            if (!validateHiddenRequiredFields("#shortcodeForm")) {
                return; // Stop if validation fails
            }
            let updatedAttributes = '';
            for (const formDa of formData) {
                updatedAttributes += `${formDa.name}="${formDa.value}" `;
            }
        
            // Get the shortcode name and create updated shortcode
            const shortcodeName = shortcode.match(/\[([-\w]+)/)[1];
            //const updatedShortcode = `[${shortcodeName} ${updatedAttributes.trim()}][/${shortcodeName}]`;
            const updatedShortcode = `<shortcode>[${shortcodeName} ${updatedAttributes.trim()}][/${shortcodeName}]</shortcode>`;
        
            try {
                // Get current editor content
                let editorContent = editorInstance.getData();
                // console.log('Original editor content:', editorContent);
        
                // Create a regular expression to match the current shortcode
                //const shortcodeRegex = new RegExp(`\\[${shortcodeName}.*?\\]\\[\\/${shortcodeName}\\]`, 'gs');
        
                // Replace the existing shortcode with the updated one
                //const updatedContent = editorContent.replace(shortcodeRegex, updatedShortcode);

                const { globalIndex } = e.detail;
                const updatedContent = replaceShortcodeAtGlobalIndex(editorContent, globalIndex, updatedShortcode); // hits ONLY this one
        
                // console.log('Updated shortcode:', updatedShortcode);
                // console.log('Final updated content:', updatedContent);
        
                // Update the editor with the new content
                editorInstance.setData(updatedContent);
                await renderAllWidgetsInIframe(updatedContent);

                $("#shortcodeAttr").modal('hide');
            } catch (error) {
                console.error('Error updating shortcode:', error);
            }
        });
        
    } else {
        const editorContent = editorInstance.getData();
        editorInstance.setData(editorContent + `[${shortcode.match(/\[([-\w]+)/)[1]}]`);
    }
    filemanagerImagepreview();
});

$(document).ready(function () {
    CKeditor();
});

$(document).on("click", "#widgets", function (e) {
    e.preventDefault();
    getWidgets();
});
$(document).on("click", "#dynamicforms", function (e) {
    e.preventDefault();
    getForms();
});

function getWidgets() {
    $(".shortcode-item").empty();
    $.ajax({
        type: "GET",
        url: ApiCms + "/page/all-widgets",
        contentType: "application/json",
        "headers": {
            "Accept": "application/json"
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (data) {
            imgload.hide();
            if (data.status_code == 200) {
                $.each(data.data, function (key, value) {
                    let widgetName = value.name.replace(new RegExp('_', 'g'), ' ')
                    let widgetImage = value.widget_image
                    WidgetshortKey = value.shortkey
                    //$("#previewHtml").attr('data-shortcode', WidgetshortKey)
                    $(".shortcode-item").append(
                        `<div class="col-xl-3 col-lg-4 col-sm-6 mb-3">
                        <div class="card">
                            <div class="card-img">
                                <img src="${widgetImage ? AssetsPath + widgetImage : './assets/images/widget.png'}" class="card-img-top" alt="...">
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <h5 class="col-7 card-title">${widgetName}</h5>
                                    <div class="col-3 text-end">
                                        <button class="text-end btn btn-primary use-button" type="button" data-bb-toggle="shortcode-button-use" data-shortcode="${value.shortkey}">Use</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> `
                    )
                });
                $("#shortcodeModal").modal('show')
            }
            CKeditor();
        },
        error: function (xhr, status, err) {
            imgload.hide();
            Swal.fire({
                title: err,
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
    })
}
function getForms() {
    $(".shortcode-item").empty();
    $.ajax({
        type: "GET",
        url: ApiCms + "/page/get-forms-by-theme",
        contentType: "application/json",
        "headers": {
            "Accept": "application/json"
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (data) {
            imgload.hide();
            if (data.status_code == 200) {
                $.each(data.data, function (key, value) {
                    let widgetName = value.form_name.replace(new RegExp('_', 'g'), ' ')
                    $(".shortcode-item").append(
                        `<div class="col-xl-3 col-lg-4 col-sm-6 mb-3">
                        <div class="card">
                            <div class="card-img">
                                <img src="./assets/images/form.jpg" class="card-img-top" alt="...">
                            </div>
                            <div class="card-body">
                                <div class="row">
                                <h5 class="col-7 card-title">${widgetName}</h5>
                                <div class="col-3 text-end">
                                    <button class="text-end btn btn-primary use-button-form" type="button" data-bb-toggle="shortcode-button-use" data-shortcode="${value.short_code}">Use</button>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div> `
                    )
                });
                $("#shortcodeModal").modal('show');
            }else if(data.status_code == 404){
                $(".shortcode-item").append(
                    `<div class="col-xl-3 col-lg-4 col-sm-6 mb-3">
                        <h5 class="text-center">Not Found</h5>
                    </div> `
                )
                $(".shortcode-item").addClass("justify-content-center");
                $("#shortcodeModal").modal('show');
            }
            CKeditor();
        },
        error: function (xhr, status, err) {
            imgload.hide();
            Swal.fire({
                title: err,
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
    })
}

function showwidgets(id) {
    let pageTypeVal = $("#page_type").val();
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: ApiCms + "/page/widget-show-page/"+id,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + strkey);
                xhr.setRequestHeader("menu-uuid", menu_id);
                xhr.setRequestHeader("page-type", pageTypeVal);
                imgload.show();
            },
            success: async function (data) {
                imgload.hide();
                let attrHtml = await generateFormFields(data.data.widget_fields);
                let html = attrHtml.html;
                let menuList = attrHtml.menuInputs;
                return resolve({data,html,menuList});
            },

            error: function (error) {
                imgload.hide();
                reject(error);
            }
        });
    });
}


async function renderAllWidgetsInIframe(content) {
    // Match shortcodes both with and without <shortcode> wrapper
    const shortcodeRegex = /(?:<shortcode>)?\[([A-Za-z_-]+)(.*?)\]\[\/\1\](?:<\/shortcode>)?/gs;
    let match;
    let combinedHtml = '';
    window._widgetShortcodes = {};
    let globalIndex = 0; // position across ALL shortcodes in the editor

    while ((match = shortcodeRegex.exec(content)) !== null) {
        const shortkey = match[1];
        const fullMatch = match[0];
        const currentIndex = globalIndex; // capture for closure
        globalIndex++;

        try {
            let attr = await showwidgets(shortkey);
            let widgetHtml = attr.data.data.html_code;

            const attributes = {};
            match[2].replace(/(\w+)="([^"]*)"/g, (m, key, value) => {
                attributes[key] = value;
            });

            widgetHtml = widgetHtml.replace(/{{\s*\$?(\w+)\s*}}/g, (m, key) => {
                if (attributes[key] !== undefined) {
                    let value = attributes[key];
                    const field = attr.data.data.widget_fields.find(f => f.field_id === key);
                    if (field && field.field_type === 'image' && value) {
                        return AssetsPath + '/' + value.replace(/^\/+/, '');
                    }
                    return value;
                }
                return '';
            });

            themeData = attr.data.data.theme;

            // Store by globalIndex so edit/remove can find the exact instance
            window._widgetShortcodes[currentIndex] = {
                shortkey,
                shortcodeRaw: fullMatch,
                globalIndex: currentIndex
            };

            combinedHtml += `
                <div class="widget-drag-item" data-index="${currentIndex}" style="position:relative; margin-bottom:10px; border:2px dashed transparent;">
                    <div style="display:flex;gap:5px;float:right;align-items:center;">
                        <span class="drag-handle" style="cursor:grab;padding:4px 8px;background:#6c757d;color:#fff;border-radius:4px;font-size:14px;" title="Drag to reorder">&#9776;</span>
                        <button onclick="editWidget(_widgetShortcodes[${currentIndex}].shortkey, _widgetShortcodes[${currentIndex}].shortcodeRaw, ${currentIndex})"
                                style="background:#007bff;color:#fff;border:none;padding:4px 10px;cursor:pointer;border-radius:4px;">
                            Edit
                        </button>
                        <button onclick="removeWidget(${currentIndex})"
                                style="background:#dc3545;color:#fff;border:none;padding:4px 10px;cursor:pointer;border-radius:4px;">
                            Remove
                        </button>
                    </div>
                    ${widgetHtml}
                </div>`;
        } catch (e) {
            console.error('Error loading widget', shortkey, e);
        }
    }

    loadPreviewContent(combinedHtml);

    initSortableInIframe();
}

function initSortableInIframe() {
    const iframe = document.getElementById('previewIframe');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const container = iframeDoc.body;

    if (!container) return;

    // Remove existing Sortable script if present to avoid duplicates
    const existingScript = iframeDoc.getElementById('sortable-script');
    if (existingScript) existingScript.remove();

    const script = iframeDoc.createElement('script');
    script.id = 'sortable-script';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.2/Sortable.min.js';
    script.onload = function () {
        // Destroy existing Sortable instance if any
        if (container._sortable) {
            container._sortable.destroy();
        }

        const iframeSortable = iframeDoc.defaultView.Sortable;
        container._sortable = iframeSortable.create(container, {
            animation: 150,
            handle: '.drag-handle',
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            onEnd: function (evt) {
                // Get new order of widget indices from the DOM AFTER drag
                const items = iframeDoc.querySelectorAll('.widget-drag-item');
                const newOrder = Array.from(items).map(el => parseInt(el.getAttribute('data-index')));

                // Rebuild editor content in new visual order
                rebuildEditorContentByOrder(newOrder);
            }
        });

        // Add ghost styles inside iframe
        if (!iframeDoc.getElementById('sortable-style')) {
            const style = iframeDoc.createElement('style');
            style.id = 'sortable-style';
            style.textContent = `
                .sortable-ghost { opacity: 0.4; border: 2px dashed #007bff !important; }
                .sortable-chosen { border: 2px dashed #28a745 !important; }
                .drag-handle:active { cursor: grabbing; }
            `;
            iframeDoc.head.appendChild(style);
        }
    };
    iframeDoc.head.appendChild(script);
}

function rebuildEditorContentByOrder(newOrder) {
    const content = editorInstance.getData();

    // Extract ALL shortcodes in original order (with their surrounding text positions)
    const shortcodeRegex = /(?:<shortcode>)?\[([A-Za-z_-]+)(.*?)\]\[\/\1\](?:<\/shortcode>)?/gs;
    const allShortcodes = [];
    let match;

    while ((match = shortcodeRegex.exec(content)) !== null) {
        allShortcodes.push(match[0]);
    }

    if (allShortcodes.length === 0) return;

    // newOrder contains data-index values (original indices) in their new visual order
    // Reorder shortcodes based on drag result
    const reordered = newOrder.map(idx => allShortcodes[idx]).filter(Boolean);

    // Strip ALL shortcodes from content, keep plain HTML/text
    let plainContent = content
        .replace(/(?:<shortcode>)?\[([A-Za-z_-]+)(.*?)\]\[\/\1\](?:<\/shortcode>)?/gs, '')
        .trim();

    // Rebuild: plain content first, then reordered shortcodes
    const newContent = plainContent + reordered.join('');

    // Set new content in editor
    editorInstance.setData(newContent);

    // Re-render iframe with new content and NEW indices (0,1,2... in new order)
    renderAllWidgetsInIframe(newContent);
}


function editWidget(shortkey, shortcodeRaw, globalIndex) {
    $(document).trigger({ type: 'ckeditor-bb-shortcode-edit', detail: { shortcode: shortcodeRaw, name: shortkey, globalIndex: globalIndex } });
}
function removeWidget(globalIndex) {
    const widgetData = window._widgetShortcodes[globalIndex];
    
    if (!widgetData) {
        console.error('No widget data found for index:', globalIndex);
        return;
    }

    const { shortcodeRaw } = widgetData;

    try {
        let editorContent = editorInstance.getData();

        // The shortcode in editor is wrapped in <shortcode> tags
        // Try removing with wrapper first
        //const escapedShortcode = shortcodeRaw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Try both with and without <shortcode> wrapper
        //let updatedContent = editorContent
            //.replace(new RegExp(`<shortcode>\\s*${escapedShortcode}\\s*<\\/shortcode>`, 'gs'), '')
           // .replace(new RegExp(escapedShortcode, 'gs'), '');
        const updatedContent = removeShortcodeAtGlobalIndex(editorContent, globalIndex); // hits ONLY this one


        editorInstance.setData(updatedContent);

        // Re-render preview
        renderAllWidgetsInIframe(updatedContent);

    } catch (error) {
        console.error("Error removing widget:", error);
    }
}

function uploadImage(event) {
    let file = event.target.files[0];
    // Create a FormData object
    let formData = new FormData();
    formData.append('image', file);
    formData.append('_token', '{{ csrf_token() }}');

    // Send the form data using AJAX
    $.ajax({
        type: "POST",
        url: ApiCms + "/page/upload/image",
        data: formData,
        processData: false,  // Prevent jQuery from automatically transforming the data into a query string
        contentType: false,  // Prevent jQuery from setting the Content-Type request header
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        },
        success: function (data) {
            imgload.hide();
            let fieldName = event.srcElement.name;            
            $(`input[name='input_${fieldName}']`).val(data.location);  // Clear the file input
        },
        error: function (xhr, status, error) {
            console.error("Error uploading image:", error);
        }
    });
}

async function generateFormFields(fields) {
    let html = '';
    let height = '';
    let width = '';
    let label = '';
    let menuInputs = [];

    for (const value of fields) {
        if (value.field_type == 'image' && value.field_options !== null && value.field_options !== "") {
            let image = JSON.parse(value.field_options);
            height = image.height === null ? 0 : image.height;
            width = image.width === null ? 0 : image.width;
            label = `<label for="${value.field_id}" class="form-label">${value.field_name} ${(height > 0 && width > 0) ? '('+height +'x'+ (width)+')' : ''} ${value.is_required === 1 ? '*' : ''}</label>`;
        }else{
            label = `<label for="${value.field_id}" class="form-label">${value.field_name} ${value.is_required === 1 ? '*' : ''}</label>`;
        }
        html += `<form action="" method="post" id="shortcodeForm"><div class="col-12 mb-3">`;
        html += label;
        switch (value.field_type) {
            case 'text':
                html += `<input type="text" ${value.is_required === 1 ? 'required' : ''} name="${value.field_id}" class="form-control" id="${value.field_id}">`;
                break;
            case 'module':
                html += `<input type="text" ${value.is_required === 1 ? 'required' : ''} name="${value.field_id}" value="${value.field_id}" readonly class="form-control" id="${value.field_id}">`;
                break;
            case 'image':
                html += `<div class="mb-6 fv-row col-md-12">`;
                html += `<div class="form-group">`;
                html += `<div class="input-group custome-filemanager" onclick="customFilemanager(this)" data-type="image" data-width="${width}" data-height="${height}">`;
                html += `<div class="input-group-prepend">`;
                html += `<div class="input-group-text bg-soft-secondary font-weight-medium"> Browse </div>`;
                html += `</div>`;
                html += `<div class="form-control file-amount">Choose File</div>`;
                html += `<input type="hidden" name="${value.field_id}" id="${value.field_id}" class="selected-files ${value.is_required === 1 ? 'validate-hidden-required' : ''}">`;
                html += `</div>`;
                html += `<div class="row mx-1 filemanager-image-preview"></div>`;
                html += `</div>`;
                html += `</div>`;
                break;
            case 'video':
                html += `<div class="mb-6 fv-row col-md-12">`;
                html += `<div class="form-group">`;
                html += `<div class="input-group custome-filemanager" onclick="customFilemanager(this)" data-type="video">`;
                html += `<div class="input-group-prepend">`;
                html += `<div class="input-group-text bg-soft-secondary font-weight-medium"> Browse </div>`;
                html += `</div>`;
                html += `<div class="form-control file-amount">Choose File</div>`;
                html += `<input type="hidden" name="${value.field_id}" id="${value.field_id}" class="selected-files ${value.is_required === 1 ? 'validate-hidden-required' : ''}">`;
                html += `</div>`;
                html += `<div class="row mx-1 filemanager-image-preview"></div>`;
                html += `</div>`;
                html += `</div>`;
                break;
            case 'textarea':
                html += `<textarea name="${value.field_id}" class="form-control" id="${value.field_id}"></textarea>`;
                break;
            case 'modulemenu':
                menuInputs.push(value.field_id);
                html += `<div class="col-4">
                <div class="mb-6 fv-row col-md-12">     
                    <label class="form-label " for="widget_type">Menu ${value.is_required === 1 ? '*' : ''}</label>
                    <select name="${value.field_id}" ${value.is_required === 1 ? 'required' : ''} class="form-select select2" id="">
                        <option value="">Select Menu</option>
                    </select>
                    </div>
                </div>`;
                break;
            default:
                console.error('Unknown field type:', value.field_type);
                break;
        }
        
        html += `</div>`;
    }

    // Adding a submit button at the end
    html += `<div class="col-12">`;
    html += `<button type="submit" class="mt-2 btn btn-primary">Submit</button>`;
    html += `</div></form>`;
    return {html,menuInputs};
}


async function menuListshort(menuInput) {
    return $.ajax({
        url: ApiForm + '/get_othermenu',
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
            if (response.status_code == 200) {
                var options = '<option value="">Select Menu</option>';
                for (const value of response.data) {
                    options += `<option value="${value.uuid}">${value.name}</option>`;
                }
                $('select[name="' + menuInput + '"]').html(options);
            }
        }
    });
}
