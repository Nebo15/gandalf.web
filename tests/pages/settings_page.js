"use strict";

var settings_page = function () {

  var submitButton = element.all(by.className('btn btn-primary')).first();

  this.addConsumer = function (description) {
    browser.isElementPresent(by.className('text-primary'));
    element(by.linkText('+ create consumer')).click();
    element(by.model('model.description')).sendKeys(description);
    var checkButton = element.all(by.model('checked')).first();
    checkButton.click();
    submitButton.click();
    element(by.className('btn btn-warning')).click();
    var consumer = element(by.xpath('/html/body/div/ui-view/ui-view/div/ui-view/ui-view/div[2]/div[2]/div[2]/div/div[2]/div/a[1]')).getText();
    expect(consumer).toBe(description);
  };

  this.renameConsumer = function (newConsumerName) {
    element(by.xpath('/html/body/div/ui-view/ui-view/div/ui-view/ui-view/div[2]/div[2]/div[2]/div/div[2]/div/a[1]')).click();
    element(by.model('model.description')).clear();
    element(by.model('model.description')).sendKeys(newConsumerName);
    submitButton.click();
    var consumer = element(by.xpath('/html/body/div/ui-view/ui-view/div/ui-view/ui-view/div[2]/div[2]/div[2]/div/div[2]/div/a[1]')).getText();
    expect(consumer).toBe(newConsumerName);
  };

  this.deleteProject = function (text) {
    browser.isElementPresent(by.buttonText('Delete project'));
    element(by.buttonText('Delete project')).click();
    element(by.model('model.code')).sendKeys(text);
    element(by.buttonText('Delete')).click();
  };

  this.assertNewProjectPage = function () {
    browser.sleep(500);
    browser.ignoreSynchronization = true;
    browser.isElementPresent(by.buttonText('Submit'));
  };

  this.editProject = function (text, desc) {
    browser.isElementPresent(by.css('[project-edit="project"]'));
    element(by.css('[project-edit="project"]')).click();
    element(by.model('project.title')).clear();
    element(by.model('project.title')).sendKeys(text);
    element(by.model('project.description')).clear();
    element(by.model('project.description')).sendKeys(desc);
    element(by.buttonText('Save')).click();
    var editProject = element(by.xpath('/html/body/div/ui-view/ui-view/div/ui-view/ui-view/div[1]/div/div/div/div[1]')).getText();
    var editDesc = element(by.xpath('/html/body/div/ui-view/ui-view/div/ui-view/ui-view/div[1]/div/div/div/div[2]')).getText();
    browser.sleep(500);
    browser.ignoreSynchronization = true;
    expect(editProject).toContain(text);
    expect(editDesc).toContain(desc);
  };
};

module.exports = new settings_page();
