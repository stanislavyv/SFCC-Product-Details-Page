'use strict';

const base = module.superModule;

// Add custom
base.deliveryInfo = require('~/cartridge/models/product/decorators/delivery'),
base.recommendations = require('~/cartridge/models/product/decorators/recommendations')

module.exports = base;