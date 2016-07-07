"use strict";

require("../pages/new_tables_page.js");

var table_page = function () {

  this.addTable = function () {
    browser.isElementPresent(by.className('btn btn-primary btn-icon'));
    element(by.className('btn btn-primary btn-icon')).click();
    return require("./new_tables_page.js");
  };
};

module.exports = new table_page();
