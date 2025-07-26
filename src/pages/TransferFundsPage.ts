import { Page } from '@playwright/test';

export class TransferFundsPage {
  constructor(private page: Page) {}

  async transfer(amount: string, fromAccountId: string, toAccountId: string) {
    await this.page.click('text=Transfer Funds');
    await this.page.fill('#amount', amount);
    await this.page.selectOption('#fromAccountId', fromAccountId);
    await this.page.selectOption('#toAccountId', toAccountId);
    await this.page.click('input[value="Transfer"]');
  }
}
