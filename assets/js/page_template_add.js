document.title = "Dashboard | Page Template";
// Global variable to store variants
let VariantObj = {};
var initialPageType = '';
$(document).ready(function () {
    // Existing code remains the same
    // var initialPageType = $("select[name=page_type]").val();
    // if (initialPageType) {
    //     updateInputValues(initialPageType);
    // }
    
    // Set up the slug input change handler only once
    $('#product-slug-input').on('change', function() {
        var pageType = $("select[name=page_type]").val();
        if (pageType === 'product_detail') {
            var slug = $(this).val().trim();
            if (slug) {
                updateProductDetailVariables(slug);
            }
        }
    });

    // Fetch API URL on page load
    $.ajax({
        url: ApiCms + '/theme/page-template/create',
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            xhr.setRequestHeader("theme-id", theme_id);
            imgload.show();
        },
        success: function (response) {
            // $("input[name=api_url]").val(response.api_url);
            $("#template_api_url").text(BaseApi);
            // Load any existing template data
            if (response.data) {
                const data = response.data;
                if (data.html_variant) {
                    try {
                        // Load saved variant data
                        VariantObj = JSON.parse(data.html_variant);
                        $("#html_variant").val(data.html_variant);
                    } catch (e) {
                        console.error("Error parsing html_variant:", e);
                    }
                }
            }
            
            imgload.hide();
        },
        error: function (xhr, status, error) {
            imgload.hide();
            showToast("Error fetching API URL", 'Error', 'error');
        }
    });

});


