document.title="Dashboard | Edit Theme";
var urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get('id');
if (id) {
    $.ajax({
        url: ApiCms + "/theme/edit/" + id,
        type: "GET",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        }, 
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                let data = response.data;
                $("input[name=name]").val(data.name); 
                $("input[name=version]").val(data.version);
                $("textarea[name=short_description]").val(data.short_description);
                $("input[name=short_description]").val(data.short_description);
                $("input[name=theme_logo]").val(data.theme_logo);
                $("input[name=fav_icon]").val(data.fav_icon);
                $("input[name=thumbnail_img]").val(data.thumbnail_img);
                $("input[name=css_file]").val(response["data"]['css_file']);
                $("input[name=js_file]").val(response["data"]['js_file']); 
                // $("input[name=theme_logo]").attr('data-oname',"file"); 
                // Set thumbnail_img and append image preview
                $("input[name=thumbnail_img]").val(data.thumbnail_img);
                if (data.theme_type == 1) {
                    $("input[name=theme_type][value=1]").prop('checked', true);
                } else {
                    $("input[name=theme_type][value=0]").prop('checked', true);
                }
                // Handle multiple CSS files
                // let cssFiles = response["data"]['css_file'];
                // if (cssFiles) {
                //     // $("input[name=css_file]").val(cssFiles);  // Set the hidden input value
                //     let cssFileArray = cssFiles.split(',');   // Split files if multiple
                //     let cssFilePreviewHtml = '';              // Prepare HTML for CSS files
                //     for(const cssFile of cssFileArray) {
                //         let cssFileName = cssFile.split('/').pop(); // Extract the file name 
                //     }
                // }
                // Handle multiple JS files
                // let jsFiles = response["data"]['js_file'];
                // if (jsFiles) {
                //     $("input[name=js_file]").val(jsFiles);  // Set the hidden input value
                //     let jsFileArray = jsFiles.split(',');   // Split files if multiple
                //     let jsFilePreviewHtml = '';             // Prepare HTML for JS files
                //     jsFileArray.forEach(jsFile => {
                //         let jsFileName = jsFile.split('/').pop(); // Extract the file name 
                //     });
                    
                // }
                if (response['data']['css_link'] !== null) {
                    let csslink = response['data']['css_link'];
                    if (csslink !== null && csslink !== undefined && csslink.trim() !== '') {
                        let csslinks = csslink.split(',');
                        if (csslinks.length > 0) {
                            let cssLinkHtml = $(".cssfilelink_target").html();
                            $(".cssfilelink_target").html('');
                            csslinks.forEach(csslink => {
                                $(".cssfilelink_target").append(cssLinkHtml);
                                const $lastLi = $(".cssfilelink_target li").last();
                                $(".cssfilelink_target").find('input[name="css_link[]"]:last').val(csslink.trim());
                                $lastLi.attr('title', csslink.trim());
                            });
                        }

                    }
                }
                if (response['data']['css_link_rtl'] !== null) {
                    let csslink = response['data']['css_link_rtl'];
                    if (csslink !== null && csslink !== undefined && csslink.trim() !== '') {
                        let csslinks = csslink.split(',');
                        if (csslinks.length > 0) {
                            let cssLinkHtml = $(".cssfilelinkRTL_target").html();
                            $(".cssfilelinkRTL_target").html('');
                            csslinks.forEach(csslink => {
                                $(".cssfilelinkRTL_target").append(cssLinkHtml);
                                const $lastLi = $(".cssfilelinkRTL_target li").last();
                                $(".cssfilelinkRTL_target").find('input[name="css_link_rtl[]"]:last').val(csslink.trim());
                                $lastLi.attr('title', csslink.trim());
                            });
                        }

                    }
                }
                if (response['data']['js_link_rtl'] !== null) {
                    let jslink = response['data']['js_link_rtl'];
                    if (jslink !== null && jslink !== undefined && jslink.trim() !== '') {
                        let jslinks = jslink.split(',');
                        if (jslinks.length > 0) {
                            let jsLinkHtml = $(".jsfilelinkRTL_target").html();
                            $(".jsfilelinkRTL_target").html('');
                            jslinks.forEach(jslink => {
                                $(".jsfilelinkRTL_target").append(jsLinkHtml);
                                const $lastLi = $(".jsfilelinkRTL_target li").last();
                                $(".jsfilelinkRTL_target").find('input[name="js_link_rtl[]"]:last').val(jslink.trim());
                                $lastLi.attr('title', jslink.trim());
                            });
                        }

                    }
                }
                if (response['data']['js_link'] !== null) {
                    let jslink = response['data']['js_link'];

                    if (jslink !== null && jslink !== undefined && jslink.trim() !== '') {
                        let jslinks = jslink.split(',');

                        if (jslinks.length > 0) {
    
                            let jsLinkHtml = $(".jsfilelink_target").html();
                            $(".jsfilelink_target").html('');
                            
                            jslinks.forEach(jslink => {
                                $(".jsfilelink_target").append(jsLinkHtml);
                                const $lastLi2 = $(".jsfilelink_target li").last();
                                $(".jsfilelink_target").find('input[name="js_link[]"]:last').val(jslink.trim());
                                $lastLi2.attr('title', jslink.trim());
                            });
                        
                        }

                    }
                }
                if (response['data']['js_head_link'] !== null) {
                    let jsheadlink = response['data']['js_head_link'];

                    if (jsheadlink !== null && jsheadlink !== undefined && jsheadlink.trim() !== '') {
                        let jsHeadlinks = jsheadlink.split(',');

                        if (jsHeadlinks.length > 0) {
    
                            let jsHeadLinkHtml = $(".jsheadfilelink_target").html();
                            $(".jsheadfilelink_target").html('');
                            
                            jsHeadlinks.forEach(jsheadlink => {
                                $(".jsheadfilelink_target").append(jsHeadLinkHtml);
                                const $lastLi2 = $(".jsheadfilelink_target li").last();
                                $(".jsheadfilelink_target").find('input[name="js_head_link[]"]:last').val(jsheadlink.trim());
                                $lastLi2.attr('title', jsheadlink.trim());
                            });
                        
                        }

                    }
                }
                filemanagerImagepreview();
            }
        }, 
        error: function(xhr, status, err) {
            imgload.hide();
            let errorMessage = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'An unknown error occurred';
            showToast(errorMessage, 'Error', 'error');
        }    
    });
}

