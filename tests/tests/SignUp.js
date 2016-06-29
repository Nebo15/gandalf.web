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

    it('SignUp test', function () {
        home_page.fillSignUpForm(faker.name.findName(), faker.name.findName(), faker.internet.email());
        var welcome_page = home_page.welcomePage();
        var new_project_page = welcome_page.clickContinue();
        new_project_page.createNewProject();
    });

    it('SignUp test empty password', function () {
        home_page.fillSignUpForm(faker.name.findName(), '', faker.internet.email());
        home_page.assertAlertMessage();
    });

    it('SignUp test empty login', function () {
        home_page.fillSignUpForm('', faker.name.findName(), faker.internet.email());
        home_page.assertAlertMessage();
    });

    it('SignUp test empty mail', function () {
        home_page.fillSignUpForm(faker.name.findName(), faker.name.findName(), '');
        home_page.assertAlertMessage();
    });

    it('SignUp test bad mail', function () {
        home_page.fillSignUpForm(faker.name.findName(), faker.name.findName(), 'ahjsgfhjasdf');
        home_page.assertAlertMessage();
    });

    it('SignUp test bad mail symbols', function () {
        home_page.fillSignUpForm(faker.name.findName(), faker.name.findName(), '!^@%$#&!@(^#*%(@&*!');
        home_page.assertAlertMessage();
    });

    it('SingUp short pass test', function () {
        home_page.fillSignUpForm(faker.name.findName(), 'sd', faker.internet.email());
        home_page.assertAlertMessage();
    });

    it('SingUp bad pass test', function () {
        home_page.fillSignUpForm(faker.name.findName(), 'gt40vt14d', faker.internet.email());
        home_page.assertAlertMessage();
    });
});