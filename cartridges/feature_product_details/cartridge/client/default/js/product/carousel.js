/**
 * Adds functionality to recommended products carousel
 */
function addRecommendationCarousel() {
    const $allCarousels = $(".featured-carousel");

    $allCarousels.each(function (i, currCarousel) {
        const $currCarousel = $(currCarousel);

        $currCarousel.find(".carousel-item").each(function () {
            let minPerSlide = 3;
            let next = $(this).next();
            if (!next.length) {
                next = $(this).siblings(":first");
            }
            next.children(":first-child").clone().appendTo($(this));

            for (let i = 0; i < minPerSlide; i++) {
                next = next.next();
                if (!next.length) {
                    next = $(this).siblings(":first");
                }
                next.children(":first-child").clone().appendTo($(this));
            }
        });
    });
}

/**
 * Sets on-click event listener for image carousel thumbnails
 */
function setThumbnailActive() {
    $("[id^=pdpCarousel-]").each(function (i, currCarousel) {
        const $allImages = $(currCarousel).find(".carousel-image");

        $allImages.each(function (j, currImage) {
            $(currImage).on("click", function () {
                $allImages.removeClass("active");
                $(currImage).addClass("active");
            });
        });
    });
}

module.exports = {
    addRecommendationCarousel,
    setThumbnailActive,
};
