"use strict";

require("../pages/new_project_page.js");

var welcome_page = function () {

    this.clickContinue = function () {
        browser.isElementPresent(by.className('btn btn-primary'));
        element(by.className('btn btn-primary')).click();
        return require("./new_project_page.js");
    };
};

module.exports = new welcome_page();