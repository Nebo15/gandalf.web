"use strict";

require("../pages/new_project_page.js");

var welcome_page = function () {

  this.clickContinue = function () {
    element(by.className('btn btn-submit')).isDisplayed();
    var submit = element.all(by.className('btn btn-submit')).first();
    submit.click();
    return require("./new_project_page.js");
  };
};

module.exports = new welcome_page();
