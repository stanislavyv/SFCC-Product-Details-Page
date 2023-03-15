"use strict";

const processInclude = require("base/util");

$(document).ready(function () {
    processInclude(require("./product/detail"));
    processInclude(require("./product/carousel"));
});
