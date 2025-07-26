import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('input[value="Log In"]');
  }

  async logout() {
    await this.page.click('text=Log Out');
  }
}
import { getRandomUsername } from '../util/randomUtil'; 