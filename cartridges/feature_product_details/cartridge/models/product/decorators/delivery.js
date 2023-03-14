'use strict';

module.exports = function (object, product) {
    Object.defineProperty(object, 'deliveryInfo', {
        enumerable: true,
        value: product.custom.deliveryInfo || null
    });
};