/// edit form submit
$("#editThemeForm").on("submit", function (e) {
    e.preventDefault();
    // Ensure css_file selects the right input elements
    var formData = new FormData(this);
    //console.log(formData);
    $.ajax({
        url: ApiCms + "/theme/update/"+id,
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            imgload.show();
        }, 
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                let title = response.message;
                showToast(title, 'Success', 'success', '?P=themeedit&M='+menu_id+'&id='+id);
            }
        },
        error: function(xhr, status, err) {
            imgload.hide();
            
            if (xhr.status === 422) {
                let errors = xhr.responseJSON.errors;
                errors = JSON.parse(errors);
                let errorMessages = "";
                
                $.each(errors, function (field, messages) {
                    messages.forEach(function(message) {
                        errorMessages += `<li>${message}</li>`;
                    });
                });
                let htmlError = `<ul>${errorMessages}</ul>`;
                showToast(htmlError, 'Error', 'error');
            }else{
                showToast(xhr.responseJSON.message, 'Error', 'error');
            }        
        }
    });
});

$(document).ready(function(){
    $(".ui-sortable-css").sortable({
        update: function(event, ui) {
            updateSorting(this);
        }
    });

    $(".ui-sortable-js").sortable({
        update: function(event, ui) {
            updateSortingJs(this);
        }
    });
});

function updateSorting(e) {
    var sorting = [];
    let fileItem = $(e).find(".preview-card");
    fileItem.each(function(index,value) {
        const dataPreviewImage = $(value).data("previewimage");
        sorting.push(dataPreviewImage); // Push value to sorting array
    });
    const inputElement = $(e).parent(".form-group").find("input[name='css_file']");

    if (inputElement.length > 0) {
        inputElement.val(sorting.join(","));
    }
}

function updateSortingJs(e) {
    var sorting = [];
    let fileItem = $(e).find(".preview-card");

    fileItem.each(function() {
        const dataPreviewImage = $(value).data("previewimage");
        sorting.push(dataPreviewImage); // Push value to sorting array
    });
    const inputElement = $(e).parent(".form-group").find("input[name='js_file']");
    if (inputElement.length > 0) {
        inputElement.val(sorting.join(","));
    }
}
