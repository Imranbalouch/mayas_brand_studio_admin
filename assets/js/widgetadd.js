document.title="Dashboard | Add Widgets";  
let themeId =  '';
$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');
    themeId = urlParams.get('themeId');
    $("#widgetList").click(function () {
        let page = 'widgets';
        window.location.assign('?P='+page+'&M='+menu_id+'&themeId='+themeId);
    });

    $("select[name=widget_type]").change(function () {
        var widgetType = $(this).val();
        updateInputValues(widgetType); // Call updateInputValues with widget type
    });
});

function updateInputValues(pageType) {
    const classNames = {
        'header': {
            search_list_count: 'insta-search-list-count',
            language_switcher: 'insta-manage-language-switcher',
            search_results: 'insta-manage-ecommerce-search-results',
            search_input: 'searchProducts(this.value)'
        },
    };

    const cartSectionListInputsContainer = $('.cart-section-list-inputs-container');
    cartSectionListInputsContainer.empty();

    if (classNames[pageType]) {
        const cartSectionListInputs = [];
        Object.entries(classNames[pageType]).forEach(([key, value]) => {
            let text = value.replace(/-/g, ' ');
            if (value.includes('()')) {
                text = value.replace('()', ' Onclick');
            } else if (value === 'insta-manage-single-cart') {
                text = text + ' with data-id';
            } else if (value === 'searchProducts(this.value)') {
                text = 'Search Input Oninput';
            }
            cartSectionListInputs.push(
                `<div class="col-lg-6 col-md-12 col-sm-12 mb-4"> 
                    <label class="form-label required" for="product_class"><g-t>${text}</g-t></label>
                    <div class="input-group">
                        <input type="text" class="form-control variable" value="${value}" name="cart_section_list" id="cart_section_list" placeholder="class" readonly>
                        <button class="btn btn-outline-primary waves-effect" type="button" onclick="copyInputText(this)" id="button-addon2">Copy</button>
                    </div>
                </div>`
            );
        });
        cartSectionListInputsContainer.html(cartSectionListInputs.join(''));
    }
}

$("#addWidgetForm").on("submit", function (e) {
    e.preventDefault();
    let fieldNames = $(".addfield_target").find('input[name="field_name[]"]');
    let isDuplicate = false;
    let fieldNameValues = [];
    let duplicateFieldName = '';
    let currentElement = '';
    fieldNames.each(function () {
        let value = $(this).val();
        if (fieldNameValues.includes(value)) {
            currentElement = $(this);
            isDuplicate = true;
            duplicateFieldName = value;
            return false; // Exit the loop early if duplicate is found
        }
        fieldNameValues.push(value);
    });
    if (isDuplicate) {
        currentElement.addClass('is-invalid');
        currentElement.focus();
        showToast('Duplicate field name found: ' + duplicateFieldName, 'Error', 'error');
        return;
    }
    let formData = new FormData(this);
    // return ;
    $.ajax({
        url: ApiCms + "/theme/widget/store",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            xhr.setRequestHeader("theme-id", themeId);
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            if (response.status_code == 200) {
                let title = response.message;
                showToast(title, 'Success', 'success','?P=widgets&M='+menu_id+'&themeId='+themeId);
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
                showToast(xhr.responseJSON.message, 'Error', 'error');
            }
        }
    });
});
$(".ui-sortable-css").sortable({
    update: function(event, ui) {
        updateSorting(this);
    }
});
function updateSorting(e) {
    var sorting = [];
    let fileItem = $(e).find(".preview-card");
    fileItem.each(function() {
        sorting.push($(this).data("previewimage"));
    });
    console.log(sorting);
    console.log($(e).parent(".form-group"));
    
    $(e).parent(".form-group").find("input[name='css_file']").val(sorting.join(","));
}
$(".ui-sortable-js").sortable({
    update: function(event, ui) {
        updateSortingJs(this);
    }
});
function updateSortingJs(e) {
    var sorting = [];
    let fileItem = $(e).find(".preview-card");
    fileItem.each(function() {
        sorting.push($(this).data("previewimage"));
    });
    console.log(sorting);
    console.log($(e).parent(".form-group"));
    
    $(e).parent(".form-group").find("input[name='js_file']").val(sorting.join(","));
}

function toggleIsRequired(checkbox) {
    const isChecked = $(checkbox).is(':checked');
    const hiddenField = $(checkbox).closest('div').find('input:hidden[name="is_required[]"]');
    if (isChecked) {
        hiddenField.remove();
    } else {
        $(checkbox).closest('div').append('<input type="hidden" name="is_required[]" value="0" />');
    }
}