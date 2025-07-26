import { test, expect } from '@playwright/test';
import { getRandomUsername } from '../util/randomUtil';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';
import { BillPayPage } from '../pages/BillPayPage';
import * as userData from '../data/RegisterTestData.json';
import * as billData from '../data/BillPayTestData.json';

test('Register, Login, Account and BillPay Flow', async ({ page }) => {

  const username = getRandomUsername();
  const password = 'test123';

  const homePage = new HomePage(page);
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);
  const accountPage = new AccountPage(page);
  const transferPage = new TransferFundsPage(page);
  const billPage = new BillPayPage(page);

  await homePage.goto();
  await homePage.clickRegister();

  await registerPage.registerUser({
    firstName: userData.firstName,
    lastName: userData.lastName,
    address: userData.address,
    city: userData.city,
    state: userData.state,
    zip: userData.zip,
    phone: userData.phone,
    ssn: userData.ssn,
    username,
    password
  });

  await expect(page.locator('h1')).toContainText('Welcome ' + username);
  await loginPage.logout();

  await loginPage.login(username, password);
  await expect(page.locator('#overviewAccountsApp')).toBeVisible();

  const accountId = await accountPage.openNewAccount();
  expect(accountId).not.toBeNull();

  const details = await accountPage.verifyAccountDetails(accountId!);
  expect(details.balance).toMatch(/\$\d+\.\d{2}/);

  await transferPage.transfer('50', accountId!, accountId!); // Using same account ID for demo
  await expect(page.locator('text=Transfer Complete!')).toBeVisible();

  await billPage.makePayment({
    name: billData.name,
    street: billData.street,
    city: billData.city,
    state: billData.state,
    zip: billData.zip,
    phone: billData.phone,
    accountNo: billData.accountNo,
    amount: billData.amount
  }, accountId!);

  await expect(page.locator('text=Bill Payment Complete')).toBeVisible();

  await page.close();
});
