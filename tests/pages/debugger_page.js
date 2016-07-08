"use strict";

require("../pages/decisions_page.js");

var debugger_page = function () {

  this.debugTable = function (description, type) {
    browser.isElementPresent(by.css('[ui-sref=".debugger"]'));
    element(by.css('[ui-sref=".debugger"]')).click();
    browser.isElementPresent(by.model('$parent.field.value'));
    element(by.className('btn btn-primary btn-loading')).click();
    var tableTitle = element(by.xpath('/html/body/div/ui-view/ui-view/div/ui-view/ui-view/ui-view/div[2]/div[2]/div[2]/div/div[2]/pre/code/span[16]')).getText();
    expect(tableTitle).toBe(description);
    var matchingType = element(by.xpath('/html/body/div/ui-view/ui-view/div/ui-view/ui-view/ui-view/div[2]/div[2]/div[2]/div/div[2]/pre/code/span[18]')).getText();
    expect(matchingType).toBe(type);
  };

  this.setValue = function (type) {
    element(by.model('$parent.field.value')).sendKeys(type);
    element(by.className('btn btn-primary btn-loading')).click();
    element(by.className('btn btn-clear ng-scope')).click();
    return require("./decisions_page.js");
  };
};

module.exports = new debugger_page();
