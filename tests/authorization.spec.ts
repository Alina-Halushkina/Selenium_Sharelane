import {describe} from "mocha";
import { Browser, Builder, By, Key, until, WebDriver } from "selenium-webdriver"
import {expect} from "chai";

describe('[SHARELANE-2] Authorization', async () => {
    let driver: WebDriver

    beforeEach(async function () {
        driver = await new Builder().forBrowser(Browser.CHROME).build()
    })

    afterEach(async function () {
        await driver.quit()
    })

    it('should authorize user', async () => {
        await driver.get('https://www.sharelane.com/cgi-bin/register.py')
        const continueButton = await driver.findElement(By.css('input[value="Continue"]'))
        const zipCode = await driver.findElement(By.name('zip_code'))
        await zipCode.sendKeys('11111')
        await continueButton.click()

        const registerButton = await driver.findElement(By.css('input[value="Register"]'))
        await driver.findElement(By.name('first_name')).sendKeys('qqqqq')
        await driver.findElement(By.name('last_name')).sendKeys('qqqqq')
        await driver.findElement(By.name('email')).sendKeys('qqq@aaa.com')
        await driver.findElement(By.name('password1')).sendKeys('11111')
        await driver.findElement(By.name('password2')).sendKeys('11111')
        await registerButton.click()

        let successRegistrationMessage = await driver.findElement(By.className('confirmation_message'))
        expect(await successRegistrationMessage.getText()).to.equal('Account is created!')

        const emailElement = await driver.findElement(By.css('html > body > center > table > tbody > tr:nth-of-type(6) > td > table > tbody > tr:nth-of-type(4) > td > table > tbody > tr:nth-of-type(1) > td:nth-of-type(2) > b'))
        const email = await emailElement.getText()

        await driver.get('https://sharelane.com/cgi-bin/main.py')
        await driver.findElement(By.name('email')).sendKeys(email)
        await driver.findElement(By.name('password')).sendKeys('1111')
        const loginButton = await driver.findElement(By.css('input[value="Login"]'))
        await loginButton.click()

        await driver.wait(until.urlContains('cgi-bin/main.py'), 10000)
        let successAuthorizationMessage = await driver.findElement(By.className('user'))
        const logout = await driver.findElement(By.css('html > body > center > table > tbody > tr:nth-of-type(3) > td > a'))

        expect(await successAuthorizationMessage.getText()).to.contains('Hello')
        expect(await logout.getText()).to.equal('Logout')
    });
})