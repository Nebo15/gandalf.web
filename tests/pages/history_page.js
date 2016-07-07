"use strict";

var history_page = function () {

  this.findTable = function (text) {
    element(by.xpath('//*[@id="navbar-menu"]/ul[2]/li[2]/a1')).click();
    var myInput = element(by.model('filters.table.title')).sendKeys(text);
    myInput.sendKeys(text, protractor.Key.ENTER);
    var table = element(by.xpath('/html/body/div/ui-view/ui-view/div/ui-view/ui-view/div[2]/div[2]/table/tbody/tr[1]/td[4]')).getText();
    expect(table).toBe(text);
  };
};

module.exports = new history_page();
