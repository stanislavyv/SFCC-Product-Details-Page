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
    setThumbnailActive,
};
