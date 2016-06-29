"use strict";

var decision_page = function () {

    this.assertRequest = function (text, isset) {
        var request = element(by.xpath('/html/body/div/ui-view/ui-view/div/ui-view/ui-view/div[2]/div/div[2]/div[2]/pre/code/span[2]')).getText();
        expect(request).toBe(text);
        var isSet = element(by.className('form-control-static ng-binding')).getText();
        expect(isSet).toBe(isset);
    };
};

module.exports = new decision_page();