function getdetailProduct(slug, BaseApi,label = false) {
    if (slug == '') {
        showToast('Please enter url', 'Error', 'error');
        return;
    }
    return $.ajax({
        url: BaseApi + slug,
        type: 'GET',
        beforeSend: function (xhr) {
            imgload.show();
        },
        success: function (response) {
            imgload.hide();
            $("input[name='api_url']").val(slug);
            let pageType = $("#template_page_type").val();
            label.parent().siblings().find(".variable-list").parent().remove();
            if (pageType === 'cart' || pageType === 'checkout' || pageType === 'thankyou' || pageType === 'address' || pageType === 'login' || pageType === 'signup' || pageType === 'forget_password' || pageType === 'reset_password' || pageType === 'customer_profile' || pageType === 'wishlist') {
                if (response.data != '' && response.data != null) {
                    let products = response.data;
                    let li = '';
                    
                    if (label.parent().siblings().find(".variable-list .list-group-item").length > 0) {
                        return ;
                    }
                    if (pageType === 'login' || pageType === 'signup' || pageType === 'forget_password' || pageType === 'reset_password') {
                        for (let i = 0; i < products.length; i++) {
                            li += '<div class="col-3 mb-3"><div class="list-group-item copy-variable">' + products[i] + '</div></div>';
                        }
                    }else{
                        for (let i = 0; i < products.length; i++) {
                            li += '<div class="col-3 mb-3"><div class="list-group-item copy-variable">${item.' + products[i] + '}</div></div>';
                        }
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
                }else{
                    showToast('No Data available', 'Error', 'error');
                    return [];
                }
            }else if(pageType === 'order' || pageType === 'order_detail'|| pageType === 'track_order'){
               if (response.data != '' && response.data != null) {
                    let orders = response.data;
                    let orderDetail = response.details;
                    let lih = '';
                    let li = '';
                    let subli = '';
                    let subhli = '';
                    console.log('orders',orders);
                    
                    if (label.parent().siblings().find(".variable-list .list-group-item").length > 0) {
                        return ;
                    }

                    lih += '<div class="list-group-item copy-variable"><button type="button" onclick="variableModal(this)">Use</button><div class="row">';
                    for (let i = 0; i < orders.length; i++) {
                        li += '<div class="col-3 mb-3 sub-variable"><div class="list-group-item copy-variable">${item.' + orders[i] + '}</div></div>';
                    }
                    lih += li + '</div></div>';
                    // subhli += '<div class="list-group-item copy-variable"><button type="button" onclick="variableModal(this)">Use</button><div class="row">';
                    // for (let i = 0; i < orderDetail.length; i++) {
                    //     subli += '<div class="col-3 mb-3 sub-variable"><div class="list-group-item copy-variable">${item.' + orderDetail[i] + '}</div></div>';
                    // }
                    subhli += subli + '</div></div>';
                    label.parent().after(`
                    <div class="col-lg-10 col-md-12 col-sm-12 my-5 card p-3">
                        <div class="list-group variable-list">
                            <div class="row">
                             <h4 class="mb-3">Orders</h4>
                                ${lih}
                            </div>
                            
                        </div>
                    </div>`);
                    return orders;
                }else{
                    showToast('No Data available', 'Error', 'error');
                    return [];
                } 
            }else if (pageType === 'product_detail'){
                if (response.data != '' && response.data != null) {
                    let products = response.data;
                    let keys = Object.keys(response.data);
                    let li = '';
                    let subhli = '';
                    let subli = '';
                    if (label.parent().siblings().find(".variable-list").length > 0) {
                        return;
                    }
                    for (let i = 0; i < keys.length; i++) {
                        if (typeof products[keys[i]] == 'object' && products[keys[i]] !== null) {
                            let subObj = products[keys[i]];
    
                            if (subObj.length > 0) {
                                subhli += '<div class="list-group-item copy-variable">${item.' + keys[i] + '} <button type="button" data-id="' + keys[i] + '" onclick="variableModal(this)">Use</button><div class="row">';
                            }
                            // let subkeys = Object.keys(subkeys);
                            if (subObj.length > 0) {
                                // for (let j = 0; j < subObj.length; j++) {
                                let subkeys = Object.keys(subObj[0]);
                                for (let k = 0; k < subkeys.length; k++) {
                                    subli +=
                                        '<div class="col-3 mb-3 sub-variable">' +
                                        '<div class="list-group-item copy-variable">${item.' + subkeys[k] + '}</div>' +
                                        '</div>';
                                }
                                // }
                                subhli += subli + '</div></div>';
                            }
                        } else {
                            li += '<div class="col-3 mb-3"><div class="list-group-item copy-variable">${item.' + keys[i] + '}</div></div>';
                        }
                    }
                    label.parent().after(`
                        <div class="col-lg-10 col-md-12 col-sm-12 my-5 card p-3">
                            <div class="list-group variable-list">
                                <h4 class="mb-3">Variables</h4>
                                <div class="row">
                                    ${li}
                                </div>
                                <div class="row">
                                    <h4 class="mb-3">Sub Variables</h4>
                                    ${subhli}
                                </div>
                            </div>
                        </div>`);
                    return products;
                } else {
                    showToast('No Data available', 'Error', 'error');
                    return [];
                }
            }else if(pageType === 'product_listing'){
                if (response.data != '' && response.data != null) {
                    let products = response.data;
                    let productKeys = Object.keys(products)
                    let li = '';
                    let subhli = '';
                    let subli = '';
                    if (label.parent().siblings().find(".variable-list").length > 0) {
                        return;
                    }
                    for (let i = 0; i < productKeys.length; i++) {
                        if (typeof products[productKeys[i]] == 'object' && products[productKeys[i]] !== null) {
                            let subObj = products[productKeys[i]];
                            if (subObj.length > 0) {
                                subli = '';
                                subhli += '<div class="row"><h4 class="mb-3">'+productKeys[i]+'</h4><div class="list-group-item copy-variable">${item.' + productKeys[i] + '} <button type="button" data-id="' + productKeys[i] + '" onclick="variableModal(this)">Use</button><div class="row">';
                                let subkeys = Object.keys(subObj);
                                for (let k = 0; k < subkeys.length; k++) {
                                    subli +=
                                        '<div class="col-3 mb-3 sub-variable">' +
                                        '<div class="list-group-item copy-variable">${item.' + subObj[k] + '}</div>' +
                                        '</div>';
                                }
                                subhli += subli + '</div></div></div>';
                            }
                        } else {
                            li += '<div class="col-3 mb-3"><div class="list-group-item copy-variable">${item.' + products[i] + '}</div></div>';
                        }
                    }
                    label.parent().after(`
                        <div class="col-lg-10 col-md-12 col-sm-12 my-5 card p-3">
                            <div class="list-group variable-list">
                                <h4 class="mb-3">Variables</h4>
                                <div class="row">
                                    ${li}
                                </div>
                                ${subhli}
                            </div>
                        </div>`);
                    return products;
                } else {
                    showToast('No Data available', 'Error', 'error');
                    return [];
                }
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

// Handle page type change
// Handle page type change
$("#template_page_type").change(function () {
    var pageType = $(this).val();
    updateInputValues(pageType);
    updateLabels(pageType);

    // Show/hide slug input for product detail
    if (pageType === 'product_detail') {
        $('#product-slug-input').show();
    } else {
        $('#product-slug-input').hide();
        updateVariablesForPageType(pageType);
    }

    if (pageType === 'cart') {
        $('#cart-slider-section').removeClass('d-none');
    } else {
        $('#cart-slider-section').addClass('d-none');
    }
    
    if (pageType === 'login') {
        $("input[name=api_url]").val('customer/login/get_columns');
    }else if(pageType === 'signup'){
        $("input[name=api_url]").val('customer/signup/get_columns');
    }else if(pageType === 'forget_password'){
        $("input[name=api_url]").val('customer/forgetpassword/get_columns');
    }else if(pageType === 'reset_password'){
        $("input[name=api_url]").val('customer/resetpassword/get_columns');
    }else if(pageType === 'order'){
        $("input[name=api_url]").val('customer_order/get_column_order');
    }else if(pageType === 'order_detail'){
        $("input[name=api_url]").val('customer_order/get_column_order_detail');
    }else if(pageType === 'customer_profile'){
    }else if(pageType === 'track_order'){
        $("input[name=api_url]").val('customer_order/get_column_order_detail');
    }else if(pageType === 'customer_profile'){
        $("input[name=api_url]").val('customer/profile/get_columns');    
    }else if(pageType === 'cart'){
        $("input[name=api_url]").val('cart/get_columns');
    }else if(pageType === 'wishlist'){
        $("input[name=api_url]").val('wishlist/get_columns');
    }else if(pageType === 'product_listing'){
        $("input[name=api_url]").val('product/get_columns');
    }else if(pageType === 'address'){
        $("input[name=api_url]").val('customer/address/get_columns');
    }
});

// Function to update product detail variables
function updateProductDetailVariables(slug) {
    var apiUrl = ApiCMS + 'frontend/get_product_by_slug/' + encodeURIComponent(slug);
    $("input[name=api_url]").val(apiUrl);
    
    $.ajax({
        url: apiUrl,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            xhr.setRequestHeader("theme-id", theme_id);
            imgload.show();
        },
        success: function (response) {
            if (response.status_code === 200) {
                var variables = generateVariablesFromResponse(response.data || response);
                updateVariablesContainer(variables);
                
                // Handle array variables for variant options
                handleArrayVariables(response.data || response);
            }
            imgload.hide();
        },
        error: function (xhr, status, error) {
            imgload.hide();
            showToast("Error fetching product variables", 'Error', 'error');
        }
    });
}

// Function to identify array variables for variant options
function handleArrayVariables(response, prefix = 'item') {
    $('.sub-variables-container').remove();
    
    // Process the response to find arrays
    for (const key in response) {
        if (response.hasOwnProperty(key) && Array.isArray(response[key]) && response[key].length > 0) {
            let subObj = response[key];
            let subli = '';
            
            // Create variable buttons for arrays
            if (subObj.length > 0) {
                let subkeys = Object.keys(subObj[0]);
                for (let k = 0; k < subkeys.length; k++) {
                    subli += 
                    '<div class="col-3 mb-3 sub-variable">'+
                        '<div class="list-group-item copy-variable">${item.' + subkeys[k] + '}</div>'+
                    '</div>';
                }
                
                // Add array variable with "Use" button
                $('.variable-list .row').append(`
                    <div class="col-12 sub-variables-container">
                        <h4 class="mb-2">Sub Variables</h4>
                        <div class="list-group-item copy-variable">\${item.${key}} 
                            <button type="button" data-id="${key}" class="btn btn-sm btn-outline-primary" onclick="variableModal(this)">Use</button>
                            <div class="row mt-2">
                                ${subli}
                            </div>
                        </div>
                    </div>
                `);
            }
        }
    }
}

// Function to update variables for other page types
function updateVariablesForPageType(pageType) {
    var apiUrl = '';
    var variables = [];

    if (pageType === 'cart') {
        // apiUrl = ApiCMS + 'frontend/cart';
        // $("#template_api_url").text(BaseApi);

        // $.ajax({
        //     url: apiUrl,
        //     type: "GET",
        //     beforeSend: function (xhr) {
        //         xhr.setRequestHeader("Authorization", "Bearer " + strkey);
        //         xhr.setRequestHeader("menu-uuid", menu_id);
        //         xhr.setRequestHeader("theme-id", theme_id);
        //         imgload.show();
        //     },
        //     success: function (response) {
        //         if (response.status_code === 200) {
        //             variables = generateVariablesFromResponse(response.data || response);
        //             updateVariablesContainer(pageType, variables);

        //             // Handle array variables for variant options
        //             handleArrayVariables(response.data || response);
        //         } else {
        //             updateVariablesContainer([]); // Show no variables message if API fails
        //         }
        //         imgload.hide();
        //     },
        //     error: function (xhr, status, error) {
        //         imgload.hide();
        //         showToast("Error fetching cart variables", 'Error', 'error');
        //     }
        // });
    } else if (pageType === 'checkout') {
        // For checkout page, clear variables
        updateVariablesContainer(pageType, []);
    }
}

// Update the variables container with new variables
function updateVariablesContainer(pageType = NULL, variables) {
    var variablesContainer = $('#variables-container');
    variablesContainer.empty();

    if (pageType !== 'checkout' && variables.length === 0) {
        variablesContainer.append(
            '<div class="col-12 text-center py-3">No variables available</div>'
        );
    } else if (pageType === 'checkout') {
        $(".variables-checkout").removeClass("d-none");
        let variablesContainerCheckout  = $("#variables-container-checkout");
        variablesContainerCheckout.empty();
        variablesContainerCheckout.append(
            `<div class="col-3 mb-3"><div class="list-group-item">customer_id</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">shipping_price</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">discount_type</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">discount_value</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">billing_first_name</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">billing_last_name</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">billing_email</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">billing_phone</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">billing_address</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">billing_address2</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">billing_city</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">billing_state</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">billing_country</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">shipping_first_name</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">shipping_last_name</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">shipping_email</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">shipping_phone</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">shipping_address</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">shipping_address2</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">shipping_city</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">shipping_state</div></div>
            <div class="col-3 mb-3"><div class="list-group-item">shipping_country</div></div>`
        );
    } else {
        variables.forEach(function (variable) {
            variablesContainer.append(
                '<div class="col-3 mb-3"><div class="list-group-item">' + variable + '</div></div>'
            );
        });
    }
}


function generateVariablesFromResponse(response, prefix = 'item') {
    const variables = [];

    function traverse(obj, path, isArrayItem = false) {
        // If this is an array, we want to generate variables for a generic array item
        if (Array.isArray(obj) && obj.length > 0) {
            // For arrays, we only need to process the first item to get the structure
            // but we want to generate variables without the array index
            if (!isArrayItem) {
                // Add the array itself as a variable
                variables.push(`\${${path}}`);

                // Process the first array item to generate template for all items
                const firstItem = obj[0];
                const itemPath = path;

                // If it's an object, traverse its properties
                if (typeof firstItem === 'object' && firstItem !== null) {
                    for (const key in firstItem) {
                        if (firstItem.hasOwnProperty(key)) {
                            if (key === 'stocks') continue; // Skip stocks as in original code

                            const itemPropPath = `${itemPath}.${key}`;
                            variables.push(`\${${itemPropPath}}`);

                            // Recursively traverse if this is an object
                            if (typeof firstItem[key] === 'object' && firstItem[key] !== null) {
                                traverse(firstItem[key], itemPropPath, true);
                            }
                        }
                    }
                }
            }
            return;
        }

        // Process object properties
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key === 'stocks') continue; // Skip stocks as in original code

                const currentPath = path ? `${path}.${key}` : key;

                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    if (Array.isArray(obj[key])) {
                        // Handle arrays
                        if (obj[key].length > 0) {
                            variables.push(`\${${currentPath}}`);
                            traverse(obj[key], currentPath);
                        }
                    } else {
                        // Handle nested objects
                        variables.push(`\${${currentPath}}`);
                        traverse(obj[key], currentPath);
                    }
                } else {
                    // Handle primitive values
                    variables.push(`\${${currentPath}}`);
                }
            }
        }
    }

    traverse(response, prefix);
    return [...new Set(variables)]; // Remove duplicates
}

// class change as per page type
function updateLabels(pageType) {
    const labelMap = {
        'product_detail': 'Product Detail',
        'cart': 'Product Cart',
        'checkout': 'Product Checkout'
    };

    const labelPrefix = labelMap[pageType] || 'Product Cart';

    // Update all label texts
    $('label[for="product_class"]').each(function (index) {
        let originalText = $(this).text().trim();
        let newText = originalText.replace(/^(Product Cart|Product Detail|Product Checkout)/, labelPrefix);
        $(this).text(newText);
    });
}

// class change as per page type
function updateInputValues(pageType) {
    const classNames = {
        'product_detail': {
            total: 'insta-manage-product-detail-price',
            variant_image:'insta-manage-variation-img',
            variant_show: 'insta-manage-variation-show'
        },
        'product_listing':{
            product_lisitng: 'insta-manage-product-listing',
            product_single: 'insta-manage-product-single',
            filter_category: 'insta-manage-category-filter',
            filter_input: 'insta-manage-filter-input',
            wishlist_icon: 'insta-wishlist-icon',
            wishlist_filled: 'insta-wishlist-filled',
            wishlist_unfilled: 'insta-wishlist-unfilled'
        },
        'cart': {
            section_list: 'insta-manage-cart-list',
            section_empty: 'insta-manage-cart-empty',
            total: 'insta-manage-cart-total',
            sub_total: 'insta-manage-cart-sub-total',
            grand_total: 'insta-manage-cart-grand-total',
            section_removed: 'removeCartItem(uuid)',
            section_remove_all: 'removeAllCartItems(uuid)',
            section_change: 'quantityChangeHandler(event)',
            section_single_cart: 'insta-manage-single-cart',
            single_cart_qty_plus: 'insta-manage-single-cart-qty-plus',
            single_cart_qty_miuns: 'insta-manage-single-cart-qty-miuns',
            single_cart_price: 'insta-manage-single-cart-price',
            single_cart_qty_input: 'insta-manage-quantity-input',
            clear_all_basket: 'insta-clear-all-basket',
            cart_basket_summary: 'insta-cart-basket-summary'
        },
        'wishlist':{
            section_list: 'insta-manage-wishlist-list',
            section_empty: 'insta-manage-wishlist-empty',
            section_removed: 'removeWishlistItem(uuid)',
            section_single_cart: 'insta-manage-single-wishlist',
        },
        'checkout': {
            section_list: 'insta-manage-cart-list',
            section_removed: 'removeCartItem(uuid)',
            section_single_cart: 'insta-manage-single-cart',
            sub_total_price: 'sub-total-price-checkout',
            grand_total_price: 'grand-total-price-checkout',
            submit_button: "orderStore()",
            same_as_shipping: 'insta-same-as-shipping-address'
        },
        'login': {
            form_id: 'insta-login-form'
        },
        'forget_password': {
            form_id: 'insta-forget-password-form'
        },
        'reset_password': {
            form_id: 'insta-reset-password-form'
        },
        'signup': {
            form_id: 'insta-signup-form',
            noSpaces: 'return noSpaces(event)'
        },
        'dashboard': {
            user_name: 'insta-customer-name',
            user_logout: 'logout()',
            customer_name: 'insta-customer-name',
            customer_email: 'insta-customer-email',
            customer_image: 'insta-customer-image',
            address_form: 'insta-address-form',
            wishlist_list: 'insta-wishlist-list',
            remove_wishlist_item: 'removeWishlistItem(uuid)',
        },'order':{
            order_detail: 'insta-order-list',
            order_search_input: 'insta-order-search-input',
            order_sort_option: 'insta-order-sort-option',
            order_sort_display: 'insta-order-sort-display',
            order_list: 'insta-order-list',
            status_class: '${item.statusClass}'
        },'order_detail':{
            order_detail: 'insta-order-product-list',
        },'customer_profile': {
        },'track_order':{
            track_order: 'insta-order-product-list',
            empty_order_detail: 'insta-empty-order-detail',
            order_detail: 'insta-order-detail',
        },'customer_profile': {
            user_name: 'insta-customer-profile-form',
            user_password: 'insta-customer-password-form',
            user_image: 'insta-customer-user-img',
        }, 'address': {
            address_list: 'insta-address-list',
            address_add_form: 'insta-add-address-form',
            address_edit_form: 'insta-edit-address-form',
            address_add_modal: 'insta-address-add-modal',
            address_edit_modal: 'insta-address-edit-modal',
        }, 'thankyou': {
            total_price: 'insta-manage-total-price',
        }
    };
    
    if (classNames[pageType]) {
        if (pageType === 'checkout') {
            const cartSectionListInputs = [];
            Object.entries(classNames[pageType]).forEach(([key, value]) => {
                let text = value.replace(/-/g, ' ');
                if (value == 'orderStore()') {
                    text = 'Add Button Onclick';
                }else if (value == 'removeCartItem()') {
                    text = 'Remove Item Onclick';
                }else if (value == 'insta-manage-single-cart') {
                    text =  text + ' with data-id'; 
                }
                cartSectionListInputs.push(
                    `<div class="col-lg-6 col-md-12 col-sm-12 mb-2"> 
                        <label class="form-label required" for="product_class"><g-t>${value == 'orderStore()' ? 'Add Button Onclick' : value.replace(/-/g, ' ')}</g-t></label>
                        <div class="input-group">
                            <input type="text" class="form-control variable" value="${value}" name="cart_section_list" id="cart_section_list" placeholder="class" readonly>
                            <button class="btn btn-outline-primary waves-effect" type="button" onclick="copyInputText(this)" id="button-addon2">Copy</button>
                        </div>
                    </div>`
                );
            });
            let cartSectionListInputsContainer = $('.cart-section-list-inputs-container');
            cartSectionListInputsContainer.html(cartSectionListInputs.join(''));
        }else {
            const cartSectionListInputs = [];
            Object.entries(classNames[pageType]).forEach(([key, value]) => {
                cartSectionListInputs.push(
                    `<div class="col-lg-6 col-md-12 col-sm-12 mb-2"> 
                        <label class="form-label required" for="product_class"><g-t>${value.replace(/-/g, ' ')}</g-t></label>
                        <div class="input-group">
                            <input type="text" class="form-control variable" value="${value}" name="cart_section_list" id="cart_section_list" placeholder="class" readonly>
                            <button class="btn btn-outline-primary waves-effect" type="button" onclick="copyInputText(this)" id="button-addon2">Copy</button>
                        </div>
                    </div>`
                );
            });
            let cartSectionListInputsContainer = $('.cart-section-list-inputs-container');
            cartSectionListInputsContainer.html(cartSectionListInputs.join(''));
        }
    }
}

function updateLabelText(pageType) {
    const labelMap = {
        'product_detail': 'Product Detail',
        'cart': 'Cart',
        'checkout': 'Checkout'
    };

    const labelType = labelMap[pageType] || 'Cart';

    const labelSelectors = {
        'cart_section_list': 'Section List',
        'cart_section_list_empty': 'Section Empty',
        'product_cart_list': 'List',
        'product_cart_subtotal_list': 'Subtotal',
        'product_cart_total_list': 'Total'
    };

    for (let name in labelSelectors) {
        $(`input[name="${name}"]`)
            .closest('.col-lg-6')
            .find('label g-t')
            .text(`${labelType} ${labelSelectors[name]}`);
    }
}

// Form submission handler
$("#addProductDesignForm").submit(function (e) {
    e.preventDefault();

    if ($("select[name=page_type]").val() === '') {
        showToast("Please select page type", 'Error', 'error');
        return false;
    }

    var formData = new FormData(this);
    formData.append('cart_section_list', $('input[name="cart_section_list"]').val());
    formData.append('cart_section_list_empty', $('input[name="cart_section_list_empty"]').val());
    formData.append('product_cart_list', $('input[name="product_cart_list"]').val());
    formData.append('product_cart_subtotal_list', $('input[name="product_cart_subtotal_list"]').val());
    
    // Add html_variant to form data
    formData.append('html_variant', $("#html_variant").val());
    
    $.ajax({
        url: ApiCms + "/theme/page-template/store",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + strkey);
            xhr.setRequestHeader("menu-uuid", menu_id);
            xhr.setRequestHeader("theme-id", theme_id);
            imgload.show();
        }, 
        success: function (response) {
            imgload.hide();
            
            if (response.status_code === 200) {
                let title = response.message;
                showToast(title, 'Success', 'success', '?P=page_template&M=' + menu_id + '&themeId=' + theme_id);
                $("#addProductDesignForm")[0].reset();
            } else {
                showToast(response.message || "An error occurred", 'Error', 'error');
            }
        },
        error: function (xhr, status, error) {
            imgload.hide();
            let errorMessage = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : "An error occurred while saving the page template.";
            showToast(errorMessage, 'Error', 'error');
        }
    });
});

