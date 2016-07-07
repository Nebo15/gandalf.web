"use strict";

require("../pages/history_page.js");

var dashboard_page = function () {

  this.assertDashboard = function () {
    browser.isElementPresent(by.className('btn btn-primary btn-icon'));
  };

  this.getHistory = function () {
    return require("./history_page.js");
  };
};

module.exports = new dashboard_page();
