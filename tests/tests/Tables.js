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
        home_page.fillSignUpForm(faker.name.findName(), faker.name.findName(), faker.internet.email());
        var welcome_page = home_page.welcomePage();
        var new_project_page = welcome_page.clickContinue();
        new_project_page.createNewProject();
        var table_page = new_project_page.createProject('testProject', 'testDescription');
        var new_tables_page = table_page.addTable();
        new_tables_page.createNewTable('testName', 'testDescription', 'randData', 'description', 'testDescription', 'random', 'randomData', 'olol', 'dfdfs');
        new_tables_page.assertNewTable('testDescription');
    });

    it('DeleteTable test', function () {
        home_page.fillSignUpForm(faker.name.findName(), faker.name.findName(), faker.internet.email());
        var welcome_page = home_page.welcomePage();
        var new_project_page = welcome_page.clickContinue();
        new_project_page.createNewProject();
        var table_page = new_project_page.createProject('Project', 'Description');
        var new_tables_page = table_page.addTable();
        new_tables_page.createNewTable('Name', 'Description', 'Data', 'description', 'testDescription', 'random', 'randomData', 'olol', 'dfdfs');
        new_tables_page.deleteTable('DELETE');
    });

    it('EditTable test', function () {
        home_page.fillSignUpForm(faker.name.findName(), faker.name.findName(), faker.internet.email());
        var welcome_page = home_page.welcomePage();
        var new_project_page = welcome_page.clickContinue();
        new_project_page.createNewProject();
        var table_page = new_project_page.createProject('Project2', 'Description2');
        var new_tables_page = table_page.addTable();
        new_tables_page.createNewTable('Name', 'Description', 'Data', 'description', 'testDescription', 'random', 'randomData', 'olol', 'dfdfs');
        new_tables_page.editTable('edit', 'page', 'randomedit');
    });

    it('DeleteRows test', function () {
        home_page.fillSignUpForm(faker.name.findName(), faker.name.findName(), faker.internet.email());
        var welcome_page = home_page.welcomePage();
        var new_project_page = welcome_page.clickContinue();
        new_project_page.createNewProject();
        var table_page = new_project_page.createProject('Project3', 'Description3');
        var new_tables_page = table_page.addTable();
        for (var i = 0; i < 2; i++) {
            new_tables_page.createNewTable('Name', 'Description', 'Data', 'description', 'testDescription', 'random', 'randomData', 'olol', 'dfdfs');
        }
        new_tables_page.deleteRow('random');
    });

    it('Revisions test', function () {
        home_page.fillSignUpForm(faker.name.findName(), faker.name.findName(), faker.internet.email());
        var welcome_page = home_page.welcomePage();
        var new_project_page = welcome_page.clickContinue();
        new_project_page.createNewProject();
        var table_page = new_project_page.createProject('Project2', 'Description2');
        var new_tables_page = table_page.addTable();
        new_tables_page.createNewTable('Name', 'Description', 'Data', 'description', 'testDescription', 'random', 'randomData', 'olol', 'dfdfs');
        new_tables_page.editTable('edit', 'page', 'randomedit');
        var revisions_page = new_tables_page.getRevision();
        revisions_page.revisionTable();
        new_tables_page.assertRevision('random');
    });

    it('History test', function () {
        home_page.fillSignInForm('furman', 'gt40vt14d');
        var dashboard_page = home_page.submitForm();
        dashboard_page.assertDashboard();
        var history_page = dashboard_page.getHistory();
        history_page.findTable('test1');
    });

    it('Debugger test', function () {
        home_page.fillSignUpForm(faker.name.findName(), faker.name.findName(), faker.internet.email());
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
        home_page.fillSignUpForm(faker.name.findName(), faker.name.findName(), faker.internet.email());
        var welcome_page = home_page.welcomePage();
        var new_project_page = welcome_page.clickContinue();
        new_project_page.createNewProject();
        var table_page = new_project_page.createProject('testProject', 'testDescription');
        var new_tables_page = table_page.addTable();
        new_tables_page.createEmptyTable('YOU SHOULD HAVE AT LEAST 1 ROW');
    });

    it('Try Create Table Without Columns test', function () {
        home_page.fillSignUpForm(faker.name.findName(), faker.name.findName(), faker.internet.email());
        var welcome_page = home_page.welcomePage();
        var new_project_page = welcome_page.clickContinue();
        new_project_page.createNewProject();
        var table_page = new_project_page.createProject('testProject', 'testDescription');
        var new_tables_page = table_page.addTable();
        new_tables_page.createNewTableWithoutColumn('testtest', 'testdecs', 'randData', 'description', 'testdecs', 'random', 'randomData');
        new_tables_page.assertAlertMessage('Should have at least 1 column');
    });

    it('Create Scoring Table test', function () {
        home_page.fillSignUpForm(faker.name.findName(), faker.name.findName(), faker.internet.email());
        var welcome_page = home_page.welcomePage();
        var new_project_page = welcome_page.clickContinue();
        new_project_page.createNewProject();
        var table_page = new_project_page.createProject('testProject', 'testDescription');
        var new_tables_page = table_page.addTable();
        new_tables_page.createNewScoringTable('testtest', 'testdecs', '1', 'description', 'werwer', 'random', 'randomData', 'werwer', 'random');
        new_tables_page.assertNewTable('testdecs');
    });

    it('Clone Rows test', function () {
        home_page.fillSignUpForm(faker.name.findName(), faker.name.findName(), faker.internet.email());
        var welcome_page = home_page.welcomePage();
        var new_project_page = welcome_page.clickContinue();
        new_project_page.createNewProject();
        var table_page = new_project_page.createProject('testProject', 'testDescription');
        var new_tables_page = table_page.addTable();
        new_tables_page.createNewTable('testName', 'testDescription', 'randData', 'description', 'testDescription', 'random', 'randomData', 'olol', 'dfdfs');
        new_tables_page.cloneRows('This table have unsaved data. You need to save changes manually.');
        new_tables_page.assertRowIsCloned('random', 'random');
    });

    it('Decisions history test', function () {
        home_page.fillSignUpForm(faker.name.findName(), faker.name.findName(), faker.internet.email());
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