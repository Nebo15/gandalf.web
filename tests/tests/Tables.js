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

  it('AddTable test', function () {
    home_page.fillSignUpForm(faker.internet.userName(), 'Gt40vt14d', faker.internet.email());
    var welcome_page = home_page.welcomePage();
    var new_project_page = welcome_page.clickContinue();
    new_project_page.createNewProject();
    var table_page = new_project_page.createProject('testProject', 'testDescription');
    var new_tables_page = table_page.addTable();
    new_tables_page.createNewTable('testName', 'testDescription', 'randData', 'description', 'testDescription', 'random', 'randomData', 'olol', 'dfdfs');
    new_tables_page.assertNewTable('CREATE TABLE');
  });

  it('DeleteTable test', function () {
    home_page.fillSignUpForm(faker.internet.userName(), 'Gt40vt14d', faker.internet.email());
    var welcome_page = home_page.welcomePage();
    var new_project_page = welcome_page.clickContinue();
    new_project_page.createNewProject();
    var table_page = new_project_page.createProject('Project', 'Description');
    var new_tables_page = table_page.addTable();
    new_tables_page.createNewTable('Name', 'Description', 'Data', 'description', 'testDescription', 'random', 'randomData', 'olol', 'dfdfs');
    new_tables_page.deleteTable('DELETE');
  });

  it('EditTable test', function () {
    home_page.fillSignUpForm(faker.internet.userName(), 'Gt40vt14d', faker.internet.email());
    var welcome_page = home_page.welcomePage();
    var new_project_page = welcome_page.clickContinue();
    new_project_page.createNewProject();
    var table_page = new_project_page.createProject('Project2', 'Description2');
    var new_tables_page = table_page.addTable();
    new_tables_page.createNewTable('Name', 'Description', 'Data', 'description', 'testDescription', 'random', 'randomData', 'olol', 'dfdfs');
    new_tables_page.editTable('edit', 'page', 'randomedit');
  });

  it('Revisions test', function () {
    home_page.fillSignUpForm(faker.internet.userName(), 'Gt40vt14d', faker.internet.email());
    var welcome_page = home_page.welcomePage();
    var new_project_page = welcome_page.clickContinue();
    new_project_page.createNewProject();
    var table_page = new_project_page.createProject('Project2', 'Description2');
    var new_tables_page = table_page.addTable();
    new_tables_page.createNewTable('Name', 'Description', 'Data', 'description', 'testDescription', 'random', 'randomData', 'olol', 'dfdfs');
    new_tables_page.editTable('edit', 'page', 'randomedit');
    var revisions_page = new_tables_page.getRevision();
    revisions_page.revisionTable();
    new_tables_page.assertRevision('testDescription');
  });

  xit('Debugger test', function () {
    home_page.fillSignUpForm(faker.internet.userName(), 'Gt40vt14d', faker.internet.email());
    var welcome_page = home_page.welcomePage();
    var new_project_page = welcome_page.clickContinue();
    new_project_page.createNewProject();
    var table_page = new_project_page.createProject('testProject', 'testDescription');
    var new_tables_page = table_page.addTable();
    new_tables_page.createNewTable('testName', 'testDescription', 'randData', 'description', 'testDescription', 'random', 'randomData', 'olol', 'dfdfs');
    var debugger_page = new_tables_page.getDebugger();
    debugger_page.debugTable('"testName"', '"first"');
  });

  it('Try Create Empty Table test', function () {
    home_page.fillSignUpForm(faker.internet.userName(), 'Gt40vt14d', faker.internet.email());
    var welcome_page = home_page.welcomePage();
    var new_project_page = welcome_page.clickContinue();
    new_project_page.createNewProject();
    var table_page = new_project_page.createProject('testProject', 'testDescription');
    var new_tables_page = table_page.addTable();
    new_tables_page.createEmptyTable('You should have at least 1 row');
  });

  it('Try Create Table Without Columns test', function () {
    home_page.fillSignUpForm(faker.internet.userName(), 'Gt40vt14d', faker.internet.email());
    var welcome_page = home_page.welcomePage();
    var new_project_page = welcome_page.clickContinue();
    new_project_page.createNewProject();
    var table_page = new_project_page.createProject('testProject', 'testDescription');
    var new_tables_page = table_page.addTable();
    new_tables_page.createNewTableWithoutColumn('testtest', 'testdecs', 'randData', 'description', 'testdecs', 'random', 'randomData');
    new_tables_page.assertAlertMessage('Check you data and try again.');
  });

  it('Clone Rows test', function () {
    home_page.fillSignUpForm(faker.internet.userName(), 'Gt40vt14d', faker.internet.email());
    var welcome_page = home_page.welcomePage();
    var new_project_page = welcome_page.clickContinue();
    new_project_page.createNewProject();
    var table_page = new_project_page.createProject('testProject', 'testDescription');
    var new_tables_page = table_page.addTable();
    new_tables_page.createNewTable('testName', 'testDescription', 'randData', 'description', 'testDescription', 'random', 'randomData', 'olol', 'dfdfs');
    new_tables_page.cloneRows();
    new_tables_page.assertRowIsCloned('random');
  });

  xit('Decisions history test', function () {
    home_page.fillSignUpForm(faker.internet.userName(), 'Gt40vt14d', faker.internet.email());
    var welcome_page = home_page.welcomePage();
    var new_project_page = welcome_page.clickContinue();
    new_project_page.createNewProject();
    var table_page = new_project_page.createProject('testProject', 'testDescription');
    var new_tables_page = table_page.addTable();
    new_tables_page.createNewTable('testName', 'testDescription', 'randData', 'description', 'testDescription', 'random', 'randomData', 'olol', 'dfdfs');
    var debugger_page = new_tables_page.getDebugger();
    debugger_page.debugTable('"testName"', '"first"');
    var decision_page = debugger_page.setValue('1');
    decision_page.assertRequest('"1"', 'is set');
  });
});
