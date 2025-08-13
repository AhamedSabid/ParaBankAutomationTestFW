import { test, expect,request } from '@playwright/test';
import { getRandomUsername } from '../util/randomUtil';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';
import { BillPayPage } from '../pages/BillPayPage';
import * as userData from '../data/RegisterTestData.json';
import * as billData from '../data/BillPayTestData.json';
import { allure} from 'allure-playwright';

test.describe.configure({ mode: 'serial' });
var accountId: string = '';
var username = getRandomUsername();
var password = 'test123';

test('Register, Login, Account and BillPay Flow', async ({ page }) => {

  allure.label("owner", "Ahamed");
  allure.feature("TC-001- Register, Login, Account and BillPay Flow");
  allure.story("Verify - Register, Login, Account and BillPay Flow");
  allure.severity("critical");
  allure.link("https://parabank.parasoft.com/", "Application Under Test");

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

  
  accountId = await accountPage.openNewAccount();
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


test('Validate Transactions from API', async ({ request }) => {

  allure.label("owner", "Ahamed");
  allure.feature("TC-002- Validate Transactions from API");
  allure.story("Verify - Transactions from API");
  allure.severity("critical");
  allure.link("https://parabank.parasoft.com/", "Application Under Test");

  const baseURL = 'https://parabank.parasoft.com';
  // how to dynamically capture this from UI step 5 from the previous test
  // dynamically capture this from UI step 5
  const amount = 50;
//pass basic authentication if required for GET request
   const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');
//pass auth as basic authentication
  const response = await request.get(`${baseURL}/parabank/services_proxy/bank/accounts/${accountId}/transactions`, {
    params: {
      amount: amount
    },
    headers: {
      'Authorization': `Basic ${encodedCredentials}`
    }
  });

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
//response body 
  const responseBody = await response.json();

  console.log('API Response:', responseBody);

  // Assertions (sample structure — adjust as per actual API response)
  expect(responseBody).toBeInstanceOf(Array);
  expect(responseBody.length).toBeGreaterThan(0);

  for (const txn of responseBody) {
    //expect(txn.amount).toBe(amount);
    expect(txn.accountId.toString()).toBe(accountId);
    expect(new Date(txn.transactionDate)).not.toBeNaN(); // date valid
  }
});

