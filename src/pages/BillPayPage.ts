import { Page } from '@playwright/test';

export class BillPayPage {
  constructor(private page: Page) {}

  async makePayment(payee: any, accountId: string) {
    await this.page.click('text=Bill Pay');
    await this.page.fill('input[name="payee.name"]', payee.name);
    await this.page.fill('input[name="payee.address.street"]', payee.street);
    await this.page.fill('input[name="payee.address.city"]', payee.city);
    await this.page.fill('input[name="payee.address.state"]', payee.state);
    await this.page.fill('input[name="payee.address.zipCode"]', payee.zip);
    await this.page.fill('input[name="payee.phoneNumber"]', payee.phone);
    await this.page.fill('input[name="payee.accountNumber"]', payee.accountNo);
    await this.page.fill('input[name="verifyAccount"]', payee.accountNo);
    await this.page.fill('input[name="amount"]', payee.amount);
    await this.page.selectOption('select[name="fromAccountId"]', accountId);
    await this.page.click('input[value="Send Payment"]');
  }
}
