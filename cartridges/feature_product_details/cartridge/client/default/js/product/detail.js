"use strict";
// Override the whole file so that ./base points to the file in this cartridge
const base = require("./base");

const DOTS = "...";
const SUBSTRING_LENGTH = 80;

/**
 * Enable/disable UI elements
 * @param {boolean} enableOrDisable - true or false
 */
function updateAddToCartEnableDisableOtherElements(enableOrDisable) {
    $("button.add-to-cart-global").attr("disabled", enableOrDisable);
}

// Extend
/**
 * Shortens a product's short description to its first 80 characters
 * @param {JQuery} $currDescription
 */
function shortenDescription($currDescription) {
    if ($currDescription.text().trim().length >= SUBSTRING_LENGTH) {
        const newDescription =
            $currDescription.text().trim().substring(0, SUBSTRING_LENGTH) +
            DOTS;
        $currDescription.text(newDescription);
    }
}

// Extend
/**
 * Shows full/ partial product short description
 * @param {JQuery} $currDescription
 * @param {JQuery} $button
 */
function toggleDescription($currDescription, $button) {
    if ($currDescription.text().endsWith(DOTS)) {
        const originalDescription = $currDescription.data(
            "originalDescription"
        );

        $currDescription.text(originalDescription);
        $button.text("Show Less");
    } else {
        shortenDescription($currDescription);
        $button.text("View Details");
    }
}

// Extend
/**
 * Adds event listeners to product short description elements
 */
function addShortDescriptionListeners() {
    const $allDescriptions = $(".js-product-short-description");

    if ($allDescriptions.length > 0) {
        $allDescriptions.each(function (i, currDescription) {
            const $currDescription = $(currDescription);
            $currDescription.data(
                "originalDescription",
                $currDescription.text()
            );

            shortenDescription($currDescription);

            const $button = $currDescription.next();
            $button.on(
                "click",
                toggleDescription.bind(null, $currDescription, $button)
            );
        });
    }
}

// Extend
/**
 * Shows/ Hides content on button click
 * @param {JQuery} $content 
 * @param {JQuery} $button 
 */
function toggleTextContent($content, $button) {
    const $icon = $button.find('.fa');

    if ($content.hasClass('d-none')) {
        $content.removeClass('d-none');

        $icon.removeClass('fa-plus')
        $icon.addClass('fa-minus')
        
        $button.addClass('text-primary');
    } else {
        $content.addClass('d-none');

        $icon.removeClass('fa-minus')
        $icon.addClass('fa-plus')

        $button.removeClass('text-primary');
    }
}


// Extend
/**
 * Add listeners for product long description and delivery sections
 */
function addLongDescriptionAndDeliveryListeners() {    
    let $allProductContainers = $(document).find(".set-item");
    if (!$allProductContainers.length) {
        $allProductContainers = $(document).find(".product-detail");
    }

    $allProductContainers.each(function (i, currProductContainer) {
        const $currProductContainer = $(currProductContainer);

        const $buttons = $currProductContainer.find('.js-toggle-content-btn');

        $buttons.each(function (i, currButton) {
            const $currButton = $(currButton);
            const $currContent = $currButton.parent().next('.js-toggle-content');

            $currButton.on(
                "click",
                toggleTextContent.bind(null, $currContent, $currButton)
            );
        })
    });
}

