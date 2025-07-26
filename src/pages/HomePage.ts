import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly registerLink: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.registerLink = page.getByRole('link', { name: 'Register' });
    this.logo = page.getByRole('img', { name: 'ParaBank' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickRegister() {
    await this.registerLink.click();
  }
}