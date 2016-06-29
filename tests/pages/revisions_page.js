"use strict";

require("../pages/table_page.js");

var revisions_page = function () {

    this.revisionTable = function () {
        browser.isElementPresent(by.xpath('/html/body/div/ui-view/ui-view/div/ui-view/ui-view/div/div/ul/li[3]/a'));
        element(by.xpath('/html/body/div/ui-view/ui-view/div/ui-view/ui-view/div/div/ul/li[3]/a')).click();
        element(by.xpath('/html/body/div/ui-view/ui-view/div/ui-view/ui-view/ui-view/div/div/div[2]/span[1]/a')).click();
        return require ("./table_page.js");
    };

};

module.exports = new revisions_page();