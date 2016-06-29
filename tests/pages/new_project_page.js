"use strict";

require("../pages/table_page.js");
require("../pages/settings_page.js");

var new_project_page = function () {

    this.createNewProject = function () {
        browser.isElementPresent(by.className('form-block'));
    };

    this.createProject = function (title, describe) {
        element(by.model('model.title')).sendKeys(title);
        element(by.model('model.description')).sendKeys(describe);
        element(by.className('btn btn-primary')).click();
        return require("./table_page.js");
    };

    this.getSettings = function () {
        browser.isElementPresent(by.css('[ui-sref="settings"]'));
        element(by.css('[ui-sref="settings"]')).click();
        return require("./settings_page.js");
    };
};

module.exports = new new_project_page();