// Variable copy functionality
$(document).on('click', '.copy-variable', function() {
    if ($(this).find('button').length === 0) { // Don't copy if it has a button
        var variableText = $(this).text().trim();
        navigator.clipboard.writeText(variableText).then(function() {
            showToast("Variable copied: " + variableText, 'Success', 'success');
        }, function(err) {
            showToast("Could not copy text", 'Error', 'error');
        });
    }
});

// Function to handle variable modal (must be global for onclick to work)
function variableModal(e) {
    const $button = $(e);
    const modal = $("#variable_loop");
    const id = $button.data("id");
    
    // Open modal
    modal.modal("show");

    // Set modal title and hidden input
    $("#loop-title").html(id);
    $("#loop_variable").val(id);
    $("#loop_html").attr('name', 'html_' + id);

    // Clear old variable list
    $("#variable-list-loop .row").empty();

    // --- Find correct sub-variables context ---
    // Traverse to the parent `.copy-variable` wrapper and get sibling `.sub-variable`s
    const $modalRow = $button.closest('.row');
    const $subVariables = $modalRow.find('.sub-variable .copy-variable').clone();

    // Append new variables
    $("#variable-list-loop .row").append($subVariables);

    // Load from hidden JSON input (optional)
    const html_variant = $("#html_variant").val();  // assumed to be a hidden input

    // Set textarea value from stored variant object (if available)
    if (html_variant && html_variant.trim() !== '') {
        try {
            const variantObj = JSON.parse(html_variant);
            $("#loop_html").val(variantObj[id] || '');
        } catch (err) {
            console.error("Invalid JSON in html_variant:", err);
            $("#loop_html").val('');
        }
    } else {
        $("#loop_html").val('');
    }
}

// Handle modal form submission
$("#variant_loop").submit(function (e) {
    e.preventDefault();
    let loop_variable = $("#loop_variable").val();
    let loop_html = $("#loop_html").val();
    let html_variant = $("#html_variant").val();
    let VariantObj = html_variant != '' ? JSON.parse($("#html_variant").val()) : '';
    // Update VariantObj
    if(VariantObj[loop_variable]){
        VariantObj[loop_variable] = loop_html;
    }else{
        let variableObj = {};
        variableObj[loop_variable] = loop_html;
        VariantObj = { ...VariantObj, ...variableObj };
    }
    // Update the hidden input
    $("#html_variant").val(JSON.stringify(VariantObj));
    // Close modal and reset form
    $("#variable_loop").modal("hide");
    $("#variant_loop").trigger("reset");
});

// Copy input text functionality (must be global for onclick to work)
function copyInputText(element) {
    var inputElement = $(element).siblings('input');
    inputElement.select();
    document.execCommand('copy');
    showToast("Copied to clipboard", 'Success', 'success');
}