module.exports = {
    methods: {
        updateAddToCartEnableDisableOtherElements:
            updateAddToCartEnableDisableOtherElements,
    },

    availability: base.availability,

    addToCart: base.addToCart,

    updateAttributesAndDetails: function () {
        $("body").on("product:statusUpdate", function (e, data) {
            var $productContainer = $(
                '.product-detail[data-pid="' + data.id + '"]'
            );

            $productContainer
                .find(".description-and-detail .product-attributes")
                .empty()
                .html(data.attributesHtml);

            if (data.shortDescription) {
                $productContainer
                    .find(".description-and-detail .description")
                    .removeClass("hidden-xl-down");
                $productContainer
                    .find(".description-and-detail .description .content")
                    .empty()
                    .html(data.shortDescription);
            } else {
                $productContainer
                    .find(".description-and-detail .description")
                    .addClass("hidden-xl-down");
            }

            if (data.longDescription) {
                $productContainer
                    .find(".description-and-detail .details")
                    .removeClass("hidden-xl-down");
                $productContainer
                    .find(".description-and-detail .details .content")
                    .empty()
                    .html(data.longDescription);
            } else {
                $productContainer
                    .find(".description-and-detail .details")
                    .addClass("hidden-xl-down");
            }
        });
    },

    showSpinner: function () {
        $("body").on(
            "product:beforeAddToCart product:beforeAttributeSelect",
            function () {
                $.spinner().start();
            }
        );
    },
    updateAttribute: function () {
        $("body").on("product:afterAttributeSelect", function (e, response) {
            if ($(".product-detail>.bundle-items").length) {
                response.container.data("pid", response.data.product.id);
                response.container
                    .find(".product-id")
                    .text(response.data.product.id);
            } else if ($(".product-set-detail").eq(0)) {
                response.container.data("pid", response.data.product.id);
                response.container
                    .find(".product-id")
                    .text(response.data.product.id);
            } else {
                $(".product-id").text(response.data.product.id);
                $('.product-detail:not(".bundle-item")').data(
                    "pid",
                    response.data.product.id
                );
            }
        });
    },
    updateAddToCart: function () {
        $("body").on("product:updateAddToCart", function (e, response) {
            // update local add to cart (for sets)
            $("button.add-to-cart", response.$productContainer).attr(
                "disabled",
                !response.product.readyToOrder || !response.product.available
            );

            var enable = $(".product-availability")
                .toArray()
                .every(function (item) {
                    return (
                        $(item).data("available") &&
                        $(item).data("ready-to-order")
                    );
                });
            module.exports.methods.updateAddToCartEnableDisableOtherElements(
                !enable
            );
        });
    },
    updateAvailability: function () {
        $("body").on("product:updateAvailability", function (e, response) {
            $("div.availability", response.$productContainer)
                .data("ready-to-order", response.product.readyToOrder)
                .data("available", response.product.available);

            $(".availability-msg", response.$productContainer)
                .empty()
                .html(response.message);

            if ($(".global-availability").length) {
                var allAvailable = $(".product-availability")
                    .toArray()
                    .every(function (item) {
                        return $(item).data("available");
                    });

                var allReady = $(".product-availability")
                    .toArray()
                    .every(function (item) {
                        return $(item).data("ready-to-order");
                    });

                $(".global-availability")
                    .data("ready-to-order", allReady)
                    .data("available", allAvailable);

                $(".global-availability .availability-msg")
                    .empty()
                    .html(
                        allReady
                            ? response.message
                            : response.resources.info_selectforstock
                    );
            }
        });
    },
    sizeChart: function () {
        $(".size-chart a").on("click", function (e) {
            e.preventDefault();
            var url = $(this).attr("href");
            var $prodSizeChart = $(this)
                .closest(".size-chart")
                .find(".size-chart-collapsible");
            if ($prodSizeChart.is(":empty")) {
                $.ajax({
                    url: url,
                    type: "get",
                    dataType: "json",
                    success: function (data) {
                        $prodSizeChart.append(data.content);
                    },
                });
            }
            $prodSizeChart.toggleClass("active");
        });

        var $sizeChart = $(".size-chart-collapsible");
        $("body").on("click touchstart", function (e) {
            if ($(".size-chart").has(e.target).length <= 0) {
                $sizeChart.removeClass("active");
            }
        });
    },
    copyProductLink: function () {
        $("body").on("click", "#fa-link", function () {
            event.preventDefault();
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val($("#shareUrl").val()).select();
            document.execCommand("copy");
            $temp.remove();
            $(".copy-link-message").attr("role", "alert");
            $(".copy-link-message").removeClass("d-none");
            setTimeout(function () {
                $(".copy-link-message").addClass("d-none");
            }, 3000);
        });
    },

    focusChooseBonusProductModal: base.focusChooseBonusProductModal(),

    // Extend
    colorAttribute: base.colorAttribute,
    selectSize: base.selectSize,
    selectQuantity: base.selectQuantity,

    addShortDescriptionListeners,
    addLongDescriptionAndDeliveryListeners,
};
