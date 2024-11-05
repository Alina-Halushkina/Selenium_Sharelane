import {describe} from "mocha";
import { Browser, Builder, By, Key, until, WebDriver } from "selenium-webdriver"
import {expect} from "chai";

describe('[SHARELANE-1] Registration', async () => {

    it('should register a new user', async () => {
        let driver: WebDriver = await new Builder().forBrowser(Browser.CHROME).build();
        try {
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

            const successMessage = await driver.findElement(By.className('confirmation_message'))
            expect(await successMessage.getText()).to.equal('Account is created!')
        } finally {
            await driver.quit()  // await driver.close()
        }
    }).timeout(10000);
    it('should validate incorrect registration data', async () => {
        let driver: WebDriver = await new Builder().forBrowser(Browser.CHROME).build();
        try {
            await driver.get('https://www.sharelane.com/cgi-bin/register.py')
            let continueButton = await driver.findElement(By.css('input[value="Continue"]'))
            let zipCode = await driver.findElement(By.name('zip_code'))
            await zipCode.sendKeys('1111')
            await continueButton.click()

            let errorMessage = await driver.findElement(By.css('.error_message'))
            expect(await errorMessage.getText()).to.equal('Oops, error on page. ZIP code should have 5 digits')

            continueButton = await driver.findElement(By.css('input[value="Continue"]'))
            zipCode = await driver.findElement(By.name('zip_code'))
            await zipCode.sendKeys('11111')
            await continueButton.click()

            const registerButton = await driver.findElement(By.css('input[value="Register"]'))
            await driver.findElement(By.name('first_name')).sendKeys('qqqqq')
            await driver.findElement(By.name('email')).sendKeys('aa.com')
            await driver.findElement(By.name('password1')).sendKeys('11111')
            await driver.findElement(By.name('password2')).sendKeys('11111')
            await registerButton.click()

            errorMessage = await driver.findElement(By.css('.error_message'))
            expect(await errorMessage.getText()).to.equal('Oops, error on page. Some of your fields have invalid data or email was previously used')
        } finally {
            await driver.quit()  // await driver.close()
        }
    }).timeout(10000);
});