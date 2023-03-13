const server = require("server");
const base = module.superModule;
server.extend(base);

const CONTENT_IDS = {
    "specialOffers": "special-offers"
};

/**
 * Product-Show : This endpoint is called to show the details of the selected product
 * @name Base/Product-Show
 * @function
 * @memberof Product
 * @param {middleware} - cache.applyPromotionSensitiveCache
 * @param {middleware} - consentTracking.consent
 * @param {querystringparameter} - pid - Product ID
 * @param {category} - non-sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.append(
    "Show",
    function (req, res, next) {
        const ContentMgr = require('/dw/content/ContentMgr');
        const specialOffersContent = ContentMgr.getContent(CONTENT_IDS.specialOffers).custom.body.markup;

        const viewData = res.getViewData()
        viewData.specialOffers = specialOffersContent;
        res.setViewData(viewData);

        next();
    }
);

module.exports = server.exports();
