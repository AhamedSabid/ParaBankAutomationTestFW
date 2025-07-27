import { Page } from '@playwright/test';

export class AccountPage {
  constructor(private page: Page) {}

  async openNewAccount() {
    await this.page.click('text=Open New Account');
    await this.page.selectOption('#type', '1'); // Savings
    await this.page.waitForTimeout(3000);
    await this.page.click('//input[@value="Open New Account"]');
    await this.page.waitForSelector('#openAccountResult');
    //return await this.page.locator('#newAccountId').textContent();
    const accountId = await this.page.locator('#newAccountId').textContent();
    if (!accountId) {
      throw new Error('Account ID not found!');
    }
    return accountId;
  }

  async verifyAccountDetails(accountId: string) {
    await this.page.click('text=Accounts Overview');
    const balance = await this.page.locator(`text=${accountId}`).locator('xpath=../..//td[2]').textContent();
    const available = await this.page.locator(`text=${accountId}`).locator('xpath=../..//td[3]').textContent();
    return { balance, available };
  }
}
