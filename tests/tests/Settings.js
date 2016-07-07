"use strict";

var protractor = require("protractor");
var faker = require('faker');
var url = require('../caps').url;

describe('Gandalf', function () {

  beforeEach(function () {
    browser.driver.manage().window().setSize(1280, 1024);
    browser.get(url);
  });

  var home_page = require("../pages/home_page.js");

  it('AddConsumer test', function () {
    home_page.fillSignUpForm(faker.internet.userName(), 'Gt40vt14d', faker.internet.email());
    var welcome_page = home_page.welcomePage();
    var new_project_page = welcome_page.clickContinue();
    new_project_page.createNewProject();
    new_project_page.createProject('testProject', 'testDescription');
    var settings_page = new_project_page.getSettings();
    settings_page.addConsumer('newConsumer');
  });

  it('Rename Consumer test', function () {
    home_page.fillSignUpForm(faker.internet.userName(), 'Gt40vt14d', faker.internet.email());
    var welcome_page = home_page.welcomePage();
    var new_project_page = welcome_page.clickContinue();
    new_project_page.createNewProject();
    new_project_page.createProject('testProject', 'testDescription');
    var settings_page = new_project_page.getSettings();
    settings_page.addConsumer('newConsumer');
    settings_page.renameConsumer('renameConsumer');
  });

  it('Rename Consumer rus symbols test', function () {
    home_page.fillSignUpForm(faker.internet.userName(), 'Gt40vt14d', faker.internet.email());
    var welcome_page = home_page.welcomePage();
    var new_project_page = welcome_page.clickContinue();
    new_project_page.createNewProject();
    new_project_page.createProject('testProject', 'testDescription');
    var settings_page = new_project_page.getSettings();
    settings_page.addConsumer('конзюмер');
    settings_page.renameConsumer('конзюмерконзюмер');
  });

  it('AddConsumer numbers test', function () {
    home_page.fillSignUpForm(faker.internet.userName(), 'Gt40vt14d', faker.internet.email());
    var welcome_page = home_page.welcomePage();
    var new_project_page = welcome_page.clickContinue();
    new_project_page.createNewProject();
    new_project_page.createProject('789364589734657', '09320970162334');
    var settings_page = new_project_page.getSettings();
    settings_page.addConsumer('12574981260');
  });

  it('DeleteProject test', function () {
    home_page.fillSignUpForm(faker.internet.userName(), 'Gt40vt14d', faker.internet.email());
    var welcome_page = home_page.welcomePage();
    var new_project_page = welcome_page.clickContinue();
    new_project_page.createNewProject();
    new_project_page.createProject('testProject', 'testDescription');
    var settings_page = new_project_page.getSettings();
    settings_page.deleteProject('DELETE');
    settings_page.assertNewProjectPage();
  });
});
