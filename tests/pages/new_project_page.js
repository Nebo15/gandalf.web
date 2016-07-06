"use strict";

require("../pages/table_page.js");
require("../pages/settings_page.js");

var new_project_page = function () {

  this.createNewProject = function () {
    element(by.className('create-project ng-scope')).isDisplayed();
  };

  this.createProject = function (title, describe) {
    var titleProject = element.all(by.model('model.title')).first();
    titleProject.sendKeys(title);
    var projectDesc = element.all(by.model('model.description')).first();
    projectDesc.sendKeys(describe);
    element(by.className('btn btn-submit')).click();
    return require("./table_page.js");
  };

  this.getSettings = function () {
    element(by.css('[ui-sref="settings"]')).isDisplayed();
    element(by.css('[ui-sref="settings"]')).click();
    return require("./settings_page.js");
  };
};

module.exports = new new_project_